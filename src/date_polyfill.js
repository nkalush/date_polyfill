/*jslint browser: true*/
/*jslint devel: true*/
(function (window, document) {
    'use strict';
    var active_field = null,
        date = new Date();

    function init_input(input) {
        var wrapper = document.createElement('div'),
            year = document.createElement('input'),
            month = document.createElement('input'),
            day = document.createElement('input'),
            input_style = window.getComputedStyle(input, null);

        wrapper.setAttribute('class', input.getAttribute('class'));
        wrapper.classList.add('pf-date-wrapper');
        //Copy all of the styles from the real input
        wrapper.style.cssText = input_style.cssText;
        //hide the real input
        input.style.display = 'none';

        year.style.cssText = 'border:none;padding:none;width:2.25em';
        month.style.cssText = 'border:none;padding:none;width:1.5em';
        day.style.cssText = 'border:none;padding:none;width:1.5em';

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


        // year.onfocusin  = function(){
        //  console.log(this);
        // };
        // year.onfocusout = function(){
        //  console.log(this);
        // };
        // year.addEventListener('focus', function(){
        //  console.log(this);
        //  this.setAttribute('value','');
        // }, true);
    }

    function upEvent() {
        if (active_field.value === '') {
            if (active_field.classList.contains('pf-input-date-year') && active_field.value === '') {
                active_field.value = date.getFullYear();
            }
            if (active_field.classList.contains('pf-input-date-month') && active_field.value === '') {
                active_field.value = date.getMonth() + 1;
            }
            if (active_field.classList.contains('pf-input-date-day') && active_field.value === '') {
                active_field.value = date.getDate();
            }
        } else {
            if (active_field.classList.contains('pf-input-date-day')) {
                if (parseInt(active_field.value, 10) >= 31) {
                    active_field.value = 1;
                } else {
                    active_field.value = parseInt(active_field.value, 10) + 1;
                }
            } else if (active_field.classList.contains('pf-input-date-month')) {
                if (parseInt(active_field.value, 10) >= 12) {
                    active_field.value = 1;
                } else {
                    active_field.value = parseInt(active_field.value, 10) + 1;
                }
            } else {
                active_field.value = parseInt(active_field.value, 10) + 1;
            }
        }
    }

    function downEvent() {
        if (active_field.value === '') {
            if (active_field.classList.contains('pf-input-date-year') && active_field.value === '') {
                active_field.value = date.getFullYear();
            }
            if (active_field.classList.contains('pf-input-date-month') && active_field.value === '') {
                active_field.value = date.getMonth() + 1;
            }
            if (active_field.classList.contains('pf-input-date-day') && active_field.value === '') {
                active_field.value = date.getDate();
            }
        } else {
            if (active_field.classList.contains('pf-input-date-day')) {
                if (parseInt(active_field.value, 10) <= 1) {
                    active_field.value = 31;
                } else {
                    active_field.value = parseInt(active_field.value, 10) - 1;
                }
            } else if (active_field.classList.contains('pf-input-date-month')) {
                if (parseInt(active_field.value, 10) <= 1) {
                    active_field.value = 12;
                } else {
                    active_field.value = parseInt(active_field.value, 10) - 1;
                }
            } else {
                active_field.value = parseInt(active_field.value, 10) - 1;
            }
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

    function clickWrapperEvent(e) {
        console.log(e.target);
        e.target.querySelector('input').focus();
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
            if (e.target.classList.contains('pf-input-date-year') || e.target.classList.contains('pf-input-date-month') || e.target.classList.contains('pf-input-date-day')) {
                if (isNaN(parseInt(e.target.value, 10)) === true) {
                    e.target.value = '';
                }
                active_field = e.target;
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
        }, true);

        document.addEventListener('keyup', function (e) {
            if (active_field !== null) {
                // console.log(e.keyCode);
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
                }
            }
        }, false);
    }

    document.addEventListener("DOMContentLoaded", function () {
        init();
    });

}(window, document));