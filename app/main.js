require.config({
    paths: {
        //一些库文件
        'jquery': '../js/jquery-2.1.4',
        'customScrollbar': '../js/jquery.mCustomScrollbar.concat.min',
        'pubsub': '../js/pubsub',
        'angular': '../js/angular',
        'angular-route': '../js/angular-ui-router.min',
        'domReady': '../js/domReady',
        'kendo': '../js/kendo.all.min',
        'layoutborder': '../js/layout.border',
       // 'qunee': '../js/qunee-min',
        'canvg': '../js/canvg2/canvg2',
        'rgbcolor': '../js/canvg2/rgbcolor',
        'stackblur': '../js/canvg2/StackBlur',
        'echarts': '../js/echart',
        'avelayout': '../js/avelayout/aveLayout',
        'windowProvider': 'windowProvider',
        'layoutCache': 'layoutCache',
        'bootstrap': 'bootstrap',
        'app': 'app',
        'appCaches': 'appCaches',
        'models': 'models',
        'directives': 'directives',
        'controllers': 'controllers',
        // data
        'FlatsunToTruesun': '../data/FlatsunToTruesun',
        //pictureSlider
        'pictureSlider': 'pictureSlider',
        'GeometryData':'../data/GeometryData'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular'],
            exports: 'angular-route'
        },
        'kendo': ['jquery', 'angular'],
        'jqueryui': ['jquery'],
        'layoutborder': ['jquery'],
        'avelayout': {
            deps: ['jquery'],
            exports: 'avelayout'
        }
    },
    deps: ['bootstrap'],
    //urlArgs: 'bust=' + (new Date()).getTime()  //防止读取缓存，调试用
});
