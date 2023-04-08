/*
lpbuilderSelect
Description: convert default select style to google material design by evgenylazukin
Version: 1.0
Author: evgenylazukin
Author URL: http://evgenylazukin.com
*/
/*global $*/
(function ($) {

    'use strict';

    $.fn.lpbuilderSelect = function () {

        var indexVal,
            el = $(this),
            childrenIsDisabled,
            childrenAllAtrr = '',
            elParent = el.parent(),
            elChildren = el.children('option'),
            listItems = '<ul class="select-menu-list">',
            intNumber = Math.floor((Math.random() * 10000) + 1);

        /* children attributes
        ----------------------------------------------------------------------------- */
        elChildren.each(function () {

            if ($(this).is(':disabled')) {
                childrenIsDisabled = ' class="disabled" ';
            } else {
                childrenIsDisabled = '';
            }

            $.each(this.attributes, function () {
                if (this.specified) {
                    childrenAllAtrr += this.name + '= "' + this.value + '"';
                }
            });

            listItems += ('<li ' + childrenIsDisabled + childrenAllAtrr + '>' + $(this).html() + '</li>');

            childrenAllAtrr = '';

        });

        listItems += '</ul>';
        elParent.append('<div class="lpbuilder-select-wrapper" />').find('label').appendTo(elParent.find('.lpbuilder-select-wrapper'));
        elParent.find('.lpbuilder-select-wrapper').append(listItems);

        elParent.find('.lpbuilder-select-wrapper').prepend('<input readonly type="text" class="form-control select-menu-input' + elParent.find('select').attr('class').replace('lpbuilder-select', '') + '" name="' + elParent.find('select').attr('name') + '" id="lpbuilder-select-' + intNumber + '">');
        elParent.find('.lpbuilder-select-wrapper label').attr('for', '#lpbuilder-select-' + intNumber + '"');

        if (el.find('option[selected]').index() < 0) {
            elParent.find('ul li:nth-child(1)').addClass('selected selected-first-item');
        } else {
            indexVal = el.find('option[selected]').index() + 1;
            elParent.find('ul li:nth-child(' + indexVal + ')').addClass('selected');
            elParent.find('.select-menu-input').val(elParent.find('ul li:nth-child(' + indexVal + ')').text()).addClass('input-filled');
        }

        el.css({display: 'none'});

        /* click on input
        ----------------------------------------------------------------------------- */
        $('.select-menu-input').on('click', function (e) {

            e.stopPropagation();

            var scrollList,
                inputEl = $(this),
                inputElParent = inputEl.parent();

            inputElParent.find('.select-menu-list').css({minWidth: inputEl.outerWidth(true) + 40});

            inputElParent.find('ul').removeClass('correct-position-1').removeClass('correct-position-2').removeClass('correct-position-3').removeClass('correct-position-4').removeClass('correct-position-5');

            scrollList = inputElParent.find('ul li.selected').index() * inputElParent.find('ul li.selected').outerHeight(true);

            if (inputElParent.find('ul li:nth-child(1)').hasClass('selected')) {

                inputElParent.find('ul').addClass('correct-position-1');
                inputElParent.find('ul').animate({scrollTop: scrollList}, 0);

            } else if (inputElParent.find('ul li:nth-child(2)').hasClass('selected')) {

                inputElParent.find('ul').addClass('correct-position-2');
                inputElParent.find('ul').animate({scrollTop: 0}, 0);

            } else if (inputElParent.find('ul li:nth-last-child(2)').hasClass('selected')) {

                if (inputElParent.find('ul li').length >= 5) {
                    inputElParent.find('ul').addClass('correct-position-4');
                    inputElParent.find('ul').animate({scrollTop: scrollList}, 0);
                } else {
                    inputElParent.find('ul').addClass('correct-position-3');
                    scrollList = (inputElParent.find('ul li.selected').index() - 2) * inputElParent.find('ul li.selected').outerHeight(true);
                    inputElParent.find('ul').animate({scrollTop: scrollList}, 0);
                }

            } else if (inputElParent.find('ul li:last-child').hasClass('selected')) {

                if (inputElParent.find('ul li').length >= 5) {
                    inputElParent.find('ul').addClass('correct-position-5');
                    inputElParent.find('ul').animate({scrollTop: scrollList}, 0);
                } else {
                    if (inputElParent.find('ul li').length === 3) {
                        inputElParent.find('ul').addClass('correct-position-3');
                    } else {
                        inputElParent.find('ul').addClass('correct-position-4');
                    }
                    scrollList = (inputElParent.find('ul li.selected').index() - 2) * inputElParent.find('ul li.selected').outerHeight(true);
                    inputElParent.find('ul').animate({scrollTop: scrollList}, 0);
                }

            } else {

                inputElParent.find('ul').addClass('correct-position-3');
                scrollList = (inputElParent.find('ul li.selected').index() - 2) * inputElParent.find('ul li.selected').outerHeight(true);
                inputElParent.find('ul').animate({scrollTop: scrollList}, 0);

            }

            inputElParent.find('.select-menu-input').addClass('input-filled');
            $('.show-select-menu-list').removeClass('show-select-menu-list');
            inputEl.addClass('show-select-menu-list');
            $('body').addClass('stop-scroll');

        });

        /* click on body
        ----------------------------------------------------------------------------- */
        $('body').on('click', function () {

            $('body').removeClass('stop-scroll');
            $('.select-menu-input').removeClass('show-select-menu-list');

            $('.select-menu-input').each(function () {
                if ($(this).val() === '') {
                    $(this).removeClass('input-filled');
                }
            });

        });

        /* click on List Item
        ----------------------------------------------------------------------------- */
        $('.select-menu-list li').on('click', function () {

            var listEl = $(this),
                listElParent = listEl.parent();

            if (!listEl.hasClass('disabled')) {
                listElParent.find('.selected').removeClass('selected').removeClass('selected-first-item');
                listEl.addClass('selected');
                listElParent.parent().find('.select-menu-input').val(listEl.text()).removeClass('show-select-menu-list').addClass('input-filled');
                $('body').removeClass('stop-scroll');
            }

        });

    };

}($));