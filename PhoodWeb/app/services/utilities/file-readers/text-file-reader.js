"use strict";

exports.readFile = function(file) {
    return new Promise(function(resolve, reject) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve({success: true, textData: event.target.result});
            };
            reader.readAsText(file);
        } else {
            resolve({success: false, error: "No File"});
        }
    })
};