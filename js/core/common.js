var derivedProp4FixedDisp = function(arr, readProp, writeProp, maxLength) {
    for (var i = 0; i < arr.length; i++) {
        var element = arr[i];
        var readData = element[readProp];
        var writeData = readData.toFixedDisp(maxLength);
        element[writeProp] = writeData;
    }
}


String.prototype.toFixedDisp = function(maxLength) {
    if (this.length > maxLength) {
        return this.substring(0, maxLength) + "...";
    } else {
        return this.toString();
    }
}

var derivedProp4Index = function(arr, writeProp) {
    for (var i = 0; i < arr.length; i++) {
        var element = arr[i];
        element[writeProp] = arr.length - i;
    }
}


function getFormattedDate() {

    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    var formattedDate = dt + "." + month + "." + year;
    return formattedDate;
}


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}