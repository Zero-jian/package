//UMD规范
(function (root, carousel) {
    if (typeof define == 'function' && define.amd) {
        //判断是否使用AMD规范
        define([], carousel);
    } else if (typeof module == 'object' && module.exports) {
        //判断是否使用CommonJS规范
        module.exports = carousel;
    } else {
        //暴露全局接口
        window.carousel = carousel;
    }
}(window, function (window, document) {
    var d = document,
        layuiCarousel = d.getElementsByClassName('layui-carousel')[0],
        itemCarousel = d.getElementsByClassName('carousel-item')[0],
        imgCarousel = itemCarousel.getElementsByTagName('div'),
        imgCarouselLength = imgCarousel.length,
        timer = null,
        bot = null,
        animated = true,
        float = null;
    def = {
        width: '100%', //宽度
        height: '280px', //高度
        autoplay: false, //自动播放
        arrow: false, //是否隐藏箭头方式
        animate: 'default', //动画方式
        interval: 25, //时间间隔
        defineIndex: 1, //默认下标
    };
    //创建函数
    function carousel() {};
    //原型模式添加方法
    carousel.prototype = {
        //外部调用的方法
        render: function (obj) {
            //设置默认参数
            this.config = this.extend(obj);
            //设置初始样式
            this.itemWidth();
            //创建其余的html结构
            this.view();
            //添加动作
            this.action();
            //判断是否允许自动播放
            this.autoplay();
        },
        //判断carousel-item类下面存在div数量,根据数量去设置样式
        itemWidth: function () {
            layuiCarousel.style.width = this.config.width;
            layuiCarousel.style.height = this.config.height;
            itemCarousel.style.width = imgCarouselLength * 100 + '%';
            itemCarousel.style.left = layuiCarousel.offsetWidth * (this.config.defineIndex - 1) * -1 + 'px';
            for (var i = 0, len = imgCarousel.length; i < len; i++) {
                imgCarousel[i].style.width = (100 / imgCarouselLength) + '%';
                imgCarousel[i].style.lineHeight = this.config.height;
            }
        },
        //添加创建视图方法
        view: function () {
            //添加时间要在原始节点方法前面
            var str = "<div class='carousel-float'><div class='carousel-float-left carousel-float-btn' style='float:left'><</div><div class='carousel-float-right carousel-float-btn' style='float:right'>></div></div>";
            str = str + "<div class='carousel-btn'>";
            for (var i = 0, len = imgCarousel.length; i < len; i++) {
                str = str + "<div class='carousel-btn-bottom'></div>";
            }
            str = str + "</div>"
            //添加节点进itemCarousel
            itemCarousel.insertAdjacentHTML('afterend', str);
            bot = document.getElementsByClassName('carousel-btn-bottom');
            //判断动画播放类型
            if (this.config.animate != 'default') {
                for (var i = 0; i < imgCarousel.length; i++) {
                    imgCarousel[i].style.opacity = 0;
                }
            }
            //创建后运行动画函数
            this.animate(this.config.defineIndex);
        },
        //添加动作方法
        action: function () {
            float = document.getElementsByClassName('carousel-float-btn'),
                self = this;
            self.config.arrow ? "" : float[0].style.opacity = 0;
            self.config.arrow ? "" : float[1].style.opacity = 0;
            //向左边点击
            float[0].onclick = function () {
                if (animated) {
                    self.config.defineIndex < 2 ? self.config.defineIndex = 5 : self.config.defineIndex--;
                    self.animate(self.config.defineIndex);
                }
            }
            //向右边点击
            float[1].onclick = function () {
                if (animated) {
                    self.config.defineIndex > 4 ? self.config.defineIndex = 1 : self.config.defineIndex++;
                    self.animate(self.config.defineIndex);
                }
            }
            //点击下标事件
            for (var i = 0; i < bot.length; i++) {
                (function (i) {
                    bot[i].onclick = function () {
                        if (animated) {
                            self.config.defineIndex = i + 1;
                            self.animate(self.config.defineIndex);
                        }
                    }
                }(i));
            }
            //鼠标移出
            layuiCarousel.onmouseout = function () {
                self.config.autoplay ? self.autoplay() : "";
                self.config.arrow ? "" : float[0].style.opacity = 0;
                self.config.arrow ? "" : float[1].style.opacity = 0;
            }
            //鼠标移入
            layuiCarousel.onmouseover = function () {
                self.config.autoplay ? clearInterval(timer) : "";
                self.config.arrow ? "" : (float[0].style.opacity = 1);
                self.config.arrow ? "" : (float[1].style.opacity = 1)
            }
        },
        //设置默认参数
        extend: function (obj) {
            for (a in obj) {
                def[a] = obj[a];
            }
            return def;
        },
        //运动函数
        animate: function (context) {
            var newLeft = (context - 1) * layuiCarousel.offsetWidth * -1,
                self = this;
            var speed = (newLeft - itemCarousel.offsetLeft) / this.config.interval;
            //设置默认运动方式
            function go() {
                if ((speed > 0 && newLeft > itemCarousel.offsetLeft) || (speed < 0 && newLeft < itemCarousel.offsetLeft)) {
                    animated = false;
                    itemCarousel.style.left = itemCarousel.offsetLeft + speed + 'px';
                    setTimeout(go, self.config.interval);
                } else {
                    itemCarousel.style.left = newLeft + 'px';
                    animated = true;
                }
            }
            //设置淡入淡出方法
            function fade() {
                for (var i = 0; i < imgCarousel.length; i++) {
                    imgCarousel[i].style.opacity = 0;
                }
                itemCarousel.style.left = newLeft + 'px';
                imgCarousel[self.config.defineIndex - 1].style.opacity = 1;
            }
            this.itemIndex();
            this.config.animate == 'default' ? go() : fade();
        },
        //标注小点点
        itemIndex: function () {
            for (var i = 0; i < bot.length; i++) {
                if (bot[i].getAttribute('class').indexOf('carousel-btn-focus') > -1) {
                    bot[i].classList.remove('carousel-btn-focus');
                }
            }
            bot[this.config.defineIndex - 1].classList.add('carousel-btn-focus');
        },
        //自动播放
        autoplay: function () {
            var self = this;
            if (self.config.autoplay) {
                timer = setInterval(function () {
                    float[1].click();
                }, 1500);
            }
        }
    }
    return carousel;

}(window, document)))