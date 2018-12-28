"use strict";
require('./phood-loader.css');

module.exports = function(app) {
    app.component('phoodLoader', {
        templateUrl: 'app/components/phood-loader/phood-loader.html',
        controller: function($scope) {
        }
    });
};