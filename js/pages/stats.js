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
            console.log(data);
        },
        error: function(textStatus, errorThrown) {
            console.log("error GetFolderModel");
            handleErrors(textStatus, errorThrown, "callGetFolderModel")
        }
    });

}