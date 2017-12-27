var access_token = "";
var id_token = "";



$(document).ready(function() {
    access_token = localStorage.getItem("access_token")
    id_token = localStorage.getItem("id_token")
    console.log("Authorize Access Token:" + access_token);
    console.log("Authorize Id Token:" + id_token);


    $.ajaxSetup({
        "async": true,
        "crossDomain": true,
        "headers": {
            "authorization": "Bearer " + access_token
        }
    });


    $("#btnAddRole").click(function(e) {
        e.preventDefault();
        updateUserRole("PATCH");
    });


    $("#btnDelRole").click(function(e) {
        e.preventDefault();
        updateUserRole("DELETE");
    });

    $(".se-pre-con").fadeOut("slow");

});



function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile_name');
    localStorage.removeItem('profile_email');
    window.location.href = "/";
}



function updateUserRole(method) {

    var url = "https://api.yumod.com/api/user/role";
    $.ajax({
        type: method,
        url: url,
        success: function(data) {
            console.log(data);
        },
        error: function(textStatus, errorThrown) {
            console.log(textStatus);
        }
    });


}