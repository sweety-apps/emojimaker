define(function(require, exports, module) {
    require('jquery');

    // browser类型
    CommonUtil.COMMON_BROWSER_TYPE_CHROME = "Chrome";
    CommonUtil.COMMON_BROWSER_TYPE_SAFARI = "Safari";
    CommonUtil.COMMON_BROWSER_TYPE_FIREFOX = "Firefox";
    CommonUtil.COMMON_BROWSER_TYPE_OPERA = "Opera";
    CommonUtil.COMMON_BROWSER_TYPE_IE = "IE";
    CommonUtil.COMMON_BROWSER_TYPE_NONE = "none";

    // 哪个APP打开的
    CommonUtil.COMMON_WRAPPER_APP_TYPE_WECHAT = "wechat";
    CommonUtil.COMMON_WRAPPER_APP_TYPE_QQ = "QQ";
    CommonUtil.COMMON_WRAPPER_APP_TYPE_WEIBO = "weibo";
    CommonUtil.COMMON_WRAPPER_APP_TYPE_NONE = "none";

    // 设备类型
    CommonUtil.COMMON_DEVICE_TYPE_IPAD = "iPad";
    CommonUtil.COMMON_DEVICE_TYPE_IPHONE = "iPhone";
    CommonUtil.COMMON_DEVICE_TYPE_ANDROID = "Android";
    CommonUtil.COMMON_DEVICE_TYPE_WINDOWS_MOBILE = "Windows Mobile";
    CommonUtil.COMMON_DEVICE_TYPE_MACOSX = "Mac";
    CommonUtil.COMMON_DEVICE_TYPE_LINUX = "Linux";
    CommonUtil.COMMON_DEVICE_TYPE_WINDOWS = "Windows";
    CommonUtil.COMMON_DEVICE_TYPE_NONE = "none";

    //变量
    var gBrowser = null;    //浏览器类型和版本
    var gWrapperAppType = null; //哪个APP打开的
    var gDeviceType = null; //设备类型
    var gItemsAttrAndVHValueDict = null; //动态调整属性到vh单位，防iOS微信浏览器bug

    function CommonUtil()
    {
        this._init();
    };

    module.exports = CommonUtil;

    CommonUtil.prototype._init = function() {};

    CommonUtil._initBrowserTypeAndVersion = function() {
        if(gBrowser == null || gBrowser == undefined){

            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            if (window.ActiveXObject)
            {
                Sys.version = ua.match(/msie ([\d.]+)/)[1];
                Sys.type = CommonUtil.COMMON_BROWSER_TYPE_IE;
            }
            else if (document.getBoxObjectFor)
            {
                Sys.version = ua.match(/firefox\/([\d.]+)/)[1];
                Sys.type = CommonUtil.COMMON_BROWSER_TYPE_FIREFOX;
            }
            else if (window.MessageEvent && !document.getBoxObjectFor)
            {
                Sys.version = ua.match(/chrome\/([\d.]+)/)[1];
                Sys.type = CommonUtil.COMMON_BROWSER_TYPE_CHROME;
            }
            else if (window.opera)
            {
                Sys.version = ua.match(/opera.([\d.]+)/)[1];
                Sys.type = CommonUtil.COMMON_BROWSER_TYPE_OPERA;
            }
            else if (window.openDatabase)
            {
                Sys.version = ua.match(/version\/([\d.]+)/)[1];
                Sys.type = CommonUtil.COMMON_BROWSER_TYPE_SAFARI;
            }
            else
            {
                Sys.version = '';
                Sys.type = CommonUtil.COMMON_BROWSER_TYPE_NONE;
            }

            gBrowser = Sys;
        }
        return gBrowser;
    };

    CommonUtil.getBrowserType = function() {
        CommonUtil._initBrowserTypeAndVersion();
        return gBrowser.type;
    };

    CommonUtil.getBrowserVersion = function() {
        CommonUtil._initBrowserTypeAndVersion();
        return gBrowser.version;
    };

    CommonUtil.getWrapperAppType = function() {

        if(gWrapperAppType == null || gWrapperAppType == undefined){
            var type = null;
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=='micromessenger')
            {
                type = CommonUtil.COMMON_WRAPPER_APP_TYPE_WECHAT;
            }
            else
            {
                type = CommonUtil.COMMON_WRAPPER_APP_TYPE_NONE;
            }

            gWrapperAppType = type;
        }
        return gWrapperAppType;
    };

    CommonUtil.getDeviceType = function() {
        if(gDeviceType == null || gDeviceType == undefined){
            var type = null;
            var ua = navigator.userAgent.toLowerCase();

            if(ua.match(/ipad/i) == "ipad") {
                type = CommonUtil.COMMON_DEVICE_TYPE_IPAD;
            }
            else if(ua.match(/iphone os/i) == "iphone os") {
                type = CommonUtil.COMMON_DEVICE_TYPE_IPHONE;
            }
            else if(ua.match(/android/i) == "android") {
                type = CommonUtil.COMMON_DEVICE_TYPE_ANDROID;
            }
            else if(ua.match(/windows mobile/i) == "windows mobile") {
                type = CommonUtil.COMMON_DEVICE_TYPE_WINDOWS_MOBILE;
            }
            else if(ua.indexOf("Window")>0) {
                type = CommonUtil.COMMON_DEVICE_TYPE_WINDOWS;
            }
            else if(ua.indexOf("Mac OS X")>0) {
                type = CommonUtil.COMMON_DEVICE_TYPE_MACOSX;
            }
            else if(ua.indexOf("Linux")>0) {
                type = CommonUtil.COMMON_DEVICE_TYPE_LINUX;
            }
            else {
                type = CommonUtil.COMMON_DEVICE_TYPE_NONE;
            }

            gDeviceType = type;
        }
        return gDeviceType;

    };

    CommonUtil.isBrowserSupportHtml5 = function() {
        if (window.applicationCache) {
            return true;
        } else {
            return false;
        }
    };

    // 通用vh转换函数，注：微信iOS浏览器的bug,input获得焦点时，vh会变化
    CommonUtil.setAttributeValueToVHUnit = function(item_id,percentOfHeight, attr) {
        if (gItemsAttrAndVHValueDict == null)
        {
            gItemsAttrAndVHValueDict = {};
            //监听窗口自动设置对象最大宽度

            $(window).resize(function(){
                // 监听窗口变化，调整最大宽度
                CommonUtil._updateAttributeValueToVHUnit();
            });
        }
        var array = gItemsAttrAndVHValueDict[item_id];
        if(array == null || array == undefined)
        {
            array = [];
        }
        array[array.length] = {"attr":attr,"value":percentOfHeight};
        gItemsAttrAndVHValueDict[item_id] = array;
    };

    // 手动对齐下
    CommonUtil.updateAttributeValueToVHUnit = function() {
        CommonUtil._updateAttributeValueToVHUnit();
    };

    CommonUtil._updateAttributeValueToVHUnit = function() {
        var ww = $(window).width();
        var wh = $(window).height();

        for(var item_id in gItemsAttrAndVHValueDict)
        {
            var item = $(item_id);
            var array = gItemsAttrAndVHValueDict[item_id];
            var cssval = null;
            for(var i = 0; i < array.length; ++i)
            {
                var dict = array[i];
                var percent = dict["value"];
                var attr_name = dict["attr"];
                var size = wh * percent / 100.0;
                if(cssval == null)
                {
                    cssval = {};
                }
                cssval[attr_name] = ""+size+"px";
            }
            if(item != null && item != undefined && cssval != null)
            {
                item.css(cssval);
            }
        }
    };

    // 最大宽度
    CommonUtil.setMaxWidthForItem = function(item_id,percentOfHeight) {
        CommonUtil.setAttributeValueToVHUnit(item_id,percentOfHeight,"max-width");
    };

    // 字体大小
    CommonUtil.setFontForItem = function(item_id,percentOfHeight) {
        CommonUtil.setAttributeValueToVHUnit(item_id,percentOfHeight,"font-size");
    };
});
