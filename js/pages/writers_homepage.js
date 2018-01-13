var folderModel = null;

$(document).ready(function() {

    $.ajaxSetup({
        "async": true,
        "crossDomain": true
    });

    var url = document.URL;
    userId = url.substring(url.indexOf("#") + 1);
    callGetDashboardData(userId);


    $('body').on("keyup", "#txtSearchStory", function(e) {
        e.preventDefault();
        filterStoryLib();
    });



    $('#toggleFolder').change(function() {
        var collapseFlag=$(this).prop('checked');
        if(collapseFlag){
            $(".panel-collapse").removeClass("in");              
        }else{
            $(".panel-collapse").addClass("in");                          
        }
    })



    //Insert Sharings
    var shareData = { shareURL: url }
    var theTemplate = $("#share-template").html();
    var theHtml = Mustache.to_html(theTemplate, shareData);
    $("#share-buttons").html(theHtml);



});


function callGetDashboardData(userId) {

    var url = "https://s3-us-west-1.amazonaws.com/yumod.com.share/accounts/" + userId + "/foldermodel.json?" + guid();
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data != undefined) {
                folderModel = data;
                $(".se-pre-con").fadeOut("slow");
                renderStories();
            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
        }
    });

}


function renderStories() {

    if (folderModel == null) {
        return;
    }

    var data = folderModel;
    var sortedFolderModel = { folders: [] };
    sortedFolderModel.folders = _.sortBy(data.folders, function(f) {
        return f.fIndex;
    });


    for (var i = 0; i < sortedFolderModel.folders.length; i++) {
        var stories = sortedFolderModel.folders[i].stories;
        sortedFolderModel.folders[i].stories = _.sortBy(stories, function(s) {
            return s.sIndex;
        });

    }


    var theTemplate = $("#folderLib-menu-template").html();
    var theHtml = Mustache.to_html(theTemplate, sortedFolderModel);
    $("#folderLib").html(theHtml);

}



/*============================================================================
        FILTERS
==============================================================================*/


function filterStoryLib() {
    var filter = $("#txtSearchStory").val().toUpperCase();
    $(".storyFolder-menu").each(function() {
        if ($(this).text().toUpperCase().indexOf(filter) > -1) {
            $(this).parent().show();
        } else {
            $(this).parent().hide();
        }
    });

}