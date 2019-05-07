let dom = {
    create(html) {
        let template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }
}

class Calendar {
    constructor(options) {
        let defaluteOptions = {
            element: null,
            startOfWeek: 1,
            strings: {
                week: n => {
                    let map = {
                        0: '周日',
                        1: '周一',
                        2: '周二',
                        3: '周三',
                        4: '周四',
                        5: '周五',
                        6: '周六',
                    }
                    return map[n];
                },
                templateDay: `<li class="currentMonth">
                    <span class="dayLabel">
                        <span class="day"></span>
                        <span class="unit">日</span>
                    </span>
                </li>`
            },
            days: {},
        }
        this.options = Object.assign({}, defaluteOptions, options);
        this.checkOptions()._generateWeekDay()._generateCurrentDay();
    }

    checkOptions() {
        if (!this.options.element) {
            throw new Error('element is request');
        }
        return this;
    }

    _generateCalendar() {
        return this;
    }

    //创建星期横轴
    _generateWeekDay() {
        let {
            startOfWeek,
            strings
        } = this.options;
        let calendar = document.querySelector('.calendar');
        let ol = dom.create(`<ol class="weekdays"></ol>`);
        calendar.appendChild(ol);
        let weekIndex = this.createArray(7, startOfWeek).map((day, i) => {
            let li = dom.create(`<li>${strings.week(i)}</li>`);
            if ((i == 0) || (i == 6)) {
                li.classList.add('weekend');
            }
            //判断是否为今天
            ol.appendChild(li);
        });
        return this;
    }

    //创建当前月份日子
    _generateCurrentDay() {
        let calendar = document.querySelector('.calendar');
        let ol = dom.create(`<ol class="days"></ol>`);
        let data = new Date(); //时间
        this.options.days.year = data.getFullYear(); //年份
        this.options.days.month = data.getMonth() + 1; //月份
        this.options.days.day = data.getDate(); //日子
        let getWeek = this._getWeekWeek(this.options.days.year, this.options.days.month-1, this.options.days.day); //星期几
        let getMonth = this._getMonth(this.options.days.year, this.options.days.month-1) //月份天数
        let getMonthDay = this._getWeekDay(); //几号
        calendar.appendChild(ol);
        //创建当月日子模块
        let dayIndex = this.createArray(35, this.options.startOfWeek).map((day, i) => {
            let li = dom.create(this.options.strings.templateDay);
            let span = li.querySelector('.dayLabel>.day');

            //判断日历起止
            if (i >= getWeek && i <= (getMonth + getWeek)) {
                span.textContent = i - getWeek;
            }

            //判断是否为今天
            if (i == (getMonthDay + getWeek)) {
                li.classList.add('today');
            }
            ol.appendChild(li);
        });

        this._generatePrevMonth();

    }

    //创建上个月日子
    _generatePrevMonth() {
        let year = this.options.days.year;
        let month = this.options.days.month;
        let beginWeek = this._getWeekWeek(year,month-1,1);//开始星期
        let countMonth = this._getMonth(year,month);//上月月份天数
        let li = document.querySelectorAll()
        this.createArray(beginWeek,this.options.startOfWeek).map((day,i)=>{
            
        }); 
    }

    //创建下个月日子
    _generateNextMonth() {

    }

    //创建数组节点
    createArray(length, fill) {
        let array = Array.apply(null, {
            length: length
        }).map(() => fill);
        return array;
    }

    //获取月份天数
    _getMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    //获取星期几
    _getWeekWeek(year, month, day) {
        return new Date(year, month, day).getDay();
    }

    //获取当前月份日子
    _getWeekDay() {
        return new Date().getDate();
    }
}