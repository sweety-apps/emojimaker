define(function(require, exports, module) {
    require('jquery');
    var CommonButton = require('./common_button');
    var CommonAnimations = require('./common_animations');
    var CommonUtil = require('./common_util');
    var CommonEditbox = require('./common_editbox');

    // instruction
    function ViewEdit() {

        this._init();
    }

    module.exports = ViewEdit;

    //页面
    ViewEdit.prototype.view_edit = null;
    ViewEdit.prototype.view_edit_finish_btn = null;
    ViewEdit.prototype.view_edit_template_btn = null;
    ViewEdit.prototype.view_edit_picture_btn_effect_img = null;
    ViewEdit.prototype.view_edit_picture_btn = null;
    ViewEdit.prototype.view_edit_picture = null;
    ViewEdit.prototype.view_edit_cancel_btn = null;
    ViewEdit.prototype.view_edit_text = null;
    ViewEdit.prototype.view_edit_text2 = null;
    ViewEdit.prototype.view_edit_cover = null;

    //数据
    ViewEdit.prototype.image_url = null;
    ViewEdit.prototype.text = null;
    ViewEdit.prototype.text2 = null;

    //回调
    ViewEdit.prototype._view_edit_cancel_func = null;
    ViewEdit.prototype._view_edit_cancel_func_ctx = null;
    ViewEdit.prototype._view_edit_finished_func = null;
    ViewEdit.prototype._view_edit_finished_func_ctx = null;
    ViewEdit.prototype._view_edit_templete_func = null;
    ViewEdit.prototype._view_edit_templete_func_ctx = null;
    ViewEdit.prototype._view_edit_picture_func = null;
    ViewEdit.prototype._view_edit_picture_func_ctx = null;


    ViewEdit.prototype._init = function() {
        // 先预对齐下元素
        this._adjustItemsMaxWidth();
        this._adjustItemsFontSize();

        // 成员变量
        // 初始化UI
        this.view_edit = $("#view_edit");
        this.view_edit_finish_btn = new CommonButton("#view_edit_finish_btn","#view_edit_finish_btn_img","img/btn_done.png","img/btn_done_a.png");
        this.view_edit_template_btn = new CommonButton("#view_edit_template_btn","#view_edit_template_btn_img","img/btn_templete.png","img/btn_templete_a.png");
        this.view_edit_picture_btn = new CommonButton("#view_edit_picture_btn","#view_edit_picture_btn_img","img/edit_pic_btn.png","img/edit_pic_btn_a.png");
        this.view_edit_cancel_btn = new CommonButton("#view_edit_cancel_btn","#view_edit_cancel_btn_img","img/edit_cancel_btn.png","img/edit_cancel_btn.png");
        this.view_edit_picture_btn_effect_img = $("#view_edit_picture_btn_effect_img");
        this.view_edit_picture = $("#view_edit_picture");
        this.view_edit_text = new CommonEditbox("#view_edit_text_bg_img", "#view_edit_text_edit_btn_img", "#view_edit_text_edit_btn", "img/edit_textbox_icon_pencil.png", "img/edit_textbox_icon_pencil.png", "#view_edit_text_clear_btn_img", "#view_edit_text_clear_btn", "img/edit_textbox_icon_clear.png", "img/edit_textbox_icon_clear.png", "#view_edit_text");
        this.view_edit_text2 = new CommonEditbox("#view_edit_text2_bg_img", "#view_edit_text2_edit_btn_img", "#view_edit_text2_edit_btn", "img/edit_textbox_icon_pencil.png", "img/edit_textbox_icon_pencil.png", "#view_edit_text2_clear_btn_img", "#view_edit_text2_clear_btn", "img/edit_textbox_icon_clear.png", "img/edit_textbox_icon_clear.png", "#view_edit_text2");
        this.view_edit_cover = $("#view_edit_cover");

        var view_edit = this;
        $(window).resize(function(){
            // 监听窗口变化，对齐蒙层
            view_edit._updateViewPosition();
        });
        this._updateViewPosition();

        // 事件处理
        this.view_edit_picture_btn.setTouchedCallback(function(btn,view_edit){
            view_edit._updateViewPosition();
            CommonAnimations.doAnimate("#"+view_edit.view_edit_picture_btn_effect_img.attr('id'), "animationnone");
            view_edit.view_edit_picture_btn_effect_img.css({visibility:"hidden",opacity:0.0});

        },this);

        this.view_edit_picture_btn.setReleasedCallback(function(btn,view_edit){
            view_edit._updateViewPosition();
            view_edit.view_edit_picture_btn_effect_img.css({visibility:"visible",opacity:1.0});
            CommonAnimations.doAnimate("#"+view_edit.view_edit_picture_btn_effect_img.attr('id'), "animationfadeoutslow");
        },this);

        this.view_edit_picture_btn.setClickCallback(function(btn,view_edit){
            if(view_edit._view_edit_picture_func != null
                && view_edit._view_edit_picture_func != undefined)
            {
                view_edit._view_edit_picture_func(view_edit, view_edit._view_edit_picture_func_ctx);
            }
        },this);

        this.view_edit_cancel_btn.setClickCallback(function(btn,view_edit){
            if(view_edit._view_edit_cancel_func != null
                && view_edit._view_edit_cancel_func != undefined)
            {
                view_edit._view_edit_cancel_func(view_edit, view_edit._view_edit_cancel_func_ctx);
            }
        },this);

        this.view_edit_finish_btn.setClickCallback(function(btn,view_edit){
            if(view_edit._view_edit_finished_func != null
                && view_edit._view_edit_finished_func != undefined)
            {
                view_edit._view_edit_finished_func(view_edit, view_edit._view_edit_finished_func_ctx);
            }
        },this);

        this.view_edit_template_btn.setClickCallback(function(btn,view_edit){
            if(view_edit._view_edit_templete_func != null
                && view_edit._view_edit_templete_func != undefined)
            {
                view_edit._view_edit_templete_func(view_edit, view_edit._view_edit_templete_func_ctx);
            }
        },this);

        this.view_edit_text.setInputChangeCallback(function(text_edit,view_edit){
            view_edit.updateTextsAndShowCancelButton();
        },this);

        this.view_edit_text2.setInputChangeCallback(function(text_edit,view_edit){
            view_edit.updateTextsAndShowCancelButton();
        },this);

        // 点击测试
        this.view_edit_finish_btn.setClickCallback(function(btn,view_edit){

            view_edit.hide(true);

        },this);

        // 初始化数据
        this.image_url = this.view_edit_picture.attr("src");
        this.text = this.view_edit_text.getInputContent();
        this.text2 = this.view_edit_text2.getInputContent();

        return this;
    };

    //兼容微信的vh被修改的傻逼bug
    ViewEdit.prototype._adjustItemsMaxWidth = function() {
        CommonUtil.setMaxWidthForItem("#view_edit_finish_btn_img",35);
        CommonUtil.setMaxWidthForItem("#view_edit_template_btn_img",35);
        CommonUtil.setMaxWidthForItem("#view_edit_picture_btn_img",48);
        CommonUtil.setMaxWidthForItem("#view_edit_picture",48);
        CommonUtil.setMaxWidthForItem("#view_edit_cancel_btn_img",20);
        CommonUtil.setMaxWidthForItem("#view_edit_text_bg_img",60);
        CommonUtil.setMaxWidthForItem("#view_edit_text2_bg_img",60);
        CommonUtil.updateAttributeValueToVHUnit();
    };

    ViewEdit.prototype._adjustItemsFontSize = function() {
        CommonUtil.setFontForItem("#view_edit_text",2.7);
        CommonUtil.setFontForItem("#view_edit_text2",1.6);
        CommonUtil.updateAttributeValueToVHUnit();
    };

    ViewEdit.prototype._updateViewPosition = function() {

        var x = this.view_edit_picture_btn.view_img.offset().left;
        var y = this.view_edit_picture_btn.view_img.offset().top;
        var w = this.view_edit_picture_btn.view_img.width();
        var h = this.view_edit_picture_btn.view_img.height();

        var ww = $(window).width();
        var wh = $(window).height();

        var picX = x + (w * 0.054217);//Math.floor(x + (w * 0.054217));
        var picY = y + (h * 0.03012);//Math.floor(y + (h * 0.03012));
        var picW = w * 0.8494;//Math.floor(w * 0.8494);
        var picH = h * 0.86265;//Math.floor(h * 0.86265);

        if(this.view_edit_picture_btn.isTouching)
        {
            picX = x + (w * 0.06747);//Math.floor(x + (w * 0.06747));
            picY = y + (h * 0.04217);//Math.floor(y + (h * 0.04217));
            picW = w * 0.8494;//Math.floor(w * 0.8494);
            picH = h * 0.86265;//Math.floor(h * 0.86265);
        }


        this.view_edit_picture.css({"left":""+picX+"px","top":""+picY+"px","width":""+picW+"px","height":""+picH+"px"});
        this.view_edit_picture_btn_effect_img.css({"left":""+x+"px","top":""+y+"px","width":""+w+"px","height":""+h+"px"});
    };

    // 生成结果展示时的效果
    ViewEdit.prototype.show = function(isAnimated, isSelectTemplete) {
        this.view_edit.css({visibility:"visible",opacity:1.0});
        this.view_edit_cover.css({visibility:"visible",opacity:1.0});
        this.showTempleteButton(isAnimated);
        this.showFinishButton(isAnimated);
        this.showTextInput(isAnimated);
        this.showPictureButton(isAnimated);
    };

    // 隐藏
    ViewEdit.prototype.hide = function(isAnimated) {
        if(isAnimated)
        {
            var viewedit = this;
            setTimeout(function(){
                viewedit.view_edit.css({visibility:"hidden",opacity:0.0});
                viewedit.view_edit_cover.css({visibility:"hidden",opacity:0.0});
            },500);
        }
        else
        {
            this.view_edit.css({visibility:"hidden",opacity:0.0});
            this.view_edit_cover.css({visibility:"hidden",opacity:0.0});
        }

        this.hideTempleteButton(isAnimated);
        this.hideFinishButton(isAnimated);
        this.hideTextInput(isAnimated);
        this.hidePictureButton(isAnimated);
        this.hideCancelButton(isAnimated);
    };

    ViewEdit.prototype.showFinishButton = function(isAnimated) {
        this.view_edit_finish_btn.show(isAnimated);
    };

    ViewEdit.prototype.hideFinishButton = function(isAnimated) {
        this.view_edit_finish_btn.hide(isAnimated);
    };

    ViewEdit.prototype.showTempleteButton = function(isAnimated) {
        this.view_edit_template_btn.show(isAnimated);
    };

    ViewEdit.prototype.hideTempleteButton = function(isAnimated) {
        this.view_edit_template_btn.hide(isAnimated);
    };

    ViewEdit.prototype.showCancelButton = function(isAnimated) {
        this.view_edit_cancel_btn.show(isAnimated);
    };

    ViewEdit.prototype.hideCancelButton = function(isAnimated) {
        this.view_edit_cancel_btn.hide(isAnimated);
    };

    ViewEdit.prototype.showPictureButton = function(isAnimated) {
        this.view_edit_picture.css({visibility:"visible",opacity:1.0});
        this.view_edit_picture_btn.show(isAnimated,"animationfadein");
    };

    ViewEdit.prototype.hidePictureButton = function(isAnimated) {
        CommonAnimations.doAnimate("#"+this.view_edit_picture_btn_effect_img.attr('id'), "animationnone");
        this.view_edit_picture_btn_effect_img.css({visibility:"hidden",opacity:0.0});
        this.view_edit_picture_btn.hide(isAnimated,"animationfadeout");
        if(isAnimated)
        {
            this.view_edit_picture.animate({visibility:"hidden",opacity:0.0},250);
        }
        else
        {
            this.view_edit_picture.css({visibility:"hidden",opacity:0.0});
        }

    };

    ViewEdit.prototype.showTextInput = function(isAnimated) {
        this.view_edit_text.show(isAnimated);
        this.view_edit_text2.show(isAnimated);
    };

    ViewEdit.prototype.hideTextInput = function(isAnimated) {
        this.view_edit_text.hide(isAnimated);
        this.view_edit_text2.hide(isAnimated);
    };

    // 功能函数
    ViewEdit.prototype.updateTextsAndShowCancelButton = function() {
        var text = this.view_edit_text.getInputContent();
        var text2 = this.view_edit_text2.getInputContent();
        var showCancel = false;
        if(text != this.text)
        {
            showCancel = true;
        }
        if(text2 != this.text2)
        {
            showCancel = true;
        }
        if(showCancel)
        {
            this.showCancelButton(true);
        }
    };

    // 事件回调
    ViewEdit.prototype.setCancelCallback = function(func,ctx) {
        this._view_edit_cancel_func = func;
        this._view_edit_cancel_func_ctx = ctx;
    };

    ViewEdit.prototype.setFinishedCallback = function(func,ctx) {
        this._view_edit_finished_func = func;
        this._view_edit_finished_func_ctx = ctx;
    };

    ViewEdit.prototype.setTempleteCallback = function(func,ctx) {
        this._view_edit_templete_func = func;
        this._view_edit_templete_func_ctx = ctx;
    };

    ViewEdit.prototype.setPictureCallback = function(func,ctx) {
        this._view_edit_picture_func = func;
        this._view_edit_picture_func_ctx = ctx;
    };
});