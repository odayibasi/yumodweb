/* ======================================================
 *  Name:   Model.js
 *  Desc:   Folder And Story Structure
 *  Author: Onur DAYIBASI
 *  Date: 01.12.2017
 =========================================================*/

var fModelFactory = {};
fModelFactory.newModel = function(config) {

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


    var tempValueMapForCloning = {};
    var fModel = {};
    fModel.medium_accountname = "";
    fModel.folders = new Array();
    fModel.storyMap = {};




    /*================================================================
    * FOLDER
    =================================================================*/

    function Folder(name) {
        this.name = name;
        this.uuid = guid();
        this.stories = new Array();
    }


    fModel.addFolder = function(name) {
        var folder = new Folder(name);
        fModel.folders.push(folder);
        return folder;
    };

    fModel.addFolderToFirst = function(name) {
        var folder = new Folder(name);
        fModel.folders.unshift(folder);
        return folder;
    };



    fModel.getFolder = function(uuid) {
        var folders = fModel.folders
        for (var i = 0; i < folders.length; i++) {
            if (folders[i].uuid == uuid) {
                return folders[i];
            }
        }
    }



    fModel.getFolderIndex = function(uuid) {
        var folders = fModel.folders
        for (var i = 0; i < folders.length; i++) {
            if (folders[i].uuid == uuid) {
                return i;
            }
        }
    }


    fModel.listFolder = function() {
        return fModel.folders;
    }


    fModel.updateFolder = function(uuid, params) {
        if (params == null) return;

        var folder = fModel.getFolder(uuid);
        if (folder == null) return;


        if (params.hasOwnProperty('name')) {
            folder.name = params.name;
        }

        if (params.hasOwnProperty('lastEditDate')) {
            folder.lastEditDate = params.lastEditDate;
        }

    }


    fModel.deleteFolder = function(uuid) {

        var folder = fModel.getFolder(uuid);

        //Delete From Story Map
        for (var i = 0; i < folder.stories.length; i++) {
            var s = folder.stories[i];
            delete fModel.storyMap[s.uuid];
        }

        var folderIndex = fModel.getFolderIndex(uuid);
        fModel.folders.splice(folderIndex, 1);
    }

    fModel.clearFolder = function(uuid) {
        var folder = fModel.getFolder(uuid);

        //Delete From Story Map
        for (var i = 0; i < folder.stories.length; i++) {
            var s = folder.stories[i];
            delete fModel.storyMap[s.uuid];
        }

        //Clear Stories Array
        folder.stories = new Array();
    }




    /*================================================================
    * STORY
    =================================================================*/

    function Story(folderUUID, storyUUUID, sTitle, sUrl, sPublishedDate, sTotalClaps) {
        this.sTitle = sTitle;
        this.sUrl = sUrl;
        this.sPublishedDate = sPublishedDate;
        this.uuid = storyUUUID;
        this.folderUUID = folderUUID;
        this.sTotalClaps = sTotalClaps
    }


    fModel.addStory = function(folderUUID, storyUUUID, sTitle, sUrl, sPublishedDate, sTotalClaps) {
        var story = new Story(folderUUID, storyUUUID, sTitle, sUrl, sPublishedDate, sTotalClaps);
        var folder = this.getFolder(folderUUID);
        folder.stories.push(story);
        story.sIndex = folder.stories.length - 1;
        fModel.storyMap[story.uuid] = story;
        return story;
    };


    fModel.insertStory = function(story, index) {
        var folder = this.getFolder(story.folderUUID);
        folder.stories.splice(index, 0, story);
        fModel.storyMap[story.uuid] = story;
        return story;
    };


    fModel.cloneStory = function(storyUUID, tag) {
        var story = fModel.storyMap[storyUUID]
        if (story == null) return;
        var newStory = jQuery.extend(true, {}, story);

        if (tag == null) newStory.name = story.name + "_Copied";
        else newStory.name = story.name + "_" + tag;

        tempValueMapForCloning = {};
        this.changeStoryUUIDs(newStory);
        fModel.storyMap[newStory.uuid] = newStory;
        return newStory;
    }

    fModel.changeStoryUUIDs = function(jsonObj, realObj) {

        if (jsonObj instanceof Object) {
            for (key in jsonObj) {
                this.changeStoryUUIDs(jsonObj[key], jsonObj);
            }
        } else {
            if (key.toUpperCase().includes("UUID") && key != "holderUUID" && key != "folderUUID") {
                if (tempValueMapForCloning[jsonObj] != undefined) {
                    value = tempValueMapForCloning[jsonObj];
                } else {
                    tempValueMapForCloning[jsonObj] = guid();
                    value = tempValueMapForCloning[jsonObj];
                }
                var oldValue = realObj[key];
                realObj[key] = value;
                console.log(key + " oldval:" + oldValue + " newval:" + value);
            } else {
                console.log(key + ":" + realObj[key]);
            }
        }
    }



    fModel.getStory = function(uuid) {
        return fModel.storyMap[uuid];
    }


    fModel.getStoryIndex = function(folderUUID, uuid) {
        var folder = this.getFolder(folderUUID);
        var storys = folder.stories;
        for (var i = 0; i < storys.length; i++) {
            if (storys[i].uuid == uuid) {
                return i;
            }
        }
        return -1;
    }

    fModel.listStory = function(folderUUID) {
        var folder = this.getFolder(folderUUID);
        return folder.stories;
    }



    fModel.updateStory = function(uuid, params) {
        if (params == null) return;

        var story = fModel.storyMap[uuid]
        if (story == null) return;


        if (params.hasOwnProperty('name')) {
            story.name = params.name;
        }

    }

    fModel.deleteStory = function(uuid) {
        var story = fModel.storyMap[uuid];
        var folder = this.getFolder(story.folderUUID);
        var storyIndex = this.getStoryIndex(story.folderUUID, uuid);
        folder.stories.splice(storyIndex, 1);
        delete fModel.storyMap[uuid];
    }



    /*================================================================
    *PERSIST
    =================================================================*/

    fModel.toJSON = function() {
        var obj = { medium_accountname: fModel.medium_accountname, version: "0.0.4", folders: fModel.folders, versions: fModel.versions };
        return JSON.stringify(obj);

    }

    fModel.fromJSON = function(modelObj) {
        fModel.folders = modelObj.folders;
        fModel.version = modelObj.version;
        fModel.medium_accountname = modelObj.medium_accountname;

        //Folders
        for (var i = 0; i < fModel.folders.length; i++) {
            var folder = fModel.folders[i];
            for (var j = 0; j < folder.stories.length; j++) {
                var story = folder.stories[j];
                fModel.storyMap[story.uuid] = story;
            }
        } //end of folders


    }



    return fModel;
};