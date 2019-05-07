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
        this.checkOptions()._generateTime()._generateWeekDay()._generateCurrentDay();
    }

    checkOptions() {
        if (!this.options.element) {
            throw new Error('element is request');
        }
        return this;
    }

    _generateTime() {
        let data = new Date(); //时间
        let year = this.options.days.year = data.getFullYear(); //年份
        let month = this.options.days.month = data.getMonth() + 1; //月份
        let day = this.options.days.day = data.getDate(); //日子
        this.options.days.countDay = 0; //日历总日子
        this.options.days.noMonth = data.getMonth() + 1; //不变的月份
        this.options.days.noYear = data.getFullYear(); //不变的年份
        return this;
    }

    _generateCalendar() {
        let ol = document.querySelector('.days');
        let p = document.querySelector('p[data-role="time"]');
        ol.remove();
        p.remove();
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
            //判断是否为今天
            ol.appendChild(li);
        });
        return this;
    }

    //创建当前月份日子
    _generateCurrentDay() {
        let date = this.options.days;
        let calendar = document.querySelector('.calendar');
        let ol = dom.create(`<ol class="days"></ol>`);
        let getWeek = this._getWeekWeek(date.year, date.month-1, date.day); //星期几
        let getMonth = this._getMonth(date.year, date.month) //月份天数
        let getMonthDay = this._getWeekDay(); //几号
        date.countDay = 0;
        date.countDay += getMonth;
        calendar.appendChild(ol);
        //创建当月日子模块
        let dayIndex = this.createArray(42, this.options.startOfWeek).map((day, i) => {
            let li = dom.create(this.options.strings.templateDay);
            let span = li.querySelector('.dayLabel>.day');
            //判断日历起止
            if (i >= getWeek && i <= (getMonth + getWeek)) {
                span.textContent = i - getWeek;
            }

            //判断是否为今天
            if (i == (getMonthDay + getWeek) && date.noMonth == date.month && date.noYear == date.year) {
                li.classList.add('today');
            }
            ol.appendChild(li);
        });
        document.querySelector('h1.date').appendChild(dom.create(`<p data-role="time">${date.year}-${date.month}-${date.day}</p>`));
        this._generatePrevMonth()._generateNextMonth();

    }

    //创建上个月日子
    _generatePrevMonth() {
        let date = this.options.days;
        let year = date.year;
        let month = date.month;
        let beginWeek = this._getWeekWeek(year,month-1,1);//开始星期
        let countMonth = this._getMonth(year,month-1);//上月月份天数
        let li = document.querySelectorAll('.dayLabel>.day');
        beginWeek == 0 ? beginWeek+= 7 : ''; //如果月份开头为星期日，会出bug，这是防止
        date.countDay += beginWeek;
        this.createArray(beginWeek,this.options.startOfWeek).map((day,i)=>{
            if(i<beginWeek) {
                li[i].textContent = countMonth - beginWeek + 1 + i;
            }
        }); 
        return this;
    }

    //创建下个月日子
    _generateNextMonth() {
        let date = this.options.days;
        let year = date.year;
        let month = date.month;
        let beginWeek = this._getWeekWeek(year,month,1);//开始星期
        let countMonth = this._getMonth(year,month+1);//下月月份天数
        let li = document.querySelectorAll('.dayLabel>.day');
        this.createArray(42-date.countDay , this.options.startOfWeek).map((day,i)=>{
            li[date.countDay+i].textContent = i+1;
        });
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

    //上一个月
    previousMonth() {
        // this.options.days.month -= 1;
        this.changeMonth('prev');
    }

    //下一个月
    nextMonth() {
        // this.options.days.month += 1;
        this.changeMonth('next');
    }

    //回到今天
    resetMonth() {
        // this._generateTime();
        this.changeMonth('defalut');
    }

    //封装月份dom
    changeMonth(status) {
        let date = this.options.days;
        switch(status) {
            case 'prev': {
                --date.month < 1 ?  date.year-- ? date.month = 12 : '' : '';
                break;
            }

            case 'next': {
                ++date.month > 12 ?  date.year++ ? date.month = 1 : '' : '';
                break;
            }

            case 'defalut': {
                this._generateTime();
                break;
            }
        }
        this._generateCalendar();
        this._generateCurrentDay();
    }
}