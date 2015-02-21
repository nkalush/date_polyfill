/*jslint browser: true*/
/*jslint devel: true*/
(function (document) {
    'use strict';

    var active_field = null,
        date = new Date();

    //http://stackoverflow.com/a/1268377
    function setValue(el, len, value) {
        var n = Math.abs(value),
            zeros = Math.max(0, len - Math.floor(n).toString().length),
            zeroString = Math.pow(10, zeros).toString().substr(1);

        if (value < 0) {
            zeroString = '-' + zeroString;
        }

        el.value = zeroString + n;
    }

    function increment_day(datepicker, amount) {
        var dayInput = datepicker.querySelector('.pf-input-date-day'),
            newValue;

        if (amount === false) {
            dayInput.value = 'dd';
        } else if (dayInput.value === '' || isNaN(dayInput.value)) {
            setValue(dayInput, 2, date.getDate());
        } else {
            newValue = parseInt(dayInput.value, 10) + amount;

            if (newValue > 31) {
                setValue(dayInput, 2, 1);
            } else if (newValue < 1) {
                setValue(dayInput, 2, 31);
            } else {
                setValue(dayInput, 2, newValue);
            }
        }
    }

    function increment_month(datepicker, amount) {
        var monthInput = datepicker.querySelector('.pf-input-date-month'),
            newValue;

        if (amount === false) {
            monthInput.value = 'mm';
        } else if (monthInput.value === '' || isNaN(monthInput.value)) {
            setValue(monthInput, 2, date.getMonth() + 1);
        } else {
            newValue = parseInt(monthInput.value, 10) + amount;

            if (newValue > 12) {
                setValue(monthInput, 2, 1);
            } else if (newValue < 1) {
                setValue(monthInput, 2, 12);
            } else {
                setValue(monthInput, 2, newValue);
            }
        }
    }

    function increment_year(datepicker, amount) {
        var yearInput = datepicker.querySelector('.pf-input-date-year'),
            newValue;

        if (amount === false) {
            yearInput.value = 'yyyy';
        } else if (yearInput.value === '' || isNaN(yearInput.value)) {
            setValue(yearInput, 4, date.getFullYear());
        } else {
            newValue = parseInt(yearInput.value, 10) + amount;

            if (newValue < 0) {
                setValue(yearInput, 2, date.getFullYear());
            } else {
                setValue(yearInput, 2, newValue);
            }
        }
    }

    function init_input(input) {
        var wrapper = document.createElement('div'),
            year = document.createElement('input'),
            month = document.createElement('input'),
            day = document.createElement('input');

        wrapper.setAttribute('class', input.getAttribute('class'));
        wrapper.classList.add('pf-date-wrapper');

        //hide the real input
        input.style.display = 'none';

        year.classList.add('pf-input-date-year');
        month.classList.add('pf-input-date-month');
        day.classList.add('pf-input-date-day');
        year.setAttribute('type', 'text');
        month.setAttribute('type', 'text');
        day.setAttribute('type', 'text');

        year.setAttribute('value', 'yyyy');
        year.setAttribute('maxlength', 4);
        month.setAttribute('value', 'mm');
        month.setAttribute('maxlength', 2);
        day.setAttribute('value', 'dd');
        day.setAttribute('maxlength', 2);

        wrapper.appendChild(month);
        wrapper.innerHTML = wrapper.innerHTML + ' / ';
        wrapper.appendChild(day);
        wrapper.innerHTML = wrapper.innerHTML + ' / ';
        wrapper.appendChild(year);

        //insert the fake input after the old
        input.outerHTML = input.outerHTML + wrapper.outerHTML;
    }

    function upEvent() {
        var datepicker = active_field.parentNode;

        if (active_field.classList.contains('pf-input-date-year')) {
            increment_year(datepicker, 1);
        }
        if (active_field.classList.contains('pf-input-date-month')) {
            increment_month(datepicker, 1);
        }
        if (active_field.classList.contains('pf-input-date-day')) {
            increment_day(datepicker, 1);
        }
    }

    function downEvent() {
        var datepicker = active_field.parentNode;
        if (active_field.classList.contains('pf-input-date-year')) {
            increment_year(datepicker, -1);
        }
        if (active_field.classList.contains('pf-input-date-month')) {
            increment_month(datepicker, -1);
        }
        if (active_field.classList.contains('pf-input-date-day')) {
            increment_day(datepicker, -1);
        }
    }

    function leftEvent() {
        var inputs = active_field.parentNode.querySelectorAll('input'),
            i,
            len = inputs.length;
        for (i = 0; i < len; i = i + 1) {
            if (i !== 0 && inputs[i] === active_field) {
                inputs[(i - 1)].focus();
                active_field = inputs[(i - 1)];
                break;
            }
        }
    }

    function rightEvent() {
        var inputs = active_field.parentNode.querySelectorAll('input'),
            i,
            len = inputs.length;
        for (i = 0; i < len; i = i + 1) {
            if (i !== (len - 1) && inputs[i] === active_field) {
                inputs[(i + 1)].focus();
                active_field = inputs[(i + 1)];
                break;
            }
        }
    }

    function deleteEvent() {
        var datepicker = active_field.parentNode;
        if (active_field.classList.contains('pf-input-date-year')) {
            increment_year(datepicker, false);
        }
        if (active_field.classList.contains('pf-input-date-month')) {
            increment_month(datepicker, false);
        }
        if (active_field.classList.contains('pf-input-date-day')) {
            increment_day(datepicker, false);
        }
    }

    function clickWrapperEvent(e) {
        var firstInput = e.target.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    function init() {
        var date_inputs = document.querySelectorAll('.input_date'),
            len = date_inputs.length,
            i;

        for (i = 0; i < len; i = i + 1) {
            init_input(date_inputs[i]);
        }

        date_inputs = document.querySelectorAll('.pf-date-wrapper');
        len = date_inputs.length;

        for (i = 0; i < len; i = i + 1) {
            date_inputs[i].addEventListener('click', clickWrapperEvent, false);
        }

        document.addEventListener("focus", function (e) {
            var datepicker = e.target.parentNode;
            if (e.target.classList.contains('pf-input-date-year') || e.target.classList.contains('pf-input-date-month') || e.target.classList.contains('pf-input-date-day')) {
                if (isNaN(parseInt(e.target.value, 10)) === true) {
                    if (e.target.classList.contains('pf-input-date-year')) {
                        increment_year(datepicker, false);
                    }
                    if (e.target.classList.contains('pf-input-date-month')) {
                        increment_month(datepicker, false);
                    }
                    if (e.target.classList.contains('pf-input-date-day')) {
                        increment_day(datepicker, false);
                    }
                }
                active_field = e.target;
                datepicker.classList.add('pf-wrapper-focused');
            }
        }, true);

        document.addEventListener("blur", function (e) {
            if (e.target.classList.contains('pf-input-date-year') && e.target.value === '') {
                e.target.value = 'yyyy';
            }
            if (e.target.classList.contains('pf-input-date-month') && e.target.value === '') {
                e.target.value = 'mm';
            }
            if (e.target.classList.contains('pf-input-date-day') && e.target.value === '') {
                e.target.value = 'dd';
            }
            active_field = null;
            e.target.parentNode.classList.remove('pf-wrapper-focused');
        }, true);

        document.addEventListener('keyup', function (e) {
            if (active_field !== null) {
                console.log(e.keyCode);
                switch (e.keyCode) {
                case 38:
                    upEvent();
                    break;
                case 40:
                    downEvent();
                    break;
                case 39:
                    rightEvent();
                    break;
                case 37:
                    leftEvent();
                    break;
                case 8:
                case 46:
                    deleteEvent();
                    break;
                }
            }
        }, false);
    }

    document.addEventListener("DOMContentLoaded", function () {
        init();
    });

}(document));