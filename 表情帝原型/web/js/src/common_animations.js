define(function(require, exports, module) {
    require('jquery');

    // instruction
    function CommonAnimations() {
        this._init();
    }
    module.exports = CommonAnimations;

    CommonAnimations.prototype._init = function() {
    };

    // 变换
    CommonAnimations.transfromItem = function(item_id,transValue,isAnimate,speed,callback) {
        var item = $(item_id);
        if(!isAnimate)
        {
            return item.css(
                {
                    "transform":transValue,
                    "-ms-transform":transValue,
                    "-webkit-transform":transValue,
                    "-o-transform":transValue,
                    "-moz-transform":transValue
                }
            );
        }
        else
        {
            return item.css(
                {
                    "transform":transValue+" "+speed/1000.0+"s",
                    "-ms-transform":transValue+" "+speed/1000.0+"s",
                    "-webkit-transform":transValue+" "+speed/1000.0+"s",
                    "-o-transform":transValue+" "+speed/1000.0+"s",
                    "-moz-transform":transValue+" "+speed/1000.0+"s"
                }
                //,speed,null,callback
            );
        }

    };

    // 缩放
    CommonAnimations.scaleItem = function(item_id,scaleXY,isAnimate,speed,callback) {
        var scaleValue = "";
        scaleValue = "scale("+scaleXY+","+scaleXY+")";

        return CommonAnimations.transfromItem(item_id,scaleValue,isAnimate,speed,callback);
    };

    CommonAnimations.animatefyItem = function(item_id) {
        var item = $(item_id);
        if(item.transfromItem == undefined || item.transfromItem == null)
        {
            item.transfromItem = function(transValue,isAnimate,speed,callback){
                var itemid = "#"+this.attr("id")
                return CommonAnimations.transfromItem(itemid,transValue,isAnimate,speed,callback);
            };
            item.scaleItem = function(scaleXY,isAnimate,speed,callback){
                var itemid = "#"+this.attr("id")
                return CommonAnimations.scaleItem(itemid,scaleXY,isAnimate,speed,callback);
            };
        }
        return item;
    }


    // 动画
    CommonAnimations.doAnimate = function(item_id, animate_css_class)
    {
        var item = CommonAnimations.animatefyItem(item_id);
        item.attr("class","animationnone");
        item.css({"animation-play-state":"running"});
        item.css({"-webkit-animation-play-state":"running"});
        item.attr("class",animate_css_class);
        item.css({"animation-play-state":"running"});
        item.css({"-webkit-animation-play-state":"running"});
    };

    CommonAnimations.scalePopup = function(item_id)
    {
        CommonAnimations.doAnimate(item_id,"animationqbounce");
    };

    CommonAnimations.scaleDismiss = function(item_id)
    {
        CommonAnimations.doAnimate(item_id,"animationqbouncehide");
    };

    CommonAnimations.popFromBottom = function(item_id)
    {
        CommonAnimations.doAnimate(item_id,"animationbottomslidein");
    };

    CommonAnimations.extendDismiss = function(item_id)
    {
        CommonAnimations.doAnimate(item_id,"animationextendout");
    };
});