//UMD规范
;(function(root , factory){
    if(typeof module !== 'undefined' && module.exports) {
        //CommonJS规范
        module.exports = factory;
    } else if(typeof define === 'function' && define.amd) {
        define([],factory);
    } else {
        !('factory' in root) && (root.distpicker = factory); 
    }
}(this,function(window,document) {
    var d = document,
    def = {
        normal: true,
        btn: false
    },
    distpicker=null,
    btn = null,
    select = null,
    data = [
        {
            province: '广东',
            city: [
                {
                    val: '佛山',
                    district: ['顺德','南海']
                },
                {
                    val: '中山',
                    district: ['古镇','南头']
                },
                {
                    val: '珠海',
                    district: ['拱北','斗门']
                }
            ]
        },
        {
            province: '四川',
            city: [
                {
                    val: '成都',
                    district: ['锦江','青羊']
                },
                {
                    val: '广元',
                    district: ['利州','青川']
                },
                {
                    val: '广安',
                    district: ['邻水','广安']
                }
            ]
        }
    ];

    //原型对象
    function Distpicker(obj) {
        this._init(obj)
    };

    //添加实例
    Distpicker.prototype = {
        _init: function(obj) {
            //赋予默认参数
            this.extend(obj);
            //检验是否存在el
            this.check();
            //创建selectone
            this.selectone();
            //创建selecttwo
            this.selecttwo(0);
            //创建selectthree
            this.selectthree(0,0);
            //添加动作
            this.action();
        },
        extend: function(obj) {
            for (val in obj) {
                def[val] = obj[val];
            }
        },
        check: function() {
            //判断el节点是否存在
            if(!def.el) {
                throw 'The el value is must';
                return false;
            }
            distpicker = document.querySelector(def.el);
            select = distpicker.getElementsByTagName('select');
            //判断#distpicker里面的select数量是否为3
            if(select.length != 3) {
                throw 'The el DOM muse has three select';
            }
            //判断参数
            if(def.btn) {
                if(!btn) {
                    distpicker.appendChild(this.createButton('reset','reset'));
                }
                btn = distpicker.getElementsByTagName('button');
            }
        },
        selectone: function() {
            select[0].innerHTML = "";
            def['normal'] ? select[0].appendChild(this.createOption('--选择省市--', 'select','province')) : '';
            for(var i = 0,len=data.length;i<len;i++) {
                select[0].appendChild(this.createOption(data[i].province,'province',i));
                // this.selecttwo(i);
            }
        },
        selecttwo: function(i) {
            select[1].innerHTML = "";
            select[2].innerHTML = "";
            var index = select[0].value.split('-');
            //需要知道前一个下标
            if(def['normal']) {
                select[1].appendChild(this.createOption('--选择城市--', 'select','city'));
                if(index[0] !== 'province') {
                    return false;
                }
            }
            for(var j=0,len=data[i].city.length;j<len;j++) {
                select[1].appendChild(this.createOption(data[i].city[j].val,'city',j));
                // this.selectthree(i,j);
            }

            //选择城市自动选择县城
            if(def['normal']) {
                select[1].value = 'city-0';
                select[2].value = 'district-0';
            }
            this.selectthree(i,0);

        },
        selectthree: function(i,j) {
            select[2].innerHTML = "";
            //需要知道前两个下标
            if(def['normal']) {
                select[2].appendChild(this.createOption('--选择县级--', 'select','district'))
                if(select[1].value.split('-')[0] === 'select') {
                    return false;
                }
            } 
            for(var k=0,len=data[i].city[j].district.length; k< len;k++) {
                select[2].appendChild(this.createOption(data[i].city[j].district[k],'district',k));
            }

            //切换省市自动选择城市
            if(def['normal']) {
                select[2].value = 'district-0';
            }
        },
        createOption: function(text,state,index) {
            //text为城市
            //state为province/city/district
            //index为下标
            var option = d.createElement('option');
            option.textContent = text;
            option.value = state + '-' + index;
            if(state === 'select') {
                option.selected = true;
            }
            return option;
        },
        action: function() {
            var self = this,two=0;
            for(var i=0,len=select.length; i < len;i++) {
                select[i].addEventListener('change',function() {
                    var val = this.value.split('-');
                    //选择判断
                    switch(val[0]) {
                        case 'province': self.selecttwo(val[1]); two=val[1]; break;
                        case 'city': self.selectthree(two,val[1]); break;
                        case 'select': self._init(); break;
                    }
                });
            };
            //重置事件
            btn && btn[0].addEventListener('click',function() {
                self._init();
            })
        },
        createButton: function(text,classname) {
            var btn = d.createElement('button');
            btn.textContent = text;
            btn.className = classname;
            return btn;
        }
    }

    return Distpicker;
}(window,document)))