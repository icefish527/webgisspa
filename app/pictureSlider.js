/**
 * Created by SYS on 2016/5/13.
 * 闭包
 */
(function ($) {
    $.fn.slider = function (options) {
        var defaults = {
            width: 1000,             // 滚动容器宽；
            height: 300,             // 滚动容器高；
            autoPlay: true,         // 默认开启自动滚动；
            sliderArrow: true,      // 默认开启左右切换箭头；
            sliderBar: true,        // 默认开启分页切换栏目；
            speed: 2000,            // 速度；
            effect: 'horizontal',   // 轮播效果，默认水平，有horizontal、vertical、fade供选择；
            responsive: false,     // 响应式，默认不开启；
            callback: function () {
            },// 回调函数；
        }
        var obj = $.extend(defaults, options);
        var index = 0;
        var timer = null;

        this.each(function (index, el) {
            var me = $(this);
            if (obj.responsive) {
                var parent = me.parent();
                me.css('width', parent.width())
                me.children("ul").find("li").css('width', me.width())
            } else {
                me.css({
                    width: '100%',
                    height: '100%',
                });
                me.children("ul").find("li").css({
                    width: me.width(),
                    height: me.height(),
                });
            }
            var li_width = me.children("ul").find("li").width();
            var li_height = me.children("ul").find("li").height();
            var li_length = me.children("ul").find("li").length;

            me.children("ul").css({
                position: 'absolute',
                left: 0,
                top: 0,
                width: li_width * li_length
            })
            me.children("ul").find("li").css("float", "left");

         /*   setInterval(function () {
                me.children("ul").find("li").css({
                    width: me.width(),
                    height: me.height(),
                });
                li_width = me.children("ul").find("li").width();
                li_height = me.children("ul").find("li").height();
                me.children("ul").css({
                    width: li_width * li_length
                });
            },1000);*/

            if (obj.sliderArrow) {
                $(".btn").remove();
                var btn = "<span class='btn prev'>&lt;</span>" + '' + "<span class='btn next'>&gt;</span>"
                me.append(btn);
                me.find(".btn").hide();
                me.find(".prev").click(function () {
                    index--;
                    if (index < 0) {
                        index = li_length - 1
                    }
                    moveIndex(index);
                })
                me.find(".next").click(function () {
                    index++;
                    if (index > li_length - 1) {
                        index = 0
                    }

                    moveIndex(index);

                })
            };
            if (obj.sliderBar) {
                $(".bar").each(function () {
                    $this.remove();
                });
                var bar = "<em class='bar'></em>";
                me.append(bar);
                for (var i = 0; i < li_length; i++) {
                    me.find('.bar').append('<i></i>')
                }
                ;
                me.find('.bar i').eq(0).addClass('on');
                me.find('.bar').css('marginLeft', -me.find('.bar').outerWidth() / 2);
                me.find('.bar i').on("mouseenter", function () {
                    index = $(this).index();
                    moveIndex(index)
                })
            };
            if (obj.autoPlay) {
                clearInterval(timer)
                timer = setInterval(autoMove, obj.speed);
            }

            me.hover(function () {
                clearInterval(timer);
                me.find(".btn").fadeIn();
            }, function () {
                me.find(".btn").fadeOut();
                if (obj.autoPlay) {
                    timer = setInterval(autoMove, obj.speed);
                } else {
                    return null;
                }
            });

            function autoMove() {
                me.children("ul").find("li").css({
                    width: me.width(),
                    height: me.height(),
                });
                li_width = me.children("ul").find("li").width();
                li_height = me.children("ul").find("li").height();
                me.children("ul").css({
                    width: li_width * li_length
                });
                index++;
                if (index > li_length - 1) {
                    index = 0
                }
                moveIndex(index);
            };

            function moveIndex(index) {
                switch (obj.effect.toLowerCase()) {
                    case 'horizontal':
                        me.children("ul").stop(true, true).animate({left: -index * li_width}, 800);
                        me.find('.bar i').eq(index).addClass('on').siblings().removeClass('on');
                        break;
                    case 'vertical':
                        me.children("ul").width(li_width);
                        me.children("ul").find("li").css("float", "none");
                        me.children("ul").stop(true, true).animate({top: -index * li_height}, 800);
                        me.find('.bar i').eq(index).addClass('on').siblings().removeClass('on');
                        break;
                    case 'fade':
                        me.children("ul").width(li_width);
                        me.children("ul").find("li").css({
                            float: 'none',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        });
                        me.children("ul").find("li").eq(index).fadeIn().siblings().fadeOut();
                        me.find('.bar i').eq(index).addClass('on').siblings().removeClass('on');
                        break;
                }
            }

        });
    }
})(jQuery)