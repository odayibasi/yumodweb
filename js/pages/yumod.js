var access_token = "";
var id_token = "";
var selectedFolderUUID = null;
var isStoryLibMode = true;
var isStoryLibSort = "Date";

//Model
var storyModel = null;
var fModel = fModelFactory.newModel();


$(document).ready(function() {
    access_token = localStorage.getItem("access_token")
    id_token = localStorage.getItem("id_token")

    $.ajaxSetup({
        "async": true,
        "crossDomain": true,
        "headers": {
            "authorization": "Bearer " + access_token
        }
    });


    $("#btnCreateStoryLib").click(function(e) {
        e.preventDefault();
        callCreateStoryLib();

    });

    $("#btnCreateFolder").click(function(e) {
        e.preventDefault();
        var folderName = $("#txtFolderName").val();
        fModel.addFolder(folderName);
        renderFolders(fModel);
    });

    $("#btnUpdateFolder").click(function(e) {
        e.preventDefault();
        if (selectedFolderUUID != null) {
            var folderName = $("#txtFolderName").val();
            var params = { name: folderName };
            fModel.updateFolder(selectedFolderUUID, params);
            renderFolders(fModel);
        } else {
            alert("No Selected Folder Exist. Please Select Folder");
        }
    });


    $("#btnDeleteFolder").click(function(e) {
        e.preventDefault();
        if (selectedFolderUUID != null) {
            fModel.deleteFolder(selectedFolderUUID);
            selectedFolderUUID = null;
            renderFolders(fModel);
            renderStoriesInFolder();
        } else {
            alert("No Selected Folder Exist. Please Select Folder");
        }
    });



    $("#btnClearFolder").click(function(e) {
        e.preventDefault();
        if (selectedFolderUUID != null) {
            fModel.clearFolder(selectedFolderUUID);
            renderStoriesInFolder();
        } else {
            alert("No Selected Folder Exist. Please Select Folder");
        }
    });


    $("#btnShareFolder").click(function(e) {
        e.preventDefault();
        callShareFolderModel();
    });


    $("#btnSaveFolders").click(function(e) {
        e.preventDefault();
        callSaveFolderModel();
    });







    $(document).on("click", ".folderLib-menu", function(e) {
        e.preventDefault();
        selectedFolderUUID = $(this).attr("id");
        $(".folderLib-menu").removeClass("active");
        $(this).addClass("active");
        renderStoriesInFolder();
    })


    $(document).on("click", ".btnAddStory", function(e) {
        e.preventDefault();
        if (selectedFolderUUID == null) {
            alert("Please Select Folder First");
            return;
        }

        var realObj = $(this).parent().children("a")
        var sUUID = realObj.attr("data");

        if (fModel.getStoryIndex(selectedFolderUUID, sUUID) == -1) {

            for (var i = 0; i < storyModel.stories.length; i++) {
                if (storyModel.stories[i].uuid == sUUID) {
                    var s = storyModel.stories[i];
                    fModel.addStory(selectedFolderUUID, s.uuid, s.sTitle, s.sUrl, s.sPublishedDate, s.sTotalClaps);

                    fModel.updateFolder(selectedFolderUUID, { lastEditDate: getFormattedDate() });
                    $("#storyInFolderLastUpdate").text("Last Edited: " + getFormattedDate());

                    renderStoriesInFolder();
                    break;
                }
            }

        } else {
            alert("Same Story Exist In This Folder");
        }

    })



    $(document).on("click", ".btnDelStory", function(e) {
        e.preventDefault();
        if (selectedFolderUUID == null) {
            alert("Please Select Folder First");
            return;
        }

        fModel.updateFolder(selectedFolderUUID, { lastEditDate: getFormattedDate() });
        $("#storyInFolderLastUpdate").text("Last Edited: " + getFormattedDate());


        var realObj = $(this).parent().children("a")
        var sUUID = realObj.attr("data");
        fModel.deleteStory(sUUID);
        renderStoriesInFolder();
    })


    $('body').on("keyup", "#txtSearchStory", function(e) {
        e.preventDefault();
        filterStoryLib();
    });


    $('body').on("keyup", "#txtSearchInFolder", function(e) {
        e.preventDefault();
        filterStoryInFolder();
    });



    $('body').on("keyup", "#txtSearchFolder", function(e) {
        e.preventDefault();
        filterFolderLib();
    });






    $(".folderLib-menu").click(function(e) {
        var folderName = $("#txtFolderName").val();
        for (var i = 0; i < fModel.listFolders.length; i++) {
            var folder = fModel.listFolders[i];
            if (folder.name == folderName) {
                selectedFolderUUID = folder.uuid;
                $("#" + selectedFolderUUID).addClass("selected-folder");
                break;
            }
        }
    });


    $("#btnStoryLibDispAll").click(function(e) {
        e.preventDefault();
        $("#btnStoryLibDispAll").addClass("active");
        $("#btnStoryLibDispNotArchieved").removeClass("active");
        isStoryLibMode = false;
        applyStoryLibMode();
    });

    $("#btnStoryLibDispNotArchieved").click(function(e) {
        e.preventDefault();
        $("#btnStoryLibDispAll").removeClass("active");
        $("#btnStoryLibDispNotArchieved").addClass("active");
        isStoryLibMode = true;
        applyStoryLibMode();
    });


    $("#btnStoryLibSortByDate").click(function(e) {
        e.preventDefault();
        $(".btn-storylib-sort").removeClass("active");
        $("#btnStoryLibSortByDate").addClass("active");
        isStoryLibSort = "Date";
        applyStoryLibMode();
    });


    $("#btnStoryLibSortByClaps").click(function(e) {
        e.preventDefault();
        $(".btn-storylib-sort").removeClass("active");
        $("#btnStoryLibSortByClaps").addClass("active");
        isStoryLibSort = "Claps";
        applyStoryLibMode();
    });


    $("#btnStoryLibSortByContent").click(function(e) {
        e.preventDefault();
        $(".btn-storylib-sort").removeClass("active");
        $("#btnStoryLibSortByContent").addClass("active");
        isStoryLibSort = "Content";
        applyStoryLibMode();
    });




    callCreateStoryLib();
    callGetFolderModel();



    Sortable.create(folderLib, {

        // Element dragging ended
        onEnd: function( /**Event*/ evt) {
            var itemEl = evt.item; // dragged HTMLElement
            evt.to; // target list
            evt.from; // previous list
            evt.oldIndex; // element's old index within old parent
            evt.newIndex; // element's new index within new parent
            console.log("onEnd")

            var fIndex = 0;
            $(".folderLib-menu").each(function() {
                folderUUID = $(this).attr("id");
                folder = fModel.getFolder(folderUUID);
                folder.fIndex = fIndex++;
            });

        }
    });


    Sortable.create(storiesInFolderList, {

        // Element dragging ended
        onEnd: function( /**Event*/ evt) {
            var itemEl = evt.item; // dragged HTMLElement
            evt.to; // target list
            evt.from; // previous list
            evt.oldIndex; // element's old index within old parent
            evt.newIndex; // element's new index within new parent
            console.log("onEnd")

            var sIndex = 0;
            $(".storyInFolder-menuX").each(function() {
                var storyUUID = $(this).children(".storyInFolder-menu").attr("data");
                var story = fModel.getStory(storyUUID);
                story.sIndex = sIndex++;
            });

        }
    });


}); //End of JQuery Init







function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile_name');
    localStorage.removeItem('profile_email');
    window.location.href = "/";
}



function applyStoryLibMode() {
    console.log(isStoryLibMode);
    console.log(isStoryLibSort);

    if (storyModel == null) {
        return; //
    }


    var inFolderStoryUUIDs = [];
    for (storyUUID in fModel.storyMap) {
        //console.log(storyUUID);
        inFolderStoryUUIDs.push(storyUUID);
    }

    var filteredStoryModel = { stories: [] };
    var sortedStoryModel = { stories: [] };



    filteredStoryModel.stories = storyModel.stories.filter(function(s) {
        return !inFolderStoryUUIDs.includes(s.uuid);
    });

    $("#libCount").text(storyModel.stories.length + "");
    $("#notArchievedCount").text(filteredStoryModel.stories.length + "");



    if (isStoryLibMode) {


        sortedStoryModel.stories = _.sortBy(filteredStoryModel.stories, function(s) {
            if (isStoryLibSort == "Content") {
                return s.sTitle;
            } else if (isStoryLibSort == "Claps") {
                return -s.sTotalClaps;
            } else {
                return -s.sPublishedDate;
            }
        });


        var theTemplate = $("#storyLib-menu-template").html();
        var theHtml = Mustache.to_html(theTemplate, sortedStoryModel);
        $("#storyLib").html(theHtml);
    } else {



        sortedStoryModel.stories = _.sortBy(storyModel.stories, function(s) {
            if (isStoryLibSort == "Content") {
                return -s.sTitle;
            } else if (isStoryLibSort == "Claps") {
                return -s.sTotalClaps;
            } else {
                return -s.sPublishedDate;
            }
        });


        var theTemplate = $("#storyLib-menu-template").html();
        var theHtml = Mustache.to_html(theTemplate, sortedStoryModel);
        $("#storyLib").html(theHtml);
    }

    filterStoryLib();
    filterFolderLib();


}





function callPrivateRestService() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.yumod.com/api/private",
        "method": "GET",
        "headers": {
            "authorization": "Bearer " + access_token
        }
    }

    $.ajax(settings).done(function(response) {
        console.log(response.message);
        alert(response.message);
    });

}

function callPublicRestService() {

    var publicSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.yumod.com/api/public",
        "method": "GET",
    }

    $.ajax(publicSettings).done(function(response) {
        console.log(response.message);
        alert(response.message);
    });

}




function callCreateStoryLib() {

    var refreshFlagMap = { checkMediumAccountUpdateFlag: $("#chckUpdateAccountName").is(':checked') };
    var mediumAccount = { medium_accountname: $("#txtMediumAccount").val(), "refreshFlagMap": refreshFlagMap };
    var mediumAccountStr = JSON.stringify(mediumAccount);


    var url = "https://api.yumod.com/api/mediumconnects";
    $.ajax({
        type: "POST",
        url: url,
        data: mediumAccountStr,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data.result) {

                //RefreshDate
                $("#storyLibLastUpdate").text("Last Update: " + getFormattedDate());

                //MainMenu (For Dynamic Menu)
                storyModel = data.data;
                derivedProp4Index(storyModel.stories, "sIndex");
                var theTemplate = $("#storyLib-menu-template").html();
                var theHtml = Mustache.to_html(theTemplate, storyModel);
                $("#storyLib").html(theHtml);
                applyStoryLibMode();
            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
            $("#warningArea").html(textStatus.responseText);

        }
    });
}




function callSaveFolderModel() {


    var url = "https://api.yumod.com/api/foldermodel";
    $.ajax({
        type: "POST",
        url: url,
        data: fModel.toJSON(),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data.result) {
                fModel.fromJSON(data.data);
                renderFolders(fModel);
                renderStoriesInFolder();
            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
            $("#warningArea").html(textStatus.responseText);

        }
    });
}


function callShareFolderModel() {

    var url = "https://api.yumod.com/api/dashboard";
    $.ajax({
        type: "POST",
        url: url,
        data: fModel.toJSON(),
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data.result) {
                $("#btnYourDashboard").attr("href", "dashboard.html#" + data.dashboardID);
                $("#btnYourDashboard").show();
            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
            $("#warningArea").html(textStatus.responseText);

        }
    });
}







function callGetFolderModel() {

    var url = "https://api.yumod.com/api/foldermodel";
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data.result) {
                fModel.fromJSON(data.data);
                renderFolders(fModel)


            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
            $("#warningArea").html(textStatus.responseText);

        }
    });

}



/*============================================================================
        RENDERS
==============================================================================*/


function renderFolders(folderModel) {
    var sortedFolderModel = { folders: [] };
    sortedFolderModel.folders = _.sortBy(folderModel.folders, function(f) {
        return f.fIndex;
    });

    var theTemplate = $("#folderLib-menu-template").html();
    var theHtml = Mustache.to_html(theTemplate, sortedFolderModel);
    $("#folderLib").html(theHtml);
    applyStoryLibMode();
}




function renderStoriesInFolder() {

    //Folder List
    applyStoryLibMode();

    if (selectedFolderUUID != null) {

        //Menu Active
        $("#" + selectedFolderUUID).addClass("active");

        //Get Folder Model    
        var folderModel = fModel.getFolder(selectedFolderUUID);

        //Update Last UpdateTime
        var lastEditDate = folderModel.lastEditDate == undefined ? "Not Updated" : folderModel.lastEditDate;
        $("#storyInFolderLastUpdate").text("Last Edited: " + lastEditDate);

        //StoryInFolder
        var sortedStoryModel = { stories: [] };
        sortedStoryModel.stories = _.sortBy(folderModel.stories, function(s) {
            return s.sIndex;
        });

        var theTemplate = $("#storyInFolder-menu-template").html();
        derivedProp4FixedDisp(folderModel.stories, "sTitle", "sDispTitle", 60);
        var theHtml = Mustache.to_html(theTemplate, sortedStoryModel);
        $("#storiesInFolderList").html(theHtml);
    } else {
        $("#storiesInFolderList").html("");
    }
}






/*============================================================================
        FILTERS
==============================================================================*/


function filterStoryLib() {
    var filter = $("#txtSearchStory").val().toUpperCase();
    $(".storyLib-menu").each(function() {
        if ($(this).text().toUpperCase().indexOf(filter) > -1) {
            $(this).parent().show();
        } else {
            $(this).parent().hide();
        }
    });

}

function filterStoryInFolder() {

    var filter = $("#txtSearchInFolder").val().toUpperCase();
    $(".storyInFolder-menu").each(function() {
        if ($(this).text().toUpperCase().indexOf(filter) > -1) {
            $(this).parent().show();
        } else {
            $(this).parent().hide();
        }
    });
}


function filterFolderLib() {
    var filter = $("#txtSearchFolder").val().toUpperCase();
    $(".folderLib-menu").each(function() {
        if ($(this).children(".folder_title").text().toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

}