var access_token = "";
var id_token = "";



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

    callGetStats();

}); //End of JQuery Init




function callGetStats() {

    console.log("Called GetFolderModel");
    var url = "https://api.yumod.com/api/stats";
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            console.log("success Stats");
            $("#userCount").text(data.data.length);
            defineStatusText(data.data);
            defineIndex(data.data);

            var theTemplate = $("#userlib_template").html();
            var theHtml = Mustache.to_html(theTemplate, data);
            $("#userLib").html(theHtml);


            console.log(data);
        },
        error: function(textStatus, errorThrown) {
            console.log("error GetFolderModel");
            handleErrors(textStatus, errorThrown, "callGetFolderModel")
        }
    });

}


function defineStatusText(data) {
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        switch (item.status) {
            case 1:
                item.statusText = "usersettings oluşturuldu";
                break;
            case 3:
                item.statusText = "usersettings + storymodel oluşturuldu";
                break;
            case 7:
                item.statusText = "usersettings + storymodel + foldermodel oluşturuldu";
                break;
            case 11:
                item.statusText = "usersettings + storymodel + storymodel_enrich oluşturuldu";
                break;
            case 15:
                item.statusText = "usersettings + storymodel + foldermodel + storymodel_enrich oluşturuldu";
                break;
            default:
                break;
        }
    }
}




function defineIndex(data) {
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        item.index = i;
    }
}