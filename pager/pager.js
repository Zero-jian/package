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
}

class Pager extends Dom {
    constructor(options) {
        super();
        let defaluteOptions = {
            buttonCount: 10, //每次显示的页码
            currentPage: 1, //当前页码
            element: null,
            totalPage: 20,
            templates: {
                number: '<span>%page%</span>',
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

    }

    _checkNumber() {
        let ol = this.create(`<ol data-role="pageNumbers"></ol>`),
            pageBtn = '';
        let start = Math.max((this.options.currentPage - Math.round(this.options.buttonCount / 2)), 1); //判断是否开始页码
        let end = start + this.options.buttonCount;
        for (let i = start; i < end; i++) {
            // pageBtn += `<li data-page=${i+1}><span>${i+1}</span></li>`;
            let li = this.create(`<li data-page=${i}>${i}</li>`);
            if (i === this.options.currentPage) {
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