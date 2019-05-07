class Dom {
    constructor() {

    }

    append(parent, children) {
        parent.appendChild(children);
    }

    create(html) {
        //创建模板，赋值节点，返回节点
        let template = document.createElement('template');
        template.innerHTML = html;
        let node = template.content.firstChild;
        return node;
    }

    on(element,evenType,fn) {
        element.addEventListener(evenType,e=> {
            let ev = e.target;
            fn && fn(ev);
        });
    }
}

class Pager extends Dom {
    constructor(options) {
        super();
        let defaluteOptions = {
            buttonCount: 10, //每次显示的页码
            currentPage: 95, //当前页码
            element: null,
            totalPage: 20,
            templates: {
                first: '<button class="first">首页</button>',
                last: '<button class="last">末页</button>',
                next: '<button class="next">下一页</button>',
                prev: '<button class="prev">上一页</button>',
            }
        }
        //赋值默认参数
        this.options = Object.assign({}, defaluteOptions, options);
        //用于赋值的数组
        this.domRefs = [];
        this.checkOptions().initHtml().bindEvent();
    }

    checkOptions() {
        if (!this.options.element) {
            throw new Error('element is request');
        }
        return this;
    }

    initHtml() {
        //创建节点
        let nav = document.createElement('nav');
        nav.setAttribute("data-role","navNumber");
        let pager = document.getElementsByClassName('pager')[0];
        this.domRefs.first = this.create(this.options.templates.first);
        this.domRefs.next = this.create(this.options.templates.next);
        this.domRefs.last = this.create(this.options.templates.last);
        this.domRefs.prev = this.create(this.options.templates.prev);
        this._checkButton();
        this.append(nav, this.domRefs.first);
        this.append(nav, this.domRefs.prev);
        this.append(nav, this._checkNumber());
        this.append(nav, this.domRefs.next);
        this.append(nav, this.domRefs.last);
        this.append(pager, nav);
        return this;
    }

    bindEvent() {
        let ol = document.querySelector(`ol[data-role="pageNumbers"]`);
        let nav = document.querySelector(`nav[data-role="navNumber"]`);
        let first = nav.querySelector(`button[class="first"]`); //首页
        let next = nav.querySelector(`button[class="next"]`); //下一页
        let prev = nav.querySelector(`button[class="prev"]`); //上一页
        let last = nav.querySelector(`button[class="last"]`); //末页
        //为ol添加点击事件
        this.on(ol,'click',e=>{
            //改变当前页面数值
            this.options.currentPage = e.textContent;
            this._checkNumber('more');
            this._checkButton();
        });
        //为首页添加点击事件
        this.on(first,'click',e=>{
            this.options.currentPage = 1;
            this._checkNumber('more');
            this._checkButton();
        });
        //为下一页添加点击事件
        this.on(next,'click',e=>{
            this.options.currentPage += 1;
            this._checkNumber('more');
            this._checkButton();
        });
        //为上一页添加点击事件
        this.on(prev,'click',e=>{
            this.options.currentPage -= 1;
            this._checkNumber('more');
            this._checkButton();
        });
        //为末页添加点击事件
        this.on(last,'click',e=>{
            this.options.currentPage = this.options.totalPage;
            this._checkNumber('more');
            this._checkButton();
        });
    }

    _checkNumber() {
        let pageBtn,ol,end,start;
        //判断是否为初次创建
        if(arguments.length) {
            ol = document.querySelector(`ol[data-role="pageNumbers"]`);
            ol.innerHTML = "";
        } else {
            ol = this.create(`<ol data-role="pageNumbers"></ol>`);
        }
        start = Math.max((this.options.currentPage - Math.round(this.options.buttonCount / 2)), 1); //判断是否开始页码
        //判断是否超出末页数码
        if(this.options.totalPage - this.options.currentPage > Math.round(this.options.buttonCount / 2) ) {
            end = start + this.options.buttonCount + 1;
        } else {
            start = this.options.totalPage - this.options.buttonCount;
            end = this.options.totalPage + 1;
        }
        //动态创建节点
        for (let i = start; i < end; i++) {
            let li = this.create(`<li data-page=${i}>${i}</li>`);
            if (i == this.options.currentPage) {
                li.classList.add('current');
            }
            ol.appendChild(li);
        }
        return ol;
    }

    _checkButton() {
        if(this.options.currentPage == 1) {
            this.domRefs.first.setAttribute('disabled','');
            this.domRefs.prev.setAttribute('disabled','');
        } else {
            this.domRefs.first.removeAttribute('disabled');
            this.domRefs.prev.removeAttribute('disabled');
        }

        if(this.options.currentPage == this.options.totalPage) {
            this.domRefs.next.setAttribute('disabled','');
            this.domRefs.last.setAttribute('disabled','');
        }else {
            this.domRefs.next.removeAttribute('disabled');
            this.domRefs.last.removeAttribute('disabled');
        }
    }

}