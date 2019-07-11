/**
 * Created by peng on 2015/9/9.
 */

define([], function(){
    function Cache(){
        this.application = null;
        this.navigateContext = null;
        this.dataDetailContext = null;
    }

    var cache = new Cache();
    return cache;
});