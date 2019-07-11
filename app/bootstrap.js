define(['require',
    'angular',
    'angular-route',
    'jquery',
    'layoutborder',
    'app',
    'avelayout',
    'controllers',
], function (require, angular) {
    'use strict';
    require(['domReady!'], function (document) {
        angular.bootstrap(document, ['XXSPA']);
    });
});
