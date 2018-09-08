'use strict';

$(document).ready(function() {

    chrome.tabs.getSelected(null, function(tab) {
        checkURLToFindAccountName(tab.url);
    });


    $("#startWriterAnalysing").click(function(e) {
        // var accountName = "jeffhale"
        // isWriterInfoExist(accountName);

        // chrome.tabs.getSelected(null, function(tab) {
        //     checkURLToFindAccountName(tab.url);
        // });


    })




});


function checkURLToFindAccountName(url) {


    var errMsg = "This page is not medium.com story";
    var urlJSON = url + "?format=json";
    $.ajax({
        url: urlJSON,
        dataType: "text",
        type: 'GET',
        success: function(html, textStatus, errorThrown) {
            var content = html.substring(16);
            var jContent = JSON.parse(content);
            if (jContent.success && jContent.payload && jContent.payload.references && jContent.payload.references.User) {
                var userObj = jContent.payload.references.User;
                var user = userObj[Object.keys(userObj)[0]];
                if (user != undefined || user != null) {
                    isWriterInfoExist(user.username);
                } else {
                    alert(errMsg);
                }

            } else {
                alert(errMsg);
            }
        },
        error: function(html, textStatus, errorThrown) {
            alert(errMsg);
        }
    });
}





function isWriterInfoExist(accountName) {

    chrome.runtime.sendMessage({
        op: 'isWriterInfoPersisted',
        data: { key: accountName }
    }, function(resp) {
        if (Object.keys(resp.data).length === 0) {
            checkMediumAccountAndFillModel(accountName)
        } else {
            alert(JSON.stringify(resp));
            window.close();
        }
    });
}

function sendWritersInfo2Background(accountName, val) {
    chrome.runtime.sendMessage({
        op: 'persistWriterInfo',
        data: { key: accountName, val: val }
    }, function(resp) {
        if (resp != undefined)
            console.log(JSON.stringify(resp));
        else {
            console.log(JSON.stringify(resp));
            window.close();
        }
    });
}




function checkMediumAccountAndFillModel(medium_accountname) {

    var urlTemp = "https://medium.com/@$medium_account?format=json"
    var url = urlTemp.replace("$medium_account", medium_accountname);
    $.ajax({
        url: url,
        dataType: "text",
        type: 'GET',
        success: function(html, textStatus, errorThrown) {
            var content = html.substring(16);
            var jContent = JSON.parse(content);
            if (jContent.success) {
                var postModel = { storyModel: { stories: [] }, req: { body: { medium_accountname: medium_accountname } } }
                postModel.storyModel.userId = jContent.payload.user.userId;
                postModel.storyModel.medium_accountname = medium_accountname;
                postModel.storyModel.version = "1.0.0";
                findAllMediumPostAndFillModel(postModel);
            } else {
                //postModel.res.json({ result: false, msg: 'Invalid User Account' });
                //postModel.res.status(200).end();
            }
        },
        error: function(html, textStatus, errorThrown) {
            console.log(html);
        }
    });

}


function findAllMediumPostAndFillModel(postModel) {

    var pagingTo = postModel.pagingTo != undefined ? "&to=" + postModel.pagingTo : "";
    var urlTemp = "https://medium.com/_/api/users/$userId/profile/stream?source=latest&limit=100$pagingTo";
    var url = urlTemp.replace("$userId", postModel.storyModel.userId).replace("$pagingTo", pagingTo);
    console.log(url);
    $.ajax({
        url: url,
        dataType: "text",
        type: 'GET',
        success: function(html, textStatus, errorThrown) {

            var content = html.substring(16);
            var jContent = JSON.parse(content);
            var posts = jContent.payload.references.Post;
            if (jContent.payload.paging.next == undefined) { //Last Paging
                var accountName = postModel.req.body.medium_accountname;
                var val = JSON.stringify(postModel);
                sendWritersInfo2Background(accountName, val);
            } else {
                postModel.pagingTo = jContent.payload.paging.next.to;
                console.log(postModel.pagingTo);
                for (var pKey in posts) {
                    var pItem = posts[pKey];
                    var sUrl = "https://medium.com/p/" + pItem.uniqueSlug;
                    var sTotalClaps = pItem.virtuals.totalClapCount;

                    //Publish Date
                    var d = new Date(parseInt(pItem.latestPublishedAt)); // The 0 there is the key, which sets the date to the epoch
                    var sPublishedDate = d.toISOString().replace('-', '/').split('T')[0].replace('-', '/');

                    var existStoryIndex = -1;
                    var stories = postModel.storyModel.stories;
                    for (var i = 0; i < stories.length; i++) {
                        if (stories[i].sUrl === sUrl) {
                            existStoryIndex = i;
                            break;
                        }
                    }

                    if (existStoryIndex === -1) { //Not Exist In StoryModel
                        stories.push({ sTitle: pItem.title, sUrl: sUrl, sPublishedDate: sPublishedDate, uuid: sUrl, sTotalClaps: sTotalClaps });
                    } else {
                        var story = stories[existStoryIndex];
                        story.sTitle = pItem.title;
                        story.sUrl = sUrl;
                        story.sPublishedDate = sPublishedDate;
                        //uuid not updated..
                        story.sTotalClaps = sTotalClaps;
                    }
                }
                findAllMediumPostAndFillModel(postModel);
            }


        },
        error: function(html, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });
}