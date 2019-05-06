class Dom {
    constructor() {

    }

    remove(elem,className,fn) {
        for(let i=0;i<elem.length;i++) {
            if(elem[i].classList.contains(className)) {
                elem[i].classList.remove(className);
                fn && fn();
            }
        }
        fn && fn();
    }

    index(el) {
        let parent = el.parentNode.children,index = -1;
        for(let i=0;i<parent.length;i++) {
            if(parent[i] === el) {
                index = i;
                break;
            }
        }
        return index;
    }
}

class Tabs extends Dom{
    constructor(options) {
        super();
        let defaluteOptions = {
            element: "",
            navSelector: '[data-role="tabs-nav"]',
            panesSelector: '[data-role="tabs-panes"]',
            activeClassName: 'active'
        }
        this.options = Object.assign({},defaluteOptions,options);
        this.checkOptions().bindEvent().setDefaluteOptions();
    }

    checkOptions() {
        if(!this.options.element) {
            throw new Error('element is request');
        }
        return this;
    }

    bindEvent() {
        this.options.element.addEventListener('click',e=> {
            let el = e.target;
            let navSelector = document.querySelector(this.options.navSelector).children;
            let panesSelector = document.querySelector(this.options.panesSelector).children;
            let index = this.index(el);
            //去除className后触发回调添加className
            this.remove(navSelector,this.options.activeClassName,()=>{
                navSelector[index].classList.add(this.options.activeClassName);
            });
            //去除className后触发回调添加className
            this.remove(panesSelector,this.options.activeClassName,()=>{
                panesSelector[index].classList.add(this.options.activeClassName);
            });
        })
        return this;
    }

    setDefaluteOptions() {
        document.querySelector(this.options.navSelector).children[0].click();
    }
}