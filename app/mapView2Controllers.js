define(['app', 'avelayout',  'pubsub', 'layoutCache', 'models', 'kendo', 'jquery','leaflet','esri-leaflet', 'directives'],
    function ( appModule, avelayout, pubsub,layoutCache, models,  kendo, $,L) {


        pubsub.subscribe('cesiumContainerLoaded', function () {
         var div=   $('#map');
            alert(div.attr("id"));
             var map = L.map('map').setView([ 30.70, -81.47], 8);
            L.esri.tiledMapLayer({
                url: "http://10.0.0.15:6080/arcgis/rest/services/GoogleSatellite10/MapServer"
            }).addTo(map);
        });

        var initMapView2 = function () {
            var div=   $('#map');
            alert(div.attr("id"));
            var map = L.map('map').setView([ 30.70, -81.47], 8);
            alert(map);
            alert(esriL);
            L.esri=esriL;
            L.esri.imageMapLayer({
                url: "http://10.0.0.15:6080/arcgis/rest/services/GoogleSatellite10/MapServer/0"
            }).addTo(map);

        };


        appModule.initMapView2 = initMapView2;
        appModule.controller('mapView2Controllers', ['$scope', '$compile', function ($scope, $compile) {



        }]);


    return appModule;
});
