(function (window, document) {
    var d = document,
        //默认参数
        def = {
            type: 1,
            shadeClose: false,
            time: 2,
        },
        type = ['info', 'title', 'answer', 'bot', 'botTitle'];
    var layer = function () {};
    layer.prototype = {
        open: function (obj) {
            this.config = this.extend(obj);
            this.view();
        },
        openAll: function (obj) {
            //type为4删除后再执行的操作
            var layer_type = d.createElement('div'),
                str;
            layer_type.className = 'layer layer-type-four';
            document.body.appendChild(layer_type);
            str = "<div class='layer-type-four-mark'>" + (obj ? obj.content : '请输入需要提醒的文字') + "</div>";
            layer_type.innerHTML = str;
            this.closeAll(layer_type);
        },
        view: function () {
            var layer = d.createElement('div'),
                str;
            layer.className = 'layer';
            document.body.appendChild(layer);
            str = "<div class='layer-mark" + " " + "layer-mark-" + type[this.config.type - 1] + "'>" + "<div class='layer-box-" + type[this.config.type - 1] + "'><div class='layer-total-" + type[this.config.type - 1] + "'>" + this.config.content + "</div><div class='layer-btn layer-total-btn-" + type[this.config.type - 1] + "' style='display:" + (this.config.type == 2 || this.config.type == 5 ? 'none' : '') + "'>" + (this.config.type != 2 && this.config.type != 5 ? this.config.btn[0] : "") + "</div><div class='" + (this.config.type != 1 && this.config.type != 2 ? 'layer-btn' : '') + " layer-total-btn-" + type[this.config.type - 1] + "' style='display:" + (this.config.type == 1 || this.config.type == 5 || this.config.type == 2 ? 'none' : '') + "'>" + (this.config.type == 3 && this.config.type == 4 ? this.config.btn[1] : "") + "</div>" + "</div></div>";
            layer.innerHTML = str;
            this.action();
        },
        action: function () {
            var layer = d.getElementsByClassName('layer')[0];
            var btn = d.getElementsByClassName('layer-btn');
            var that = this,
                shade = null;
            //判断是否允许点击关闭遮罩层,允许则调用方法
            this.config.type == 5 ? this.config.shadeClose ? this.closeAll() : this.remove(layer,1) : this.config.shadeClose ? this.closeAll() : "";
            //判断类型来决定关闭方式
            if (this.config.type != 2) {
                shade = btn;
                for (var i = 0; i < shade.length; i++) {
                    (function (i) {
                        shade[i].addEventListener('click', function () {
                            shade.length == 2 ? that.config.type == 3 ? i ? that.yes() : that.no() : i ? that.no() : that.yes() : that.remove(layer);
                        });
                    }(i));
                }
            } else {
                //this.remove添加参数会延时关闭
                this.remove(layer, 1);
            }
        },
        //关闭遮罩层
        closeAll: function (elem) {
            var layer = d.getElementsByClassName('layer')[0],
                that = this;
            var el = elem || layer;
            el.addEventListener('click', function () {
                that.remove(el);
            });
            return false;
        },
        remove: function (elem, mount) {
            var that = this;
            mount ? setTimeout(function () {
                elem.remove();
            }, that.config.time * 1000) : elem.remove();
        },
        extend: function (obj) {
            for (a in obj) {
                def[a] = obj[a];
            }
            return def;
        },
        yes: function () {
            var layer = d.getElementsByClassName('layer')[0];
            if (this.config.yes) {
                this.config.yes();
            } else {
                console.log("你触发了yes函数");
            }
            this.remove(layer)
        },
        no: function () {
            var layer = d.getElementsByClassName('layer')[0];
            if (this.config.no) {
                this.config.no();
            } else {
                console.log("你触发了no函数");
            }
            this.remove(layer);
        }
    }
    window.layer = layer;
}(window, document));