var access_token = "";
var id_token = "";
var selectedFolderUUID = null;
var isStoryLibMode = true;

//Model
var storyModel = null;
var fModel = fModelFactory.newModel();


function getParameterByName(name) {
    var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
    return getParameterByName('access_token');
}

function getIdToken() {
    return getParameterByName('id_token');
}




$(document).ready(function() {



    access_token = getAccessToken();
    id_token = getIdToken();

    if (access_token == null || access_token == undefined) {
        access_token = localStorage.getItem("access_token")
        id_token = localStorage.getItem("id_token")
    } else {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("id_token", id_token);

    }


    console.log("Authorize Access Token:" + access_token);
    console.log("Authorize Id Token:" + id_token);


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

    $("#btnCreateStoryLib").click(function(e) {
        e.preventDefault();
        callCreateStoryLib();
    });


    checkStoryLibExist();

});



function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile_name');
    localStorage.removeItem('profile_email');
    window.location.href = "/";
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
                window.location = "yumod.html";
            } else {
                console.log(data.msg);
            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);

        }
    });
}


function checkStoryLibExist() {


    var url = "https://api.yumod.com/api/mediumconnects";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data.result) {
                window.location = "yumod.html";
            } else {
                $(".se-pre-con").fadeOut("slow");
            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
            $(".se-pre-con").fadeOut("slow");
        }
    });
}



function checkUserSettingsExist() {

    var url = "https://api.yumod.com/api/usersettings";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data.result) {
                checkStoryLibExist();
            } else {
                $(".se-pre-con").fadeOut("slow");
            }
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
            $(".se-pre-con").fadeOut("slow");
        }
    });

}