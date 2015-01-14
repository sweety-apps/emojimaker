define(function(require, exports, module) {
    require('jquery');
    var CommonButton = require('./common_button');
    var CommonAnimations = require('./common_animations');

    // instruction
    function ViewMain() {

        this._init();
    }

    module.exports = ViewMain;

    //页面
    ViewMain.prototype.view_main = null;
    ViewMain.prototype.view_main_save_tips = null;
    ViewMain.prototype.view_main_share_tips = null;
    ViewMain.prototype.view_main_start_btn = null;
    ViewMain.prototype.view_main_exp_label = null;
    ViewMain.prototype.view_image_main = null;


    ViewMain.prototype._init = function() {
        this.view_main = $("#view_main")
        this.view_main_save_tips = $("#view_main_save_tips");
        this.view_main_share_tips = $("#view_main_share_tips");
        this.view_main_start_btn = new CommonButton("#view_main_start_btn","#view_main_start_btn_img","img/btn_start.png","img/btn_start_a.png");
        this.view_main_exp_label = $("#view_main_exp_label");
        this.view_image_main = $("#view_image_main");


        this.view_main_start_btn.setClickCallback(function(btn,view_main){
            view_main.showSaveTips(true);
            if(btnshowing)
            {
                view_main.hideStartButton(true);
                view_main.hideShareTips(true);
                btnshowing = false;
            }
            else
            {
                view_main.showStartButton(true);
                view_main.showShareTips(true);
                btnshowing = true;
            }
        },this);


        return this;
    };

    ViewMain.prototype.show = function(isAnimated) {
        this.view_main.css("visibility", "visible");
        if(isAnimated)
        {
            this.view_main.animate({opacity:1.0},500);
        }
        else
        {
            this.view_main.css("opacity", "1.0");
        }
    };

    ViewMain.prototype.showSaveTips = function(isAnimated) {
        //var offsetY = this.view_image_main.attr("height");
        this.view_main_save_tips.css("visibility", "visible");
        //this.view_main_save_tips.css("top":"")
        if(isAnimated)
        {
            this.view_main_save_tips.css("opacity", "1.0");
            CommonAnimations.scalePopup("#"+this.view_main_save_tips.attr('id'));
        }
        else
        {
            this.view_main_save_tips.css("opacity", "1.0");
        }
    };

    ViewMain.prototype.showShareTips = function(isAnimated) {
        //var offsetY = this.view_image_main.attr("height");
        this.view_main_share_tips.css("visibility", "visible");
        //this.view_main_save_tips.css("top":"")
        if(isAnimated)
        {
            CommonAnimations.popFromBottom("#"+this.view_main_share_tips.attr('id'));
            //this.view_main_share_tips.animate({opacity:1.0},500);
        }
        else
        {
            this.view_main_share_tips.css("opacity", "1.0");
        }
    };

    ViewMain.prototype.hideShareTips = function(isAnimated) {
        //var offsetY = this.view_image_main.attr("height");
        this.view_main_share_tips.css("visibility", "visible");
        //this.view_main_save_tips.css("top":"")
        if(isAnimated)
        {
            CommonAnimations.extendDismiss("#"+this.view_main_share_tips.attr('id'));
            //this.view_main_share_tips.animate({opacity:1.0},500);
        }
        else
        {
            this.view_main_share_tips.css("opacity", "0.0");
            this.view_main_share_tips.css("visibility", "hidden");
        }
    };

    ViewMain.prototype.showStartButton = function(isAnimated) {
        this.view_main_start_btn.show(isAnimated);
    };

    ViewMain.prototype.hideStartButton = function(isAnimated) {
        this.view_main_start_btn.hide(isAnimated);
    };

    var btnshowing = false;


    ViewMain.prototype.hide = function(isAnimated) {
        this.view_main.css("visibility", "visible");
        if(isAnimated)
        {
            this.view_main.animate({opacity:0.0,visibility:"hidden"},500);
        }
        else
        {
            this.view_main.css("opacity", "0.0");
            this.view_main.css("visibility", "hidden");
        }
    };
});