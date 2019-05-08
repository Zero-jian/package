let dom = {
  every(arr, fn) {
    for (let i = 0, len = arr.length; i < len; i++) {
      fn && fn.call(null, arr[i]);
    }
  },

  onSwipe(element, fn) {
    let x0, y0
    element.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
    })
    element.addEventListener('touchmove', function (e) {
      if (!x0 || !y0) {
        return
      }
      let xDiff = e.touches[0].clientX - x0
      let yDiff = e.touches[0].clientY - y0
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          fn.call(element, e, 'right')
        } else {
          fn.call(element, e, 'left')
        }
      } else {
        if (yDiff > 0) {
          fn.call(element, e, 'down')
        } else {
          fn.call(element, e, 'up')
        }
      }
      x0 = undefined
      y0 = undefined
    })
  }
}

class FullPage {
  constructor(options) {
    let defaluteOptions = {
      element: "",
      duration: '1s'
    }
    this.animated = false;
    this.currentIndex = 0;
    this.options = Object.assign({}, defaluteOptions, options);
    this.checkOptions().initHtml().bindEvent();
  }

  checkOptions() {
    if (!this.options.element) {
      throw new Error('element is request');
    }
    return this;
  }

  initHtml() {
    this.options.element.style.overflow = "hidden";
    //循环赋值，注意回调
    dom.every(this.options.element.children, e => {
      e.style.transition = `transform ${this.options.duration}`;
    });
    return this;
  }

  bindEvent() {
    this.options.element.addEventListener('wheel', e => {
      let targetIndex = this.currentIndex + (e.deltaY > 0 ? 1 : -1);
      this.goSection(targetIndex).then(() => {
        this.currentIndex = targetIndex;
      }, () => {});
    });

    dom.onSwipe(this.options.element, (e, dir) => {
      let targetIndex
      if (dir === 'down') {
        targetIndex = this.currentIndex - 1
      } else if (dir === 'up') {
        targetIndex = this.currentIndex + 1
      } else {
        return
      }
      this.goSection(targetIndex).then(
        () => {
          this.currentIndex = targetIndex
        },
        () => {}
      )
    })
  }

  goSection(targetIndex) {
    return new Promise((resolve, reject) => {
      if (this.animated) {
        reject();
      } else if (targetIndex < 0) {
        reject();
      } else if (targetIndex >= this.options.element.children.length) {
        reject();
      } else {
        this.animated = true;
        let that = this;
        //只监听第一个section，观察是否处于变化状态
        this.options.element.children[0].addEventListener('transitionend', function callback() {
          this.removeEventListener('transitionend', callback)
          that.animated = false
          resolve()
        })

        dom.every(this.options.element.children, e => {
          e.style.transform = `translateY(-${100*targetIndex}%)`;
        });
      }
    });
  }
}