/**
 * Created by peng on 2015/8/28.
 */

define(['angular', 'kendo', 'jquery'], function (angular, kendo, $) {

    var provider = function(){
        var $window = null;
        this.create = function(title, content, width, height){
            var kWindow = $('<div></div>');
            $('body').append(kWindow);
            kWindow.kendoWindow({
                actions: ["Close"],
                pinned: false,
                resizable: false,
                width: width,
                height: height,
                title: title,
                content: content,
                modal: true,
                close: this.close
            });
            $window = kWindow.parent();
            kWindow.data("kendoWindow").center();
        };
        this.close = function(){
            if(null != $window){
                $window.remove();
            }
        };
    };

    return provider;
});
