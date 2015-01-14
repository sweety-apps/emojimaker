//define("src/main", [ 'jquery' ], function(require, exports, module) {
define(function(require, exports, module) {
    require('jquery');
    require('html5Loader');
    var CommonAnimations = require('./common_animations');
    var ViewMain = require('./view_main');

    // instruction
    function AppInstance() {
        this._init();
    }
    module.exports = AppInstance;

    //页面
    AppInstance.prototype.view_bg = null;
    AppInstance.prototype.view_main = null;
    AppInstance.prototype.view_edit = null;
    AppInstance.prototype.view_select_pic = null;
    AppInstance.prototype.view_select_tmp = null;

    AppInstance.prototype._init = function() {
        this.view_bg = $("#view_bg");
        this.view_main = new ViewMain();
        this.view_edit = $("#view_edit");
        this.view_select_pic = $("#view_select_pic");
        this.view_select_tmp = $("#view_select_tmp");
        return this;
    };

    AppInstance.prototype.hideAllPage = function(isAnimated) {
        this.view_main.hide(isAnimated);
        this.view_edit.css("visibility", "hidden");
        this.view_select_pic.css("visibility", "hidden");
        this.view_select_tmp.css("visibility", "hidden");
    };

    AppInstance.prototype.preloadResourcesAndStartApp = function() {
        //$("#view_preloading").css("opacity", "0.0");
        //$("#view_preloading").animate({opacity:1.0},500);
        CommonAnimations.popFromBottom("#view_preloading");
        var appinstance = this;
        $.html5Loader({
            appInstance:this,
            filesToLoad:'config/files.json',
            onUpdate: function(perc){
                $("#view_preloading").text("加载中...("+perc+"%)");
            },
            stopExecution:true,
            onComplete: function () {
                console.log("All the assets are loaded!");
                appinstance.startApp();
            },
            onElementLoaded: function ( obj, elm ){
            }
        });
    };

    AppInstance.prototype.startApp = function() {
        $("#view_preloading").css("visibility", "hidden");
        this.view_main.show(true);
        this.view_main.showSaveTips(true);
        //this.view_main.showShareTips(true);
        this.view_main.showStartButton(true);
    };

    //程序入口
    var gAppSharedInstance = null;
    $(document).ready(function(){
        gAppSharedInstance = new AppInstance();
        gAppSharedInstance.hideAllPage(false);
        gAppSharedInstance.preloadResourcesAndStartApp();
        //gAppSharedInstance.startApp();
    });
});

/*
define("js/src/main-debug", [ "./spinning-debug", "jquery-debug" ], function(require) {
    var Spinning = require("./spinning-debug");
    var s = new Spinning("#container");
    s.render();
});
*/

