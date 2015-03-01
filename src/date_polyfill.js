/*jslint browser: true*/
/*jslint devel: true*/
/*global HTMLElement*/

var datepickerPolyfill = (function (document) {
    'use strict';

    var datepickers = [];

    function getParent(el, parentSelector) {
        if (el && parentSelector) {
            if (el.msMatchesSelector) { //IE
                while (el && el.msMatchesSelector(parentSelector) === false) {
                    el = el.parentElement;
                }
            } else if (el.matches) { //Everything Else
                while (el && el.matches(parentSelector) === false) {
                    el = el.parentElement;
                }
            }
            return el;
        }
        return false;
    }

    function getDatepicker(element) {
        var len, i;

        for (i = 0, len = datepickers.length; i < len; i = i + 1) {
            if (datepickers[i].wrapper === element) {
                return datepickers[i];
            }
        }

        return false;
    }

    function DatePicker(input) {
        this.input = input;

        this.active_field = null;
        this.current_date = '';
        this.date = new Date();
        this.month = false;
        this.day = false;
        this.year = false;
        this.wrapper = false;
        this.monthInput = false;
        this.dayInput = false;
        this.yearInput = false;
        this.clearBtn = false;
        this.upBtn = false;
        this.downBtn = false;
        this.blurClick = false;

        this.init_input = function () {
            var datepicker = this,
                wrapper = document.createElement('div'),
                realinput = this.input.cloneNode(true);

            wrapper.setAttribute('class', realinput.getAttribute('class'));
            wrapper.classList.add('pf-date-wrapper');

            wrapper.innerHTML = '<input type="text" class="pf-input-date-month" maxlength="2" value="mm">/' +
                '<input type="text" class="pf-input-date-day" maxlength="2" value="dd">/' +
                '<input type="text" class="pf-input-date-year" maxlength="4" value="yyyy">' +
                '<button tabindex="-1" class="pf-input-date-clear"></button>' +
                '<button tabindex="-1" class="pf-input-date-up"></button>' +
                '<button tabindex="-1" class="pf-input-date-down"></button>' +
                '<button tabindex="-1" class="pf-input-date-toggle-cal"></button>';

            realinput.setAttribute('class', 'pf-input-real');

            wrapper.appendChild(realinput);

            this.input = this.input.parentNode.replaceChild(wrapper, this.input);

            datepicker.wrapper = wrapper;
            datepicker.monthInput = wrapper.querySelector('.pf-input-date-month');
            datepicker.dayInput = wrapper.querySelector('.pf-input-date-day');
            datepicker.yearInput = wrapper.querySelector('.pf-input-date-year');
            datepicker.clearBtn = wrapper.querySelector('.pf-input-date-clear');
            datepicker.upBtn = wrapper.querySelector('.pf-input-date-up');
            datepicker.downBtn = wrapper.querySelector('.pf-input-date-down');

            if (window.navigator.userAgent.indexOf('.NET') !== -1 || window.navigator.userAgent.indexOf('MSIE ') !== -1) {
                document.removeEventListener("focusout", this.blurEvent, false);
                document.addEventListener("focusout", this.blurEvent, false);
            } else {
                document.removeEventListener("blur", this.blurEvent, true);
                document.addEventListener("blur", this.blurEvent, true);
            }

            wrapper.removeEventListener('click', datepicker, false);
            wrapper.addEventListener('click', datepicker, false);
            this.upBtn.removeEventListener('click', datepicker, false);
            this.upBtn.addEventListener('click', datepicker, false);
            this.downBtn.removeEventListener('click', datepicker, false);
            this.downBtn.addEventListener('click', datepicker, false);
            this.clearBtn.removeEventListener('click', datepicker, false);
            this.clearBtn.addEventListener('click', datepicker, false);

            document.removeEventListener("focus", this.focusEvent, true);
            document.addEventListener("focus", this.focusEvent, true);

            document.removeEventListener('keyup', this.keyUpEvent, false);
            document.addEventListener('keyup', this.keyUpEvent, false);
        };

        this.init_input();
        delete this.init_input;

        this.update = function () {
            if (this.month) {
                this.monthInput.value = this.zerofill(2, this.month);
            } else {
                this.monthInput.value = 'mm';
            }
            if (this.day) {
                this.dayInput.value = this.zerofill(2, this.day);
            } else {
                this.dayInput.value = 'dd';
            }
            if (this.year) {
                this.yearInput.value = this.zerofill(4, this.year);
            } else {
                this.yearInput.value = 'yyyy';
            }

            if (this.month !== false || this.day !== false || this.year !== false) {
                this.clearBtn.style.display = 'block';
            } else {
                this.clearBtn.style.display = 'none';
            }
        };
    }

    //Key actions
    DatePicker.prototype.keyUpEvent = function (e) {
        var wrapper = getParent(e.target, '.pf-date-wrapper'),
            datepicker = getDatepicker(wrapper);

        if (datepicker.active_field && datepicker.active_field.parentNode === wrapper) {
            switch (e.keyCode) {
            case 38:
                datepicker.upEvent(datepicker);
                break;
            case 40:
                datepicker.downEvent();
                break;
            case 39:
                datepicker.rightEvent();
                break;
            case 37:
                datepicker.leftEvent();
                break;
            case 8:
            case 46:
                datepicker.deleteEvent();
                break;
            }
        }
    };

    //When the user focuses one of the three date inputs it resets it if the value isn't valid and gives the wrapper a class to make it look focused
    DatePicker.prototype.focusEvent = function (e) {
        var wrapper = getParent(e.target, '.pf-date-wrapper'),
            datepicker = getDatepicker(wrapper);

        if (e.target && e.target.parentNode === wrapper && e.target.classList && (e.target.classList.contains('pf-input-date-year') || e.target.classList.contains('pf-input-date-month') || e.target.classList.contains('pf-input-date-day'))) {
            if (isNaN(parseInt(e.target.value, 10)) === true) {
                if (e.target.classList.contains('pf-input-date-year')) {
                    datepicker.increment_year(false);
                }
                if (e.target.classList.contains('pf-input-date-month')) {
                    datepicker.increment_month(false);
                }
                if (e.target.classList.contains('pf-input-date-day')) {
                    datepicker.increment_day(false);
                }
            }
            datepicker.active_field = e.target;
            wrapper.classList.add('pf-wrapper-focused');
        }
    };

    //if you have a date input focused and you click one of the spinner buttons it should increment the input and refocus.
    DatePicker.prototype.blurEvent = function (e) {
        var relatedTarget = null,
            dp_el = getParent(e.target, '.pf-date-wrapper'),
            datepicker = getDatepicker(dp_el),
            refocusTimeout = 50;

        if (dp_el && datepicker) {
            if (datepicker.isElement(e.explicitOriginalTarget)) { //Firefox
                relatedTarget = e.explicitOriginalTarget;
            } else if (datepicker.isElement(e.relatedTarget)) { //IE, Chrome
                relatedTarget = e.relatedTarget;
            }

            if (relatedTarget && relatedTarget === datepicker.upBtn) {
                e.preventDefault();
                datepicker.blurClick = true;
                if (e.target === datepicker.yearInput) {
                    datepicker.increment_year(1);
                    setTimeout(function () { datepicker.yearInput.focus(); }, refocusTimeout);
                } else if (e.target === datepicker.monthInput) {
                    datepicker.increment_month(1);
                    setTimeout(function () { datepicker.monthInput.focus(); }, refocusTimeout);
                } else if (e.target === datepicker.dayInput) {
                    datepicker.increment_day(1);
                    setTimeout(function () { datepicker.dayInput.focus(); }, refocusTimeout);
                }
                // if (e.target && (e.target === datepicker.yearInput || e.target === datepicker.monthInput || e.target === datepicker.dayInput)) {
                //     setTimeout(function () { e.target.focus(); }, 100);
                // }
            } else if (relatedTarget && relatedTarget === datepicker.downBtn) {
                e.preventDefault();
                datepicker.blurClick = true;
                if (e.target === datepicker.yearInput) {
                    datepicker.increment_year(-1);
                    setTimeout(function () { datepicker.yearInput.focus(); }, refocusTimeout);
                } else if (e.target === datepicker.monthInput) {
                    datepicker.increment_month(-1);
                    setTimeout(function () { datepicker.monthInput.focus(); }, refocusTimeout);
                } else if (e.target === datepicker.dayInput) {
                    datepicker.increment_day(-1);
                    setTimeout(function () { e.target.focus(); }, refocusTimeout);
                }
            // } else if (relatedTarget && relatedTarget.classList.contains('pf-input-date-down') && relatedTarget.parentNode === e.target.parentNode) {
            //     e.preventDefault();
            //     if (e.target.classList.contains('pf-input-date-year')) {
            //         datepicker.increment_year(-1);
            //     }
            //     if (e.target.classList.contains('pf-input-date-month')) {
            //         datepicker.increment_month(-1);
            //     }
            //     if (e.target.classList.contains('pf-input-date-day')) {
            //         datepicker.increment_day(-1);
            //     }
            //     if (e.target && e.target.classList && (e.target.classList.contains('pf-input-date-year') || e.target.classList.contains('pf-input-date-month') || e.target.classList.contains('pf-input-date-day'))) {
            //         setTimeout(function () { e.target.focus(); }, 100);
            //     }
            // } else if (e.target && e.target.classList && (e.target.classList.contains('pf-input-date-year') || e.target.classList.contains('pf-input-date-month') || e.target.classList.contains('pf-input-date-day'))) {
            //     if (e.target.classList.contains('pf-input-date-year') && e.target.value === '') {
            //         e.target.value = 'yyyy';
            //     }
            //     if (e.target.classList.contains('pf-input-date-month') && e.target.value === '') {
            //         e.target.value = 'mm';
            //     }
            //     if (e.target.classList.contains('pf-input-date-day') && e.target.value === '') {
            //         e.target.value = 'dd';
            //     }
            //     datepicker.active_field = null;
            //     e.target.parentNode.classList.remove('pf-wrapper-focused');
            }
        }
    };

    //http://stackoverflow.com/a/1268377
    DatePicker.prototype.zerofill = function (len, value) {
        var n = Math.abs(value),
            zeros = Math.max(0, len - Math.floor(n).toString().length),
            zeroString = Math.pow(10, zeros).toString().substr(1);

        if (value < 0) {
            zeroString = '-' + zeroString;
        }

        return zeroString + n;
    };

    //http://stackoverflow.com/a/384380/2250164
    DatePicker.prototype.isElement = function (el) {
        return (
            typeof HTMLElement === "object" ? el instanceof HTMLElement : //DOM2
                    el && typeof el === "object" && el !== null && el.nodeType === 1 &&
                    typeof el.nodeName === "string"
        );
    };

    DatePicker.prototype.increment_day = function (amount) {
        var newValue;

        if (amount === false) {
            this.day = false;
        } else if (this.day === false) {
            this.day = this.date.getDate();
        } else {
            newValue = this.day + amount;

            if (newValue > 31) {
                this.day = 1;
            } else if (newValue < 1) {
                this.day = 31;
            } else {
                this.day = newValue;
            }
        }
        this.update();
    };

    DatePicker.prototype.increment_month = function (amount) {
        var newValue;

        if (amount === false) {
            this.month = false;
        } else if (this.month === false) {
            this.month = this.date.getMonth() + 1;
        } else {
            newValue = this.month + amount;

            if (newValue > 12) {
                this.month = 1;
            } else if (newValue < 1) {
                this.month = 12;
            } else {
                this.month = newValue;
            }
        }
        this.update();
    };

    DatePicker.prototype.increment_year = function (amount) {
        var newValue;

        if (amount === false) {
            this.year = false;
        } else if (this.year === false) {
            this.year = this.date.getFullYear();
        } else {
            newValue = this.year + amount;

            if (newValue < 0) {
                this.year = this.date.getFullYear();
            } else {
                this.year = newValue;
            }
        }
        this.update();
    };

    //Keypress Events
    DatePicker.prototype.upEvent = function () {
        if (this.active_field.classList.contains('pf-input-date-year')) {
            this.increment_year(1);
        }
        if (this.active_field.classList.contains('pf-input-date-month')) {
            this.increment_month(1);
        }
        if (this.active_field.classList.contains('pf-input-date-day')) {
            this.increment_day(1);
        }
    };

    DatePicker.prototype.downEvent = function () {
        if (this.active_field.classList.contains('pf-input-date-year')) {
            this.increment_year(-1);
        }
        if (this.active_field.classList.contains('pf-input-date-month')) {
            this.increment_month(-1);
        }
        if (this.active_field.classList.contains('pf-input-date-day')) {
            this.increment_day(-1);
        }
    };

    DatePicker.prototype.leftEvent = function () {
        var inputs = this.active_field.parentNode.querySelectorAll('input'),
            i,
            len = inputs.length;
        for (i = 0; i < len; i = i + 1) {
            if (i !== 0 && inputs[i] === this.active_field) {
                inputs[(i - 1)].focus();
                this.active_field = inputs[(i - 1)];
                break;
            }
        }
    };

    DatePicker.prototype.rightEvent = function () {
        var inputs = this.active_field.parentNode.querySelectorAll('input'),
            i,
            len = inputs.length;
        for (i = 0; i < len; i = i + 1) {
            if (i !== (len - 1) && inputs[i] === this.active_field) {
                inputs[(i + 1)].focus();
                this.active_field = inputs[(i + 1)];
                break;
            }
        }
    };

    DatePicker.prototype.deleteEvent = function () {
        if (this.active_field.classList.contains('pf-input-date-year')) {
            this.increment_year(false);
        }
        if (this.active_field.classList.contains('pf-input-date-month')) {
            this.increment_month(false);
        }
        if (this.active_field.classList.contains('pf-input-date-day')) {
            this.increment_day(false);
        }
    };

    //Event Listener Events
    DatePicker.prototype.handleEvent = function (e) {
        e.stopPropagation();
        if (e.type === 'click') {
            if (e.target === this.wrapper) {
                this.monthInput.focus();
            } else if (e.target === this.clearBtn) {
                this.month = false;
                this.day = false;
                this.year = false;
                this.update();
            } else if (e.target === this.upBtn) {
                if (this.blurClick === false) {
                    this.monthInput.focus();
                    this.increment_month(1);
                } else {
                    this.blurClick = false;
                }
            } else if (e.target === this.downBtn) {
                if (this.blurClick === false) {
                    this.monthInput.focus();
                    this.increment_month(-1);
                } else {
                    this.blurClick = false;
                }
            }
        }
    };



    function publicInit(elements) {
        var len, i;
        //if only one element is passed put it in an array so I don't have to treat it differently.
        if (elements.length === undefined) {
            elements = [elements];
        }
        //Initialize all of the elements
        for (i = 0, len = elements.length; i < len; i = i + 1) {
            datepickers.push(new DatePicker(elements[i]));
        }

    }

    return {
        init: publicInit
    };
}(document));