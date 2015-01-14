define(function(require, exports, module) {
    require('jquery');
    var CommonAnimations = require('./common_animations');

    var COMMONBUTTON_STATE_NORMAL = 0;
    var COMMONBUTTON_STATE_MOUSEOVER = 1;
    var COMMONBUTTON_STATE_PRESSED = 2;


    // instruction
    function CommonButton(item_id,item_img_id,image_normal,image_pressed) {

        this._init(item_id,item_img_id,image_normal,image_pressed);
    }

    module.exports = CommonButton;

    //页面
    CommonButton.prototype.view = null;
    CommonButton.prototype.view_img = null;
    CommonButton.prototype.image_normal = null;
    CommonButton.prototype.image_pressed = null;
    CommonButton.prototype.commonbutton_state = null;
    CommonButton.prototype.onPressedFunc = null;
    CommonButton.prototype.onPressedCtx = null;
    CommonButton.prototype.isShowing = false;
    CommonButton.prototype.isTouching = false;

    CommonButton.btndict = null;

    CommonButton.prototype._init = function(item_id,item_img_id,image_normal,image_pressed) {
        this.view = $(item_id);
        this.view_img = $(item_img_id);
        if(CommonButton.btndict == null)
        {
            CommonButton.btndict = {};
        }
        CommonButton.btndict[item_id]=this;
        this.image_normal = image_normal;

        //设置响应对象的区域
        this.image_pressed = image_pressed;
        var x = this.view_img.offset().left;
        var y = this.view_img.offset().top;
        var w = this.view_img.width();
        var h = this.view_img.height();

        this.view.css("left",""+x+"px");
        this.view.css("top",""+y+"px");
        this.view.css("width",""+w+"px");
        this.view.css("height",""+h+"px");

        //设置状态
        this.setState(COMMONBUTTON_STATE_NORMAL);

        if (!navigator.userAgent.match(/mobile/i))
        {
            this.view.mousedown(CommonButton.onMouseDown);
            this.view.mouseup(CommonButton.onMouseClicked);
            this.view.mouseout(CommonButton.onMouseLeave);
        }
        else
        {
            this.view.bind('touchstart',CommonButton.onMouseDown);
            this.view.bind('touchend',CommonButton.onTouchEnd);
        }

        return this;
    };

    //////////////////////////////////////////////
    CommonButton.getButtonWithItemId = function(item_id)
    {
        if(CommonButton.btndict == null)
        {
            CommonButton.btndict = {};
        }
        return CommonButton.btndict[item_id];
    };

    CommonButton.onMouseOver = function(event){
        CommonButton.getButtonWithItemId("#"+this.id).setState(COMMONBUTTON_STATE_MOUSEOVER);
    };

    CommonButton.onClicked = function(view){
        var btn = CommonButton.getButtonWithItemId("#"+view.id);
        if(btn.commonbutton_state != COMMONBUTTON_STATE_NORMAL)
        {
            btn.setState(COMMONBUTTON_STATE_NORMAL);
        }
        if(btn.onPressedFunc != null && btn.onPressedFunc != undefined)
        {
            btn.onPressedFunc(btn,btn.onPressedCtx);
        }
        btn.isTouching = false;
    };

    CommonButton.onLeave = function(view){
        var btn = CommonButton.getButtonWithItemId("#"+view.id);
        if(btn.commonbutton_state != COMMONBUTTON_STATE_NORMAL)
        {
            btn.setState(COMMONBUTTON_STATE_NORMAL);
        }
        btn.isTouching = false;
    };

    CommonButton.onTouchEnd = function(event) {
        var touch = event.originalEvent.changedTouches[0];
        console.log("x:"+touch.pageX+" y:"+touch.pageY);
        var btn = CommonButton.getButtonWithItemId("#"+this.id);
        var x = btn.view.offset().left;
        var y = btn.view.offset().top;
        var w = btn.view.width();
        var h = btn.view.height();
        if(touch.pageX > x && touch.pageX < x + w
            && touch.pageY > y && touch.pageY < y + h
            )
        {
            CommonButton.onClicked(this);
        }
        else
        {
            CommonButton.onLeave(this);
        }
    };

    CommonButton.onMouseClicked = function(event) {
        CommonButton.onClicked(this);
    };

    CommonButton.onMouseLeave = function(event){
        CommonButton.onLeave(this);
    };

    CommonButton.onMouseDown = function(event){
        var btn = CommonButton.getButtonWithItemId("#"+this.id);
        btn.setState(COMMONBUTTON_STATE_PRESSED);
        btn.isTouching = true;
    };

    //////////////////////////////////////////////

    CommonButton.prototype.show = function(isAnimated) {
        if(this.isShowing)
        {
            return;
        }
        this.isShowing = true;
        this.view.css("visibility", "visible");
        this.view_img.css("visibility", "visible");

        if(isAnimated)
        {
            this.view_img.css("opacity", "1.0");
            CommonAnimations.scalePopup("#"+this.view_img.attr('id'));
        }
        else
        {
            this.view.css("opacity", "1.0");
            this.view_img.css("opacity", "1.0");
        }
    };

    CommonButton.prototype.hide = function(isAnimated) {
        if(!this.isShowing)
        {
            return;
        }
        this.isShowing = false;

        this.view.css("visibility", "visible");
        if(isAnimated)
        {
            CommonAnimations.scaleDismiss("#"+this.view_img.attr('id'));
            this.view.animate({opacity:0.0,visibility:"hidden"},500);
        }
        else
        {
            this.view.css("opacity", "0.0");
            this.view.css("visibility", "hidden");
        }
    };

    CommonButton.prototype.setState = function(state) {
        if(!arguments[1])
        {
            isAnimated = false;
        }

        if(state != this.commonbutton_state)
        {
            switch(state)
            {
                case COMMONBUTTON_STATE_NORMAL:
                {
                    //this.view.attr()
                    this.view_img.attr("src",this.image_normal);
                    //this.view.css("background-image:","url("+this.image_normal+")");
                }
                    break;
                case COMMONBUTTON_STATE_MOUSEOVER:
                {
                    //this.view.attr()
                    this.view_img.attr("src",this.image_normal);
                    //this.view.css("background-image:","url("+this.image_normal+")");
                }
                    break;
                case COMMONBUTTON_STATE_PRESSED:
                {
                    //this.view.attr()
                    this.view_img.attr("src",this.image_pressed);
                    //this.view.css("background-image:","url("+this.image_pressed+")");
                }
                    break;
                default :
                    break;
            }
            this.commonbutton_state = state;

        }
    };

    CommonButton.prototype.setClickCallback = function (func,ctx)
    {
        this.onPressedFunc = func;
        this.onPressedCtx = ctx;
    }
});