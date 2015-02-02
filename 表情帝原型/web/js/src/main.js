//define("src/main", [ 'jquery' ], function(require, exports, module) {
define(function(require, exports, module) {
    require('jquery');
    require('html5Loader');
    var CommonAnimations = require('./common_animations');
    var CommonUtil = require('./common_util');
    var ViewMain = require('./view_main');
    var ViewEdit = require('./view_edit');

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
        // 成员变量
        this.view_bg = $("#view_bg");
        this.view_main = new ViewMain();
        this.view_edit = new ViewEdit();
        this.view_select_pic = $("#view_select_pic");
        this.view_select_tmp = $("#view_select_tmp");

        // debug，需要删除
        if(true)
        {
            var main = this;
            setInterval(function(){
                main._debugWindowSize();
            },300);
            this._debugWindowSize();
        }

        return this;
    };

    AppInstance.prototype._debugWindowSize = function() {
        var ww = $("body").width();
        var wh = $("body").height();
        $("#view_debug_label").text("w:"+ww+",h:"+wh+"");
    };

    AppInstance.prototype.hideAllPage = function(isAnimated) {
        this.view_main.hide(isAnimated);
        this.view_edit.hide(isAnimated);
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

        // 点击处理
        this.view_main.setPressedStartButtonCallback(function(appInstance){
            // 开始编辑
            appInstance.view_main.hide(true);
            setTimeout(function(){
                appInstance.view_edit.show(true);
            },500);

        },this);
        this.view_main.setPressedMoreButtonCallback(function(appInstance){
            // 更多跳公众号
        },this);
        this.view_main.setPressedSaveTipsButtonCallback(function(appInstance){
            // 弹出微信保存说明
        },this);

        //this.view_main.showForEntryStyle(true);
        this.view_edit.show(true);
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

