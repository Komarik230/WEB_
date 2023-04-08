/*global jQuery, document, window, Waypoint, grecaptcha, google, InfoBox, Photostack, Cookies, smoothScroll*/
var headerScroll,
    flickrUserID,
    localZoneTime,
    donationSymbol,
    parallaxEffect,
    instagramUserID,
    scheduleWeekDay,
    mailchimpListURL,
    pageSmoothScroll,
    recaptchaSiteKey,
    blocksAtSameHeight,
    eventsTableWeekDay,
    eventsTableStartDay,
    instagramAccessToken,
    lpbuilderRecaptchaSiteKey,
    notificationExpireDays,
    donationSymbolPosition,
    googleMapAPIKey;


/* =============================================================================
Settings
============================================================================= */
// Choose between ( fixed / autoHide / normal )
headerScroll = 'fixed';

// Enable or disable Parallax Effect ( true / false )
parallaxEffect = true;

// Mailchimp list URL
mailchimpListURL = '//lpbuilder.us16.list-manage.com/subscribe/post?u=749c5c40cb95d50fda2d59ce1&amp;id=3b85ae3329';

// Your Website recaptcha Key
recaptchaSiteKey = '6LcNBygUAAAAAKGhnqkxg8ooz6a3eV9VLb_jScZp';

// Change $ to any currency symbol you want
donationSymbol = '$';

// Donation symbol Position ( left / right )
donationSymbolPosition = 'left';

// Local Time GMT Used for Timer countdown
localZoneTime = '+2';

// Make blocks at same Height as grid ( true / false )
blocksAtSameHeight = true;

// Schedule week days names
scheduleWeekDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Events Table
/*
0 => Sun
1 => Mon
2 => Tue
3 => Wed
4 => Thu
5 => Fri
6 => Sat
*/
eventsTableWeekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
eventsTableStartDay = 0;

// Instagram userID and Access Token
instagramUserID = '4535864037';
instagramAccessToken = '4535864037.f833308.e6597cf3fa0e4069bd0172c16d3b6434';

// Flickr userID
flickrUserID = '';

// Notification Expire Days
notificationExpireDays = 1;

// Smooth Scroll ( true / false )
pageSmoothScroll = false;


googleMapAPIKey = 'AIzaSyDhBZmN2-oOY8HP64N-AQ03l-rjFyT-Dcw';


/* =============================================================================
Ajax
============================================================================= */
jQuery.ajaxPrefilter(function (options) {
    'use strict';
    options.cache = true;
});




/* =============================================================================
Document Ready Function
============================================================================= */
jQuery(document).ready(function () {

    'use strict';

    var isWin,
        isOpera,
        headerTimer,
        songDetails,
        delayTime = 0,
        totalEvents = 0,
        currentPosition,
        eventsTableTimer,
        elCurrentMap = [],
        notificationBlockTimer,
        progressBarBlockArray = [],
        eventsTableCurrentYear = 0,
        eventsTableCurrentMonth = 0;


    /* =========================================================================
    Opera on Win Fix
    ========================================================================= */
    isWin = /win/.test(navigator.platform.toLowerCase());
    isOpera = /opera/.test(navigator.userAgent.toLowerCase());

    if (isWin) {
        if (isOpera) {
            jQuery('html').addClass('ie9');
        }
    }

    /* =========================================================================
    UP Button
    ========================================================================= */
    /* Button
    ------------------------------------------------------------------------- */
    jQuery('#up-button a').on('click', function () {
        jQuery('html, body').animate({scrollTop: '0'}, 800);
        return false;
    });

    /* Window Scroll
    ------------------------------------------------------------------------- */
    jQuery(window).scroll(function () {
        currentPosition = jQuery(window).scrollTop();
        if (currentPosition >= 300) {
            jQuery('#up-button').addClass('correct-position');
        } else {
            jQuery('#up-button').removeClass('correct-position');
        }
    });

    /* =========================================================================
    LPB Ripple Animation
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderRippleAnimationfn(xAxes, yAxes) {

        jQuery('.lpbuilder-ripple').remove();

        var rippleTopPosition,
            rippleLeftPosition,
            el = jQuery('.lpbuilder-ripple-animation'),
            elPosTop = el.offset().top,
            elPosLeft = el.offset().left,
            elouterWidth = el.outerWidth(),
            elouterHeight = el.outerHeight();

        el.prepend('<span class="lpbuilder-ripple"></span>');

        if (elouterWidth >= elouterHeight) {
            elouterHeight = elouterWidth;
        } else {
            elouterWidth = elouterHeight;
        }

        rippleLeftPosition = xAxes - elPosLeft - elouterWidth / 2;
        rippleTopPosition = yAxes - elPosTop - elouterHeight / 2;

        jQuery('.lpbuilder-ripple').css({
            width: elouterWidth,
            height: elouterHeight,
            top: rippleTopPosition + 'px',
            left: rippleLeftPosition + 'px'
        }).addClass('ripple-animation');

    }

    /* Action
    ------------------------------------------------------------------------- */
    jQuery('body').on('click', '.wave-effect', function (e) {

        if (e.button === 2) {
            return false;
        }

        jQuery('.lpbuilder-ripple-animation').removeClass('lpbuilder-ripple-animation');
        jQuery(this).addClass('lpbuilder-ripple-animation');
        lpbuilderRippleAnimationfn(e.pageX, e.pageY);

    });


    /* ==========================================================================
    Notification Block ( Cookie )
    ========================================================================== */
    /* Notification Top Function
    ------------------------------------------------------------------------- */
    function lpbuilderNTopfn(nbsno) {
        if (Cookies.get('LuneCookie-' + nbsno) === 'lpbuilder-nbs-' + nbsno) {
            jQuery('.notification-block-style-' + nbsno).css('display', 'none');
        } else {
            jQuery('.notification-block-style-' + nbsno).css('display', 'block');
        }
    }

    /* Notification Top Dismiss Function
    ------------------------------------------------------------------------- */
    function lpbuilderNTopDismissfn(nbsno) {
        jQuery('.notification-block-style-' + nbsno).slideUp(500);
        Cookies.set('LuneCookie-' + nbsno, 'lpbuilder-nbs-' + nbsno, {expires: notificationExpireDays});
    }

    /* Notification Modal Function
    ------------------------------------------------------------------------- */
    function lpbuilderNModalfn(nbsno) {
        if (Cookies.get('LuneCookie-' + nbsno) === 'lpbuilder-nbs-' + nbsno) {
            jQuery('.notification-block-style-' + nbsno).find('.modal').modal('hide');
        } else {
            notificationBlockTimer = setTimeout(function () {
                jQuery('.notification-block-style-' + nbsno).find('.modal').modal({
                    show: true,
                    keyboard: false,
                    backdrop: 'static'
                });
            }, 4000);
        }
    }

    /* Notification Modal Dismiss Function
    ------------------------------------------------------------------------- */
    function lpbuilderNModalDismissfn(nbsno) {
        jQuery('.notification-block-style-' + nbsno).find('.modal').modal('hide');
        Cookies.set('LuneCookie-' + nbsno, 'lpbuilder-nbs-' + nbsno, {expires: notificationExpireDays});
        clearTimeout(notificationBlockTimer);
    }

    /* Notification Translate Function
    ------------------------------------------------------------------------- */
    function lpbuilderNTranslatefn(nbsno) {
        if (Cookies.get('LuneCookie-' + nbsno) === 'lpbuilder-nbs-' + nbsno) {
            jQuery('.notification-block-style-' + nbsno).removeClass('correct-position');
        } else {
            notificationBlockTimer = setTimeout(function () {
                jQuery('.notification-block-style-' + nbsno).addClass('correct-position');
            }, 4000);
        }
    }

    /* Notification Translate Dismiss Function
    ------------------------------------------------------------------------- */
    function lpbuilderNTranslateDismissfn(nbsno) {
        jQuery('.notification-block-style-' + nbsno).removeClass('correct-position');
        Cookies.set('LuneCookie-' + nbsno, 'lpbuilder-nbs-' + nbsno, {expires: notificationExpireDays});
        clearTimeout(notificationBlockTimer);
    }

    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderNotificationsfn() {

        /* Styles
        --------------------------------------------------------------------- */
        /* Style 1
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-1')) {
            lpbuilderNTopfn(1);
        }

        /* Style 2
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-2')) {
            lpbuilderNTopfn(2);
        }

        /* Style 3
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-3')) {
            lpbuilderNTopfn(3);
        }

        /* Style 4
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-4')) {
            lpbuilderNModalfn(4);
        }

        /* Style 5
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-5')) {
            lpbuilderNModalfn(5);
        }

        /* Style 6
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-6')) {
            lpbuilderNModalfn(6);
        }

        /* Style 7
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-7')) {
            lpbuilderNModalfn(7);
        }

        /* Style 8
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-8')) {
            lpbuilderNModalfn(8);
        }

        /* Style 9
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-9')) {
            lpbuilderNModalfn(9);
        }

        /* Style 10
        ----------------------------------------------------------------- */
        if (jQuery('body').hasClass('nbs-10')) {
            lpbuilderNTranslatefn(10);
        }

        /* Close Button
        --------------------------------------------------------------------- */
        jQuery('.close-notification').on('click', function (e) {

            e.preventDefault();
            var elNotificationClass = '.' + jQuery(this).parents('.notification-block').attr('class').replace(/\s/g, '.');

            /* Styles
            ----------------------------------------------------------------- */
            if (jQuery(elNotificationClass).hasClass('notification-block-style-1')) {
                lpbuilderNTopDismissfn(1);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-2')) {
                lpbuilderNTopDismissfn(2);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-3')) {
                lpbuilderNTopDismissfn(3);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-4')) {
                lpbuilderNModalDismissfn(4);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-5')) {
                lpbuilderNModalDismissfn(5);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-6')) {
                lpbuilderNModalDismissfn(6);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-7')) {
                lpbuilderNModalDismissfn(7);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-8')) {
                lpbuilderNModalDismissfn(8);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-9')) {
                lpbuilderNModalDismissfn(9);
            } else if (jQuery(elNotificationClass).hasClass('notification-block-style-10')) {
                lpbuilderNTranslateDismissfn(10);
            }

            return false;

        });

        /* Main Link
        --------------------------------------------------------------------- */
        jQuery('.notification-block-modal .main-link').on('click', function () {
            var elNotificationClass = '.' + jQuery(this).parents('.notification-block').attr('class').replace(/\s/g, '.');
            if (jQuery(elNotificationClass).hasClass('notification-block-style-9')) {
                lpbuilderNModalDismissfn(9);
            }
        });

    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.notification-block').length) {
        jQuery.getScript('js/plugins/cookie/js.cookie.min.js', function () {
            lpbuilderNotificationsfn();
        });
    }


    /* =========================================================================
    Background Image Block
    ========================================================================= */
    if (jQuery('.remove-white-content').length) {
        jQuery('.remove-white-content').each(function () {
            jQuery(this).parents('.section-container').parent().addClass('border-bottom');
        });
    }


    /* =========================================================================
    Menu Button
    ========================================================================= */
    jQuery('.navbar-toggle').on('click', function () {
        jQuery('.navbar-toggle').toggleClass('lpbuilder-toggle');
    });


    /* =========================================================================
    Header Scroll Style
    ========================================================================= */
    /* Smooth Scroll
    ------------------------------------------------------------------------- */
    if (jQuery('[data-scroll]').length) {
        jQuery.getScript('js/plugins/scrollTo/jquery.scrollTo.min.js');
    }

    /* Fixed / Auto hide header smooth scroll function
    ------------------------------------------------------------------------- */
    function lpbuilderScrollTo() {

        /* Adding data-scroll to each link
        --------------------------------------------------------------------- */
        jQuery('.navbar-brand').each(function () {
            if (jQuery(this).attr('href').charAt(0) === '#') {
                jQuery(this).attr('data-scroll', '');
            }
        });

        jQuery('.header-menu-container a').each(function () {
            if (jQuery(this).attr('href').charAt(0) === '#') {
                jQuery(this).attr('data-scroll', '');
            }
        });

    }

    /* on click
    ------------------------------------------------------------------------- */
    jQuery('body').on('click', '[data-scroll]', function (e) {

        e.preventDefault();

        if (headerScroll === 'autoHide') {
            jQuery('html, body').scrollTo(this.hash, 800, {
                offset: 0
            });
        } else {
            jQuery('html, body').scrollTo(this.hash, 800, {
                offset: -60
            });
        }

        if (jQuery('.navbar-collapse').hasClass('in')) {
            jQuery('.navbar-toggle').removeClass('lpbuilder-toggle');
            jQuery('.navbar-collapse').removeClass('in').addClass('collapse');
        }

    });

    /* Fixed Header Function
    ------------------------------------------------------------------------- */
    function fixedHeaderfn() {

        var headerEl = jQuery('.header-menu-container');

        headerEl = new Waypoint.Sticky({
            element: headerEl[0],
            stuckClass: 'header-menu-stuck',
            wrapper: '<div class="header-menu">'
        });

        jQuery(window).scroll(function () {
            currentPosition = jQuery(window).scrollTop();
            if (currentPosition >= 300) {
                jQuery('.header-menu-stuck').addClass('header-menu-tiny');
            } else {
                jQuery('.header-menu-stuck').removeClass('header-menu-tiny');
            }
        });

        lpbuilderScrollTo();
        clearTimeout(headerTimer);

    }

    /* Auto Hide Header Function
    ------------------------------------------------------------------------- */
    function autoHideHeaderfn() {

        var headerEl = jQuery('.header-menu-container');

        headerEl = new Waypoint({
            element: headerEl[0],
            handler: function () {

                var lastScrollTop = 0,
                    el = jQuery(this.element),
                    elParent = el.parent(),
                    elGParentHeight = elParent.parent().outerHeight(true);

                elParent.css({height: el.outerHeight(true)});

                jQuery(window).scroll(function () {

                    currentPosition = jQuery(window).scrollTop();

                    if (currentPosition > elGParentHeight) {

                        if (currentPosition > lastScrollTop) {
                            elParent.find('.header-menu-container').addClass('header-menu-autohide');
                            if (currentPosition >= 300) {
                                jQuery('.header-menu-autohide').addClass('header-menu-tiny');
                            }
                        } else if (currentPosition < lastScrollTop) {
                            elParent.find('.header-menu-container').addClass('header-menu-stuck').removeClass('header-menu-autohide');
                        }

                    } else if (currentPosition < elGParentHeight && currentPosition < parseInt(elParent.offset().top, 10)) {
                        elParent.find('.header-menu-container').removeClass('header-menu-stuck');
                    }

                    if (currentPosition < 300) {
                        elParent.find('.header-menu-container').removeClass('header-menu-tiny');
                    }

                    lastScrollTop = currentPosition;

                });

            }
        });

        lpbuilderScrollTo();
        clearTimeout(headerTimer);

    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (headerScroll === 'fixed') {
        if (jQuery('.header-menu-container').length) {
            jQuery.getScript('js/plugins/waypoint/jquery.waypoints.min.js', function () {
                jQuery.getScript('js/plugins/waypoint/sticky.min.js', function () {
                    jQuery.getScript('js/plugins/scrollTo/jquery.scrollTo.min.js', function () {
                        fixedHeaderfn();
                    });
                });
            });
        }
    } else if (headerScroll === 'autoHide') {
        if (jQuery('.header-menu-container').length) {
            jQuery.getScript('js/plugins/waypoint/jquery.waypoints.min.js', function () {
                jQuery.getScript('js/plugins/waypoint/sticky.min.js', function () {
                    jQuery.getScript('js/plugins/scrollTo/jquery.scrollTo.min.js', function () {
                        autoHideHeaderfn();
                    });
                });
            });
        }
    }

    /* Close Notification
    ------------------------------------------------------------------------- */
    jQuery('.close-notification').on('click', function () {
        headerTimer = setTimeout(function () {
            if (headerScroll === 'fixed') {
                fixedHeaderfn();
            } else if (headerScroll === 'autoHide') {
                autoHideHeaderfn();
            }
        }, 600);
    });


    /* ==========================================================================
    Data Spy
    ========================================================================== */
    jQuery('body').attr('data-spy', 'scroll').attr('data-target', '.header-menu-container').attr('data-offset', '61');

    /* Resize Window
    ------------------------------------------------------------------------- */
    jQuery(window).resize(function () {
        jQuery('[data-spy="scroll"]').each(function () {
            jQuery(this).scrollspy('refresh');
        });
    });


    /* =========================================================================
    Sub Menu
    ========================================================================= */
    /* Arrow
    ------------------------------------------------------------------------- */
    jQuery('ul.navbar-nav li ul').parent('li').addClass('parent-list');
    jQuery('.parent-list > a').append('<span class="menu-arrow"><i class="fa fa-angle-down"></i></span>');

    /* List
    ------------------------------------------------------------------------- */
    jQuery('.parent-list > ul').addClass('sub-menu');

    /* Parent Item
    ------------------------------------------------------------------------- */
    jQuery('.parent-list').each(function () {
        var el = jQuery('> .sub-menu', this);
        jQuery('> a', this).clone().prependTo(el).wrap('<li></li>');
    });
    jQuery('.sub-menu').find('.sub-menu li:first').remove();
    jQuery('.sub-menu a').addClass('wave-effect');
    jQuery('.sub-menu li:first-child a').removeClass('wave-effect');

    /* Show / Hide Sub Menu
    ------------------------------------------------------------------------- */
    jQuery('.parent-list').on({
        mouseenter: function () {
            var el = jQuery('> ul', this),
                elHeight = el.find('> li').length * 42 + 20;
            el.animate({
                width: '200px',
                height: elHeight
            }, 300);
        },
        mouseleave: function () {
            var el = jQuery('> ul', this);
            el.animate({
                width: '0',
                height: '0'
            }, 100);
        }
    });


    /* =========================================================================
    Swiper Slider
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function swiperSliderfn() {
        jQuery('.lpbuilder-swiper-slider').each(function (index) {

            var grabTouchMouse,
                sliderDirection,
                el = jQuery(this),
                slideItemsPerView,
                slideItemsMDPerView,
                slideItemsSMPerView,
                slideItemsXSPerView,
                centeredSlidesItems,
                slideAnimationEffect,
                windowWidth = jQuery(window).outerWidth(true);

            /* Thumbs
            ----------------------------------------------------------------- */
            if (el.hasClass('thumbs-swiper-slider')) {
                el.find('.swiper-pagination').addClass('swiper-pagination-tumbs');
                el.find('.swiper-pagination').removeClass('swiper-pagination');
                el.find('.swiper-pagination-tumbs span:first').addClass('active-swiper-slide');
                el.find('.swiper-pagination-tumbs span').each(function (slidesIndex) {
                    jQuery(this).attr('data-lpbuilder-swiper-slide-to', slidesIndex + 1);
                });
            }

            /* Slider, Pagination and Arrows IDs
            ----------------------------------------------------------------- */
            el.attr('id', 'lpbuilder-swiper-slider-' + index);
            el.find('.swiper-pagination').attr('id', 'lpbuilder-swiper-pagination-' + index);
            el.find('.swiper-button-next').attr('id', 'lpbuilder-swiper-button-next-' + index);
            el.find('.swiper-button-prev').attr('id', 'lpbuilder-swiper-button-prev-' + index);

            /* Mouse Cursor
            ----------------------------------------------------------------- */
            grabTouchMouse = jQuery('#lpbuilder-swiper-slider-' + index).hasClass('fade-swiper-slider')
                ? !1
                : !0;

            /* Direction
            ----------------------------------------------------------------- */
            sliderDirection = jQuery('#lpbuilder-swiper-slider-' + index).hasClass('vertical-swiper-slider')
                ? 'vertical'
                : 'horizontal';

            /* Centerd Items
            ----------------------------------------------------------------- */
            centeredSlidesItems = jQuery('#lpbuilder-swiper-slider-' + index).hasClass('center-swiper-slider')
                ? !0
                : !1;

            /* Animation Effect ( fade / slide )
            ----------------------------------------------------------------- */
            slideAnimationEffect = jQuery('#lpbuilder-swiper-slider-' + index).hasClass('fade-swiper-slider')
                ? 'fade'
                : 'slide';

            /* Animation Effect ( coverflow )
            ----------------------------------------------------------------- */
            if (jQuery('#lpbuilder-swiper-slider-' + index).hasClass('coverflow-swiper-slider')) {
                if (windowWidth < 1024) {
                    jQuery('#lpbuilder-swiper-slider-' + index).removeClass('swiper-container-3d');
                    jQuery('#lpbuilder-swiper-slider-' + index).find('.swiper-slide').css({transform: 'rotateY(0)'});
                    slideItemsPerView = '2';
                    slideAnimationEffect = 'slide';
                } else {
                    slideAnimationEffect = 'coverflow';
                }
            }

            /* Slide Items Per View ( on Large screen )
            ----------------------------------------------------------------- */
            slideItemsPerView = jQuery('#lpbuilder-swiper-slider-' + index).attr('data-swiper-items');
            if (slideItemsPerView === '' || slideItemsPerView === undefined) {
                slideItemsPerView = 1;
            }

            /* Slide Items Per View ( on Medium screen )
            ----------------------------------------------------------------- */
            slideItemsMDPerView = jQuery('#lpbuilder-swiper-slider-' + index).attr('data-swiper-md-items');
            if (slideItemsMDPerView === '' || slideItemsMDPerView === undefined) {
                slideItemsMDPerView = 2;
            }

            /* Slide Items Per View ( on Small screen )
            ----------------------------------------------------------------- */
            slideItemsSMPerView = jQuery('#lpbuilder-swiper-slider-' + index).attr('data-swiper-sm-items');
            if (slideItemsSMPerView === '' || slideItemsSMPerView === undefined) {
                slideItemsSMPerView = 2;
            }

            /* Slide Items Per View ( on Small screen )
            ----------------------------------------------------------------- */
            slideItemsXSPerView = jQuery('#lpbuilder-swiper-slider-' + index).attr('data-swiper-xs-items');
            if (slideItemsXSPerView === '' || slideItemsXSPerView === undefined) {
                slideItemsXSPerView = 1;
            }

            if (sliderDirection === 'horizontal') {
                if (windowWidth < 401) {
                    slideItemsPerView = 1;
                } else if (windowWidth < 601) {
                    slideItemsPerView = slideItemsPerView > 1
                        ? slideItemsXSPerView
                        : 1;
                } else if (windowWidth < 768) {
                    slideItemsPerView = slideItemsPerView > 1
                        ? slideItemsSMPerView
                        : 1;
                } else if (windowWidth < 1024) {
                    slideItemsPerView = slideItemsPerView > 1
                        ? slideItemsMDPerView
                        : 1;
                }
            } else {
                slideItemsPerView = 1;
            }

            /* Configurations
            ----------------------------------------------------------------- */
            jQuery('#lpbuilder-swiper-slider-' + index).swiper({
                loop: true,
                speed: 800,
                coverflow: {
                    depth: 120,
                    rotate: -30,
                    stretch: 10
                },
                autoplay: 5000,
                paginationClickable: true,
                grabCursor: grabTouchMouse,
                direction: sliderDirection,
                effect: slideAnimationEffect,
                simulateTouch: grabTouchMouse,
                slidesPerView: slideItemsPerView,
                centeredSlides: centeredSlidesItems,
                autoplayDisableOnInteraction: false,
                pagination: '#lpbuilder-swiper-pagination-' + index,
                nextButton: '#lpbuilder-swiper-button-next-' + index,
                prevButton: '#lpbuilder-swiper-button-prev-' + index
            });

            /* Hover
            ----------------------------------------------------------------- */
            jQuery('#lpbuilder-swiper-slider-' + index).on({
                mouseenter: function () {
                    jQuery(this)[0].swiper.stopAutoplay();
                },
                mouseleave: function () {
                    jQuery(this)[0].swiper.startAutoplay();
                }
            });

        });
    }

    /* Slider Height Function
    ------------------------------------------------------------------------- */
    function swiperSliderHeightfn() {
        jQuery('.swiper-container-horizontal').each(function () {
            var el = jQuery(this);
            el.css({height: '100%'});
            el.css({height: el.find('.swiper-wrapper').outerHeight(true)});
            if (el.height() === 0 || el.height() < 21) {
                el.css({height: '100%'});
            }
        });
    }

    /* Swipe to Slide Funcrion
    ------------------------------------------------------------------------- */
    function swipToSlidefn() {

        jQuery('> :first-child', '[data-lpbuilder-swiper-slide-to]').on('click', function () {

            var el = jQuery(this),
                elParent = el.parent(),
                swipToSlide = elParent.attr('data-lpbuilder-swiper-slide-to'),
                sliderID = '#' + el.parents('.section-container').find('.lpbuilder-swiper-slider').attr('id');

            if (jQuery(sliderID)[0] !== undefined) {
                el.parents('.section-container').find('.active-swiper-slide').removeClass('active-swiper-slide');
                elParent.addClass('active-swiper-slide');
                jQuery(sliderID)[0].swiper.slideTo(swipToSlide, 500, false);
            }

        });

        if (jQuery('[data-lpbuilder-swiper-slide-to]').length) {
            jQuery('[data-lpbuilder-swiper-slide-to]').parents('.section-container').find('.lpbuilder-swiper-slider').each(function () {

                var el = jQuery(this),
                    sliderID = '#' + el.attr('id'),
                    elParents = jQuery(sliderID).parents('.section-container');

                elParents.find('.active-swiper-slide').removeClass('active-swiper-slide');
                elParents.find('[data-lpbuilder-swiper-slide-to="1"]').addClass('active-swiper-slide');

                jQuery(sliderID)[0].swiper.on('slideChangeStart', function () {

                    var slideIndex = jQuery(sliderID)[0].swiper.activeIndex,
                        swipToSlideLength = elParents.find('[data-lpbuilder-swiper-slide-to]').length;

                    elParents.find('.active-swiper-slide').removeClass('active-swiper-slide');
                    elParents.find('[data-lpbuilder-swiper-slide-to="' + slideIndex + '"]').addClass('active-swiper-slide');

                    if (slideIndex > swipToSlideLength) {
                        elParents.find('[data-lpbuilder-swiper-slide-to="1"]').addClass('active-swiper-slide');
                    }
                    if (slideIndex < 1) {
                        elParents.find('[data-lpbuilder-swiper-slide-to="' + swipToSlideLength + '"]').addClass('active-swiper-slide');
                    }

                });

            });
        }

    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.lpbuilder-swiper-slider').length) {
        jQuery.getScript('js/plugins/swiper/js/swiper.min.js', function () {
            swiperSliderfn();
            swiperSliderHeightfn();
            swipToSlidefn();
        });
    }

    /* Resize Window
    ------------------------------------------------------------------------- */
    jQuery(window).resize(function () {
        if (jQuery('.lpbuilder-swiper-slider').length) {
            jQuery('.lpbuilder-swiper-slider').each(function () {
                jQuery('#' + jQuery(this).attr('id'))[0].swiper.destroy();
            });
            swiperSliderfn();
            swiperSliderHeightfn();
            swipToSlidefn();
        }
    });


    /* =========================================================================
    Dismiss Form Message
    ========================================================================= */
    function dismissFormMessagefn() {
        jQuery('.form-message-block').css({bottom: '-20%'}).fadeOut(300, function () {
            jQuery(this).remove();
        });
    }
    jQuery('body').on('click', '.form-message-block button', function () {
        dismissFormMessagefn();
    });


    /* =========================================================================
    MailChimp Form ( Subscription )
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuildermailchimpfn() {
        jQuery('.subscribe-form-block form').each(function (index) {

            /* Form Message
            ----------------------------------------------------------------- */
            function mailchimpMessagefn(responsemsg) {
                if (!jQuery('.form-message-block').length) {
                    jQuery('body').append('<div class="form-message-block"><div class="form-message-container"></div><button type="button" class="form-message-close-button"><i class="fa fa-times"></i></button></div>');
                }
                jQuery('.form-message-container').html(responsemsg.msg);
                jQuery('.form-message-block').fadeIn(100).css({bottom: '24px'});
            }

            /* Callback
            ----------------------------------------------------------------- */
            function mailchimpCallbackfn(response) {
                if (response.result === 'success') {
                    jQuery('#lpbuilder-mailchilmp-' + index).find('.subscribe-email').val('');
                    jQuery('#lpbuilder-mailchilmp-' + index).find('.subscribe-email').removeClass('input-filled');
                    mailchimpMessagefn(response);
                } else {
                    mailchimpMessagefn(response);
                }
            }

            jQuery(this).attr('id', 'lpbuilder-mailchilmp-' + index);

            jQuery('#lpbuilder-mailchilmp-' + index).ajaxChimp({
                url: mailchimpListURL,
                callback: mailchimpCallbackfn
            });

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.subscribe-form-block').length) {
        jQuery.getScript('js/plugins/ajaxchimp/jquery.ajaxchimp.min.js', function () {
            lpbuildermailchimpfn();
        });
    }


    /* =========================================================================
    Contact Form
    ========================================================================= */
    if (jQuery('.contact-form-block').length) {
        jQuery('.contact-form-block form').each(function (index) {

            jQuery(this).attr('id', 'lpbuilder-contact-form-block-' + index);

            jQuery('#lpbuilder-contact-form-block-' + index).submit(function () {

                var el = jQuery(this),
                    formValues = el.serialize(),
                    formActionURL = el.attr('action'),
                    recaptchaID = el.find('.lpbuilder-recaptcha').attr('id');

                el.find('.lpbuilder-new-recaptcha').removeClass('lpbuilder-new-recaptcha');
                el.find('.lpbuilder-recaptcha').parent().addClass('lpbuilder-new-recaptcha');
                el.find('button').addClass('add-spin');

                jQuery.post(formActionURL, formValues, function (response) {

                    /* Form Message
                    --------------------------------------------------------- */
                    if (!jQuery('.form-message-block').length) {
                        jQuery('body').append('<div class="form-message-block"><div class="form-message-container"></div><button type="button" class="form-message-close-button"><i class="fa fa-times"></i></button></div>');
                    }
                    jQuery('.form-message-container').html(response);
                    jQuery('.form-message-block').fadeIn(100).css({bottom: '24px'});

                    /* Handle Errors
                    --------------------------------------------------------- */
                    /* Name
                    ----------------------------------------------------- */
                    if (response.match('error-name') !== null) {
                        el.find('.contact-name').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    }

                    /* Phone
                    ----------------------------------------------------- */
                    if (response.match('error-phone') !== null) {
                        el.find('.contact-phone').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    }

                    /* Call Back Time
                    ----------------------------------------------------- */
                    if (response.match('error-call-back-time') !== null) {
                        el.find('.contact-call-back-time').addClass('error');
                        el.find('.contact-call-back-time').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-call-back-time').removeClass('error');
                        el.find('.contact-call-back-time').next().removeClass('error');
                    }

                    /* Email
                    ----------------------------------------------------- */
                    if (response.match('error-email') !== null) {
                        el.find('.contact-email').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    }

                    /* Subject
                    ----------------------------------------------------- */
                    if (response.match('error-subject') !== null) {
                        el.find('.contact-subject').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    }

                    /* Message
                    ----------------------------------------------------- */
                    if (response.match('error-message') !== null) {
                        el.find('.contact-message').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    }

                    /* Choose a car
                    ----------------------------------------------------- */
                    if (response.match('error-choose-car') !== null) {
                        el.find('.contact-choose-car').addClass('error');
                        el.find('.contact-choose-car').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-choose-car').removeClass('error');
                        el.find('.contact-choose-car').next().removeClass('error');
                    }

                    /* Pick-up Location
                    ----------------------------------------------------- */
                    if (response.match('error-pickup-location') !== null) {
                        el.find('.contact-pickup-location').addClass('error');
                        el.find('.contact-pickup-location').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-pickup-location').removeClass('error');
                        el.find('.contact-pickup-location').next().removeClass('error');
                    }

                    /* Drop-off Location
                    ----------------------------------------------------- */
                    if (response.match('error-dropoff-location') !== null) {
                        el.find('.contact-dropoff-location').addClass('error');
                        el.find('.contact-dropoff-location').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-dropoff-location').removeClass('error');
                        el.find('.contact-dropoff-location').next().removeClass('error');
                    }

                    /* Pick-up Date
                    ----------------------------------------------------- */
                    if (response.match('error-pickup-date') !== null) {
                        el.find('.contact-pickup-date').addClass('error');
                        el.find('.contact-pickup-date').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-pickup-date').removeClass('error');
                        el.find('.contact-pickup-date').next().removeClass('error');
                    }

                    /* Pick-up Time
                    ----------------------------------------------------- */
                    if (response.match('error-pickup-time') !== null) {
                        el.find('.contact-pickup-time').addClass('error');
                        el.find('.contact-pickup-time').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-pickup-time').removeClass('error');
                        el.find('.contact-pickup-time').next().removeClass('error');
                    }

                    /* Drop-off Date
                    ----------------------------------------------------- */
                    if (response.match('error-dropoff-date') !== null) {
                        el.find('.contact-dropoff-date').addClass('error');
                        el.find('.contact-dropoff-date').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-dropoff-date').removeClass('error');
                        el.find('.contact-dropoff-date').next().removeClass('error');
                    }

                    /* Drop-off Time
                    ----------------------------------------------------- */
                    if (response.match('error-dropoff-time') !== null) {
                        el.find('.contact-dropoff-time').addClass('error');
                        el.find('.contact-dropoff-time').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    } else {
                        el.find('.contact-dropoff-time').removeClass('error');
                        el.find('.contact-dropoff-time').next().removeClass('error');
                    }

                    /* Terms
                    ----------------------------------------------------- */
                    if (response.match('error-terms') !== null) {
                        el.find('.contact-terms').next().addClass('error');
                        el.find('button').removeClass('add-spin');
                    }

                    /* Captcha
                    ----------------------------------------------------- */
                    if (response.match('error-captcha') !== null) {
                        el.find('button').removeClass('add-spin');
                    }

                    /* Success
                    --------------------------------------------------------- */
                    if (response.match('success-message') !== null) {

                        el.find('.lpbuilder-recaptcha').remove();
                        el.find('.lpbuilder-new-recaptcha').append('<div class="lpbuilder-recaptcha" id="' + recaptchaID + '"></div>');
                        grecaptcha.render(recaptchaID, {sitekey: lpbuilderRecaptchaSiteKey});

                        el.find('.form-control').val('').removeClass('input-filled');

                        el.find('button').removeClass('add-spin');

                        el.find('.contact-terms').attr('checked', false);
                        el.find('.contact-terms').attr('value', 'accepted');
                        el.find('.contact-terms').next().removeClass('error');
                    }

                });

                return false;

            });

            jQuery(this).find('.form-control').on('focus', function () {
                jQuery(this).next().removeClass('error');
                dismissFormMessagefn();
            });

        });
    }


    /* =========================================================================
    BMI Form
    ========================================================================= */
    if (jQuery('.bmi-form-block').length) {
        jQuery('.bmi-form-block form').each(function (index) {

            jQuery(this).attr('id', 'lpbuilder-bmi-form-block-' + index);

            jQuery('#lpbuilder-bmi-form-block-' + index).submit(function () {

                var el = jQuery(this),
                    formValues = el.serialize(),
                    formActionURL = el.attr('action');

                jQuery.post(formActionURL, formValues, function (response) {

                    /* Form Message
                    --------------------------------------------------------- */
                    if (!jQuery('.form-message-block').length) {
                        jQuery('body').append('<div class="form-message-block"><div class="form-message-container"></div><button type="button" class="form-message-close-button"><i class="fa fa-times"></i></button></div>');
                    }
                    jQuery('.form-message-container').html(response);
                    jQuery('.form-message-block').fadeIn(100).css({bottom: '24px'});

                    /* Handle Errors
                    --------------------------------------------------------- */
                    if (response.match('error-weight') !== null) {
                        el.find('.bim-weight').next().addClass('error');
                    }
                    if (response.match('error-height') !== null) {
                        el.find('.bim-height').next().addClass('error');
                    }

                    /* Success
                    --------------------------------------------------------- */
                    if (response.match('success-message') !== null) {
                        el.find('.bim-weight').next().removeClass('error');
                        el.find('.bim-height').next().removeClass('error');
                        el.find('.bim-weight').val('').removeClass('input-filled');
                        el.find('.bim-height').val('').removeClass('input-filled');
                    }

                });

                return false;

            });

        });
    }


    /* =========================================================================
    Car Reservation Form
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderCar(elAttr, el) {
        jQuery.ajax({
            url: elAttr,
            error: function () {
                el.parents('.section-container').find('.car-block-container').html('Check car file location');
            },
            success: function (response) {

                var carContent = '';

                /* Car Image
                ------------------------------------------------------------- */
                if (response.carImageURL !== '') {
                    carContent += '<div class="image-block"><div class="image-block-container"><img src="' + response.carImageURL + '" alt="Image Block" /></div></div>';
                }

                /* Car Name
                ------------------------------------------------------------- */
                if (response.carName !== '') {
                    carContent += '<h4>' + response.carName + '</h4>';
                }

                /* Car Company
                ------------------------------------------------------------- */
                if (response.carCompany !== '') {
                    carContent += '<h5>' + response.carCompany + '</h5>';
                }

                /* Car Price
                ------------------------------------------------------------- */
                carContent += '<h2>';

                /* Currency
                --------------------------------------------------------- */
                if (response.carPriceCurrency !== '') {
                    carContent += '<span class="currency">' + response.carPriceCurrency + '</span>';
                }

                /* Amount
                --------------------------------------------------------- */
                if (response.carPriceAmount !== '') {
                    carContent += '<span class="amount">' + response.carPriceAmount + '</span>';
                }

                /* Duration
                --------------------------------------------------------- */
                if (response.carPriceDuration !== '') {
                    carContent += '<span class="duration">/' + response.carPriceDuration + '</span>';
                }

                carContent += '</h2>';

                /* Car Description
                ------------------------------------------------------------- */
                if (response.carDescription !== '') {
                    carContent += '<p>' + response.carDescription + '</p>';
                }

                /* Car Features
                ------------------------------------------------------------- */
                carContent += '<ul class="row">';

                /* Doors
                --------------------------------------------------------- */
                if (response.carDoors !== '') {
                    carContent += '<li class="col-md-6 col-sm-6"><i class="fa fa-car"></i>' + response.carDoors + ' Doors</li>';
                }

                /* Passengers
                --------------------------------------------------------- */
                if (response.carPassengers !== '') {
                    carContent += '<li class="col-md-6 col-sm-6"><i class="fa fa-male"></i>' + response.carPassengers + ' Passengers</li>';
                }

                /* Suitcase
                --------------------------------------------------------- */
                if (response.carSuitcase !== '') {
                    carContent += '<li class="col-md-6 col-sm-6"><i class="fa fa-suitcase"></i>' + response.carSuitcase + ' Suitcase(s)</li>';
                }

                /* Bag
                --------------------------------------------------------- */
                if (response.carBag !== '') {
                    carContent += '<li class="col-md-6 col-sm-6"><i class="fa fa-shopping-bag"></i>' + response.carBag + ' Bag(s)</li>';
                }

                /* Transmission
                --------------------------------------------------------- */
                if (response.carTransmission !== '') {
                    carContent += '<li class="col-md-6 col-sm-6"><i class="fa fa-sliders"></i>' + response.carTransmission + ' Transmission</li>';
                }

                /* Air Conditioning
                --------------------------------------------------------- */
                if (response.carAirConditioning !== '') {
                    carContent += '<li class="col-md-6 col-sm-6"><i class="fa fa-asterisk"></i>Air conditioning ' + response.carAirConditioning + '</li>';
                }

                carContent += '</ul>';

                el.parents('.section-container').find('.car-block-container').html(carContent);

            }
        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    jQuery('body').on('click', '[data-car-file]', function () {
        lpbuilderCar(jQuery(this).attr('data-car-file'), jQuery(this));
    });


    /* =========================================================================
    Form Elements
    ========================================================================= */
    /* input
    ========================================================================= */
    jQuery('.form-control').each(function () {
        jQuery(this).on({
            focus: function () {
                jQuery(this).addClass('input-filled');
            },
            focusout: function () {
                if (jQuery(this).val() === '') {
                    jQuery(this).removeClass('input-filled');
                }
            }
        });
    });


    /* Checkbox
    ========================================================================= */
    if (jQuery('input[type="checkbox"]').length) {
        jQuery('input[type="checkbox"]').each(function (index) {
            jQuery(this).attr('id', 'lpbuilder-checkbox-' + index);
            jQuery(this).next('label').attr('for', 'lpbuilder-checkbox-' + index);
        });
    }


    /* Recaptcha
    ========================================================================= */
    if (jQuery('.lpbuilder-recaptcha').length) {
        jQuery.getScript('https://www.google.com/recaptcha/api.js', function () {
            lpbuilderRecaptchaSiteKey = recaptchaSiteKey;
        });
    }


    /* Select
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderSelectfn() {
        jQuery('select').each(function (index) {
            jQuery(this).attr('id', 'lpbuilder-select-' + index);
            jQuery('#lpbuilder-select-' + index).lpbuilderSelect();

            /* Price
            ----------------------------------------------------------------- */
            if (jQuery('[selected][data-price-amount]').length) {
                jQuery('[selected][data-price-amount]').each(function () {
                    jQuery(this).parents('.pricing-block-price').find('.amount').html(jQuery(this).parent().find('.selected').attr('data-price-amount'));
                });
            }

            /* Car
            ----------------------------------------------------------------- */
            if (jQuery('[selected][data-car-file]').length) {
                jQuery('[selected][data-car-file]').each(function () {
                    lpbuilderCar(jQuery(this).attr('data-car-file'), jQuery(this));
                });
            }

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('select').length) {
        jQuery.getScript('js/plugins/lpbuilderSelect/lpbuilderSelect.min.js', function () {
            lpbuilderSelectfn();
        });
    }


    /* =========================================================================
    Video
    ========================================================================= */
    /* Background Video
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function backgroundVideofn() {
        jQuery('.background-video-block video').each(function () {

            var elWidth = 16,
                elHeight = 9,
                el = jQuery(this),
                elParent = el.parent(),
                parentWidth = elParent.outerWidth(true),
                parentHeight = elParent.outerHeight(true),
                widthRatio = parentWidth / elWidth,
                heightRatio = parentHeight / elHeight,
                ratio = widthRatio > heightRatio
                    ? widthRatio
                    : heightRatio,
                elNewWidth = ratio * elWidth,
                elNewHeight = ratio * elHeight,
                elMarginLeft = (elNewWidth - parentWidth) / -2,
                elMarginTop = (elNewHeight - parentHeight) / -2;

            el.css({
                width: elNewWidth,
                height: elNewHeight,
                marginTop: elMarginTop,
                marginLeft: elMarginLeft
            });

        });
    }

    /* Resize Window
    ------------------------------------------------------------------------- */
    jQuery(window).resize(function () {
        backgroundVideofn();
    });

    /* Buttons
    ------------------------------------------------------------------------- */
    jQuery('.background-video-block').each(function (index) {

        var el = jQuery(this);
        el.find('video').attr('id', 'lpbuilder-bg-video-' + index);

        if (el.find('video[autoplay]').length) {
            el.find('.video-overlayer').remove();
            el.find('button.play-button').html('<i class="fa fa-pause"></i>');
        } else {
            el.find('button.play-button').html('<i class="fa fa-play"></i>');
        }

        if (el.find('video[muted]').length) {
            el.find('button.mute-button').html('<i class="fa fa-volume-off"></i>');
        } else {
            el.find('button.mute-button').html('<i class="fa fa-volume-up"></i>');
        }

    });

    /* Play, Pause and Mute Buttons
    ------------------------------------------------------------------------- */
    jQuery('.background-video-block button').on('click', function () {

        var el = jQuery(this),
            videoOverlayer = el.parents('.background-video-block').find('.video-overlayer'),
            videoID = jQuery('#' + el.parents('.background-video-block').find('video').attr('id'))[0];

        if (el.hasClass('play-button')) {
            if (videoID.paused) {
                videoID.play();
                videoOverlayer.css({display: 'none'});
                el.html('<i class="fa fa-pause"></i>');
            } else {
                videoID.pause();
                el.html('<i class="fa fa-play"></i>');
            }
        }

        if (el.hasClass('mute-button')) {
            if (videoID.muted) {
                videoID.muted = false;
                el.html('<i class="fa fa-volume-up"></i>');
            } else {
                videoID.muted = true;
                el.html('<i class="fa fa-volume-off"></i>');
            }
        }

    });

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.background-video-block').length) {
        backgroundVideofn();
    }


    /* Normal Video
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderFitVidfn() {
        jQuery('.video-block').fitVids();
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.video-block').length) {
        jQuery.getScript('js/plugins/fitvids/jquery.fitvids.min.js', function () {
            lpbuilderFitVidfn();
        });
    }


    /* =========================================================================
    Fancybox
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderFancyBoxfn() {
        jQuery('.fancybox').fancybox({
            nextEffect: 'none',
            prevEffect: 'none',
            openEffect: 'elastic',
            closeEffect: 'elastic',
            helpers: {
                title: {
                    type: 'inside'
                },
                media: {}
            },
            afterShow: function () {
                jQuery('<a href="javascript:void(0)" title="View Full Size" class="expander"></a>').appendTo(this.inner).on('click', function () {
                    jQuery.fancybox.toggle();
                });
            }
        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.fancybox').length) {
        jQuery.getScript('js/plugins/fancybox/jquery.fancybox.pack.js', function () {
            jQuery.getScript('js/plugins/fancybox/helpers/jquery.fancybox-media.min.js', function () {
                lpbuilderFancyBoxfn();
            });
        });
    }


    /* =========================================================================
    Share Buttons
    ========================================================================= */
    /* Facebook
    ------------------------------------------------------------------------- */
    if (jQuery('.facebook-btn-share').length) {
        jQuery('.facebook-btn-share').each(function () {
            jQuery(this).attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href);
        });
    }

    /* Twitter
    ------------------------------------------------------------------------- */
    if (jQuery('.twitter-btn-share').length) {
        jQuery('.twitter-btn-share').each(function () {
            jQuery(this).attr('href', 'https://twitter.com/home?status=' + window.location.href + ' ' + jQuery(document).find('title').text());
        });
    }

    /* Google Plus
    ------------------------------------------------------------------------- */
    if (jQuery('.google-btn-share').length) {
        jQuery('.google-btn-share').each(function () {
            jQuery(this).attr('href', 'https://plus.google.com/share?url=' + window.location.href);
        });
    }

    /* Current Page URL
    ------------------------------------------------------------------------- */
    if (jQuery('.page-link').length) {
        jQuery('.page-link').each(function () {
            jQuery(this).val(window.location.href);
        });
        jQuery('.page-link').on('click', function () {
            jQuery(this).select();
        });
    }


    /* =========================================================================
    Progress Bar
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderProgressfn() {
        jQuery('.progress-block').each(function (index) {

            jQuery(this).attr('id', 'lpbuilder-progress-bar-block-' + index);

            progressBarBlockArray[index] = new Waypoint({
                element: jQuery('#lpbuilder-progress-bar-block-' + index),
                handler: function () {

                    var goalValue,
                        neededValue,
                        skillsValue,
                        currentValue,
                        percentValue,
                        el = jQuery(this.element);

                    /* Value ( Donate Progress Bar )
                    --------------------------------------------------------- */
                    if (el.find('.current-value').length) {

                        goalValue = el.find('.goal-value').text();
                        goalValue = goalValue.match(/(\d+)/g);
                        goalValue = parseInt(goalValue, 10);

                        currentValue = el.find('.current-value').text();
                        currentValue = currentValue.match(/(\d+)/g);
                        currentValue = parseInt(currentValue, 10);

                        percentValue = (currentValue / goalValue) * 100;
                        percentValue = parseInt(percentValue, 10);

                        /* Progress Bar Width
                        ------------------------------------------------- */
                        if (percentValue > 100) {
                            el.find('.progress-bar').css({width: '100%'});
                        } else {
                            el.find('.progress-bar').css({width: percentValue + '%'});
                        }

                        /* Start Value
                        ------------------------------------------------- */
                        el.find('.start-value').html(percentValue + '%');

                        /* Goal Value
                        ------------------------------------------------- */
                        el.find('.donate-value-goal h3').html(goalValue);

                        /* Collected Value
                        ------------------------------------------------- */
                        el.find('.donate-value-current h3').html(currentValue);

                        /* Percent
                        ------------------------------------------------- */
                        el.find('.donate-value-percent h3').html(percentValue + '%');

                        /* Needed Value
                        ------------------------------------------------- */
                        if (currentValue > goalValue) {
                            neededValue = 0;
                        } else {
                            neededValue = goalValue - currentValue;
                        }
                        el.find('.donate-value-needed h3').html(neededValue);

                        /* Donation Symbol Position
                        ------------------------------------------------- */
                        if (donationSymbolPosition === 'right') {
                            el.find('.goal-value').html(goalValue + donationSymbol);
                            el.find('.current-value').html(currentValue + donationSymbol);
                            el.find('.donate-value-goal h3').append(donationSymbol);
                            el.find('.donate-value-current h3').append(donationSymbol);
                            el.find('.donate-value-needed h3').append(donationSymbol);
                        } else {
                            el.find('.goal-value').html(donationSymbol + goalValue);
                            el.find('.current-value').html(donationSymbol + currentValue);
                            el.find('.donate-value-goal h3').prepend(donationSymbol);
                            el.find('.donate-value-current h3').prepend(donationSymbol);
                            el.find('.donate-value-needed h3').prepend(donationSymbol);
                        }

                        /* Goal Value
                        ------------------------------------------------- */
                        el.find('.goal-value').html(
                            el.find('.current-value').html() + ' of ' + el.find('.goal-value').html()
                        );

                    }

                    /* Percent ( Skills Progress Bar )
                    --------------------------------------------------------- */
                    if (el.find('.current-percent').length) {

                        skillsValue = el.find('.current-percent').text();
                        skillsValue = skillsValue.match(/(\d+)/g);
                        skillsValue = parseInt(skillsValue, 10);

                        if (skillsValue > 100) {
                            el.find('.progress-bar').css({width: '100%'});
                        } else {
                            el.find('.progress-bar').css({width: skillsValue + '%'});
                        }

                    }

                    progressBarBlockArray[index].destroy();

                },
                offset: '100%'
            });

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.progress-block').length) {
        jQuery.getScript('js/plugins/waypoint/jquery.waypoints.min.js', function () {
            lpbuilderProgressfn();
        });
    }


    /* =========================================================================
    Audio
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderAudiofn() {
        jQuery('audio').mediaelementplayer();
        jQuery('.audio-block').each(function () {

            var el = jQuery(this).find('source');

            if (el.attr('data-song-name')) {
                songDetails = el.attr('data-song-name');
                if (el.attr('data-author-name')) {
                    songDetails += ' By ';
                    songDetails += el.attr('data-author-name');
                }
                el.parents('.mejs-container').find('.mejs-controls').append('<h4>' + songDetails + '</h4>');
            }

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('audio').length) {
        jQuery.getScript('js/plugins/mediaelement/js/mediaelement-and-player.min.js', function () {
            lpbuilderAudiofn();
        });
    }


    /* =========================================================================
    Timer ( CountDown )
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderTimerfn() {
        jQuery('.timer-block').each(function () {

            var el = jQuery(this),
                yearTimer = el.attr('data-timer-year'),
                monthTimer = el.attr('data-timer-month'),
                dayTimer = el.attr('data-timer-day'),
                hourTimer = el.attr('data-timer-hour'),
                minTimer = el.attr('data-timer-min');

            el.downCount({
                date: monthTimer + '/' + dayTimer + '/' + yearTimer + ' ' + hourTimer + ':' + minTimer + ':' + '00',
                offset: localZoneTime
            });

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.timer-block').length) {
        jQuery.getScript('js/plugins/downCount/jquery.downCount.min.js', function () {
            lpbuilderTimerfn();
        });
    }


    /* =========================================================================
    Google Map
    ========================================================================= */
    /* Markers Function
    ------------------------------------------------------------------------- */
    function mapMarkersfn(currentMapIndex) {

        var mapMarkersLocation,
            mapJSONFileLocation = jQuery('#lpbuilder-gmap-block-' + currentMapIndex).attr('data-marker-file-location');

        jQuery.ajax({
            url: mapJSONFileLocation,
            success: function (response) {

                mapMarkersLocation = response.locations;

                var mapMarkers = [],
                    infoWindowBox = [],
                    infoWindowContent,
                    infoWindowOptions,
                    infoWindowContentSwape;

                jQuery.each(mapMarkersLocation, function (index, response) {

                    mapMarkers[index] = new google.maps.Marker({
                        icon: response.markerImage,
                        position: new google.maps.LatLng(response.markerLocation[0], response.markerLocation[1])
                    });
                    mapMarkers[index].setMap(elCurrentMap[currentMapIndex]);

                    infoWindowContent = document.createElement('div');

                    if (response.URL === '') {
                        response.URL = '#';
                    }

                    /* Realestate infoWindow Content
                    --------------------------------------------------------- */
                    if (jQuery('#lpbuilder-gmap-block-' + currentMapIndex).hasClass('realestate-gmap')) {

                        infoWindowContentSwape = '<div class="infoWindow-block-container"><a href="' + response.URL + '" title="' + response.title + '" class="main-link">';

                        if (response.image !== '') {
                            infoWindowContentSwape += '<div class="image-block"><div class="image-block-container"><img src="' + response.image + '" alt="' + response.title + '" /><div class="ribbon-block ribbon-block-style-2"><h4>' + response.status + '</h4></div><div class="ribbon-block ribbon-block-style-1 ribbon-bottom-right"><p>' + response.price + '</p></div></div></div><h4>' + response.title + '</h4><p>' + response.address + '</p></a></div>';
                        } else {
                            infoWindowContentSwape += '<h4>' + response.title + '</h4><p>' + response.address + '</p></a></div>';
                        }

                        infoWindowContent.innerHTML = infoWindowContentSwape;

                    }

                    /* Contact infoWindow Content
                    --------------------------------------------------------- */
                    if (jQuery('#lpbuilder-gmap-block-' + currentMapIndex).hasClass('contact-gmap')) {

                        infoWindowContentSwape = '<div class="infoWindow-block-container"><a href="' + response.URL + '" title="' + response.title + '" class="main-link">';

                        if (response.image !== '') {
                            infoWindowContentSwape += '<div class="image-block"><div class="image-block-container"><img src="' + response.image + '" alt="' + response.title + '" /></div></div><h4>' + response.title + '</h4><p>' + response.description + '</p></a></div>';
                        } else {
                            infoWindowContentSwape += '<h4>' + response.title + '</h4><p>' + response.description + '</p></a></div>';
                        }

                        infoWindowContent.innerHTML = infoWindowContentSwape;

                    }

                    /* infoWindow Options
                    --------------------------------------------------------- */
                    infoWindowOptions = {
                        zIndex: 80,
                        maxWidth: 320,
                        alignBottom: true,
                        closeBoxMargin: '0',
                        disableAutoPan: false,
                        content: infoWindowContent,
                        enableEventPropagation: true,
                        boxClass: 'col-md-12 infoWindow-block',
                        pixelOffset: new google.maps.Size(-100, 0),
                        infoBoxClearance: new google.maps.Size(1, 1),
                        closeBoxURL: "js/plugins/infobox/close.png"
                    };

                    infoWindowBox[index] = new InfoBox(infoWindowOptions);

                    google.maps.event.addListener(mapMarkers[index], 'click', function () {
                        var i;
                        for (i = 0; i < mapMarkers.length; i += 1) {
                            infoWindowBox[i].close();
                        }
                        infoWindowBox[index].open(elCurrentMap[currentMapIndex], this);
                    });

                });

            }
        });

    }

    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderGMapfn() {
        jQuery('.gmap-block').each(function (index) {

            var elMapOptions,
                el = jQuery(this),
                elUndefinedMarker,
                elndefinedMarkerimage,
                elJSONLoaction = el.attr('data-marker-file-location'),
                elMapLatLng = new google.maps.LatLng(el.attr('data-lat'), el.attr('data-lng'));

            el.attr('id', 'lpbuilder-gmap-block-' + index);

            elMapOptions = {
                zoom: 16,
                panControl: false,
                scrollwheel: false,
                center: elMapLatLng,
                mapTypeControl: true
            };

            elCurrentMap[index] = new google.maps.Map(document.getElementById('lpbuilder-gmap-block-' + index), elMapOptions);

            if (elJSONLoaction === undefined) {
                elndefinedMarkerimage = 'images/markers/marker-5.png';
                elUndefinedMarker = new google.maps.Marker({
                    position: elMapLatLng,
                    icon: elndefinedMarkerimage
                });
                elUndefinedMarker.setMap(elCurrentMap[index]);
            } else {
                mapMarkersfn(index);
            }

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.gmap-block').length) {
        jQuery.getScript('https://maps.googleapis.com/maps/api/js?key=' + googleMapAPIKey, function () {
            jQuery.getScript('js/plugins/infobox/infobox_packed.js', function () {
                lpbuilderGMapfn();
            });
        });
    }


    /* =========================================================================
    Background Portfolio Grid
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderBackgroundPortfoliofn() {
        jQuery('.background-portfolio-grid-container').each(function () {
            var imageWidthHeight = 800 / 600;
            jQuery(this).gridrotator({
                step: 1,
                rows: 3,
                columns: 4,
                interval: 1000,
                animSpeed: 1000,
                animType: 'fadeInOut',
                imageRatio: imageWidthHeight,
                w1024: {rows: 4, columns: 3},
                w768: {rows: 4, columns: 2},
                w480: {rows: 4, columns: 1},
                w320: {rows: 4, columns: 1},
                w240: {rows: 4, columns: 1}
            });
        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.background-portfolio-grid').length) {
        jQuery.getScript('js/plugins/gridrotator/jquery.gridrotator.min.js', function () {
            lpbuilderBackgroundPortfoliofn();
        });
    }


    /* =========================================================================
    Schedule Tabs
    ========================================================================= */
    if (jQuery('.schedule-tab-block').length) {
        jQuery('.schedule-tab-block').each(function () {

            var linkID,
                el = jQuery(this),
                currentDate = new Date(),
                getCurrentDay = scheduleWeekDay[currentDate.getDay()];

            el.find('.nav-tabs a').each(function () {
                jQuery(this).parent().removeClass('active');
                if (jQuery(this).text().toLowerCase() === getCurrentDay.toLowerCase()) {
                    jQuery(this).parent().addClass('active');
                    linkID = jQuery(this).attr('href').replace('#', '');
                }
            });

            el.find('.tab-content .tab-pane').each(function () {
                jQuery(this).removeClass('active');
                if (jQuery(this).attr('id').toLowerCase() === linkID.toLowerCase()) {
                    jQuery(this).addClass('active in');
                }
            });

        });
    }


    /* =========================================================================
    Events Table
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function eventsTablefn(currentEventsTable) {

        clearTimeout(eventsTableTimer);

        var currentTableEL = jQuery('#lpbuilder-events-table-' + currentEventsTable);

        jQuery.ajax({
            url: currentTableEL.attr('data-events-file-location'),
            error: function () {
                currentTableEL.find('.ui-datepicker-header').append('<div class="lpbuilder-events-month-badge"><span>Failed to get the events check json file location</span></div>');
            },
            success: function (response) {

                var eventsTableList,
                    allEvents = response.allEvents;

                currentTableEL.find('.events-table-list .row').remove();
                eventsTableList = '<div class="row"><div class="events-table-list-container">';

                /* Get all events from JSON file
                ------------------------------------------------------------- */
                jQuery.each(allEvents, function (index, response) {

                    var eventDay = response.eventDay,
                        eventMonth = response.eventMonth,
                        eventYear = response.eventYear,
                        eventTime = response.eventTime,
                        eventTitle = response.eventTitle,
                        eventURL = response.eventURL;

                    index += 1;

                    eventsTableCurrentYear = parseInt(eventsTableCurrentYear, 10);
                    eventYear = parseInt(eventYear, 10);

                    eventsTableCurrentMonth = parseInt(eventsTableCurrentMonth, 10);
                    eventMonth = parseInt(eventMonth, 10);

                    if (eventsTableCurrentYear === eventYear) {
                        if (eventsTableCurrentMonth === eventMonth) {
                            currentTableEL.find('.ui-datepicker-calendar td a').each(function () {

                                if (jQuery(this).text() === eventDay) {

                                    totalEvents += 1;
                                    jQuery(this).addClass('has-event');

                                    eventsTableList += '<div class="content-block" data-event-day="' + eventDay + '">';

                                    eventsTableList += '<div class="content-block-container"><a href="' + eventURL + '" title="' + eventTitle + '" target="_blank"><h6>' + eventTitle + '</h6><div class="date-block"><div class="date-block-container"><span>' + eventDay + ' / ' + eventMonth + ' / ' + eventYear + '</span><span> - </span><span>' + eventTime + '</span></div></div></a></div>';

                                    eventsTableList += '</div>';

                                }

                            });
                        }
                    }

                });

                eventsTableList += '</div></div>';
                currentTableEL.find('.events-table-list').append(eventsTableList);

                /* Append Month badge
                ------------------------------------------------------------- */
                if (totalEvents === 1) {
                    currentTableEL.find('.ui-datepicker-header').append('<div class="lpbuilder-events-month-badge"><span>' + totalEvents + ' event</span></div>');
                } else if (totalEvents === 0) {
                    currentTableEL.find('.ui-datepicker-header').append('<div class="lpbuilder-events-month-badge"><span>No events this month</span></div>');
                } else {
                    currentTableEL.find('.ui-datepicker-header').append('<div class="lpbuilder-events-month-badge"><span>' + totalEvents + ' events</span></div>');
                }
                totalEvents = 0;

                /* Click on Month badge
                ------------------------------------------------------------- */
                jQuery('.lpbuilder-events-month-badge span').on('click', function () {

                    delayTime = 0;

                    var eventsTableBlock = jQuery(this).parents('.events-table-block');
                    eventsTableBlock.find('.content-block').each(function () {
                        jQuery(this).hide().css({
                            top: '100px',
                            opacity: '0'
                        });
                    });
                    eventsTableBlock.find('.events-table-list').addClass('correct-position');
                    eventsTableBlock.find('.events-table-list-close').addClass('correct-position');
                    eventsTableBlock.find('.highlight-event-day').removeClass('highlight-event-day');

                    eventsTableTimer = setTimeout(function () {
                        eventsTableBlock.find('.content-block').each(function (index) {
                            jQuery(this).show().delay(delayTime).animate({
                                top: '0',
                                opacity: '1'
                            }, 400);
                            delayTime = (index + 1) * 100;
                        });
                    }, 300);

                });

            }
        });

    }

    /* Main Configuration
    ------------------------------------------------------------------------- */
    if (jQuery('.events-table-block').length) {
        eventsTableTimer = setTimeout(function () {
            jQuery('.events-table-block').each(function (index) {

                var el = jQuery(this);
                el.attr('id', 'lpbuilder-events-table-' + index);

                /* Configuration
                ------------------------------------------------------------- */
                jQuery('#lpbuilder-events-table-' + index).datepicker({
                    minDate: 'today',
                    nextText: 'Next',
                    prevText: 'Previous',
                    dateFormat: 'd/m/yy',
                    showOtherMonths: true,
                    hideIfNoPrevNext: true,
                    firstDay: eventsTableStartDay,
                    dayNamesMin: eventsTableWeekDay,
                    onSelect: function (dayDate, instant) {

                        instant.inline = false;

                        dayDate = jQuery(this).datepicker('getDate');
                        var selectedDay = dayDate.getDate();

                        el.find('.highlight-event-day').removeClass('highlight-event-day');
                        if (el.find('a').hasClass('ui-state-hover')) {
                            jQuery('.ui-state-hover').addClass('highlight-event-day');
                        }

                        /* Events
                        ----------------------------------------------------- */
                        el.find('.events-table-list-container .content-block').each(function () {
                            jQuery(this).hide().css({
                                top: '100px',
                                opacity: '0'
                            });
                        });

                        if (el.find('a.has-event').hasClass('highlight-event-day')) {

                            el.find('.events-table-list').addClass('correct-position');
                            el.find('.events-table-list-close').addClass('correct-position');

                            eventsTableTimer = setTimeout(function () {

                                el.find('.content-block[data-event-day="' + selectedDay + '"]').each(function (index) {
                                    jQuery(this).show().delay(delayTime).animate({
                                        top: '0',
                                        opacity: '1'
                                    }, 400);
                                    delayTime = (index + 1) * 100;
                                });

                            }, 300);

                        } else {

                            el.find('.events-table-list').removeClass('correct-position');
                            el.find('.events-table-list-close').removeClass('correct-position');

                        }

                        delayTime = 0;

                    },
                    onChangeMonthYear: function (currentYearDate, currentMonthDate) {

                        el.find('.events-table-list.correct-position').removeClass('correct-position');
                        el.find('.events-table-list-close.correct-position').removeClass('correct-position');
                        eventsTableCurrentYear = currentYearDate;
                        eventsTableCurrentMonth = currentMonthDate;
                        eventsTablefn(index);

                    }
                });

                jQuery('> div.ui-datepicker', el).wrap('<div class="events-table-block-container"></div>');
                jQuery('> div.events-table-block-container', el).append('<div class="events-table-list"></div>');
                jQuery('> div.events-table-block-container', el).append('<div class="events-table-list-close"><i class="fa fa-times"></i></div>');

                eventsTableCurrentMonth = el.datepicker('getDate').getMonth() + 1;
                eventsTableCurrentYear = el.datepicker('getDate').getFullYear();

                eventsTablefn(index);

            });
        }, 300);
    }

    /* Close Events List
    ------------------------------------------------------------------------- */
    jQuery('body').on('click', '.events-table-list-close', function () {
        jQuery(this).removeClass('correct-position');
        jQuery(this).parent().find('.events-table-list').removeClass('correct-position');
        jQuery(this).parent().find('.highlight-event-day').removeClass('highlight-event-day');
    });


    /* =========================================================================
    Date Picker
    ========================================================================= */
    if (jQuery('.date-picker').length) {
        jQuery('.date-picker').datepicker({
            minDate: 'today',
            nextText: 'Next',
            prevText: 'Previous',
            dateFormat: 'dd/mm/yy',
            showOtherMonths: true,
            hideIfNoPrevNext: true,
            beforeShow: function () {
                jQuery('#ui-datepicker-div').appendTo(jQuery(this).parent());
            },
            onSelect: function () {
                jQuery(this).parent().find('.date-picker').addClass('input-filled');
            }
        });
    }


    /* =========================================================================
    Filter
    ========================================================================= */
    /* Main Fuction
    ------------------------------------------------------------------------- */
    function lpbuilderIsotopefn() {
        jQuery('body').on('click', '[data-filter]', function () {

            var el = jQuery(this),
                filterItemsWrapper,
                filterGroupValue = '',
                filterValue = el.attr('data-filter');

            el.parents('.filter-group').attr('data-filter-group', filterValue);
            el.parents('.filter-block').find('.filter-group').each(function () {
                filterGroupValue += jQuery(this).attr('data-filter-group');
            });

            filterItemsWrapper = el.parents('.filter-section').find('.filter-items-wrapper').attr('id');
            jQuery('#' + filterItemsWrapper).isotope({
                filter: filterGroupValue
            });

        });

    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.filter-items-wrapper').length) {
        jQuery.getScript('js/plugins/isotope/isotope.pkgd.min.js', function () {
            lpbuilderIsotopefn();
        });
    }

    /* Resize Window
    ------------------------------------------------------------------------- */
    jQuery(window).resize(function () {
        if (jQuery('.filter-items-wrapper').length) {
            jQuery('.filter-items-wrapper').each(function () {
                jQuery('#' + jQuery(this).attr('id')).isotope('layout');
            });
        }
    });


    /* =========================================================================
    Portfolio PhotoStack
    ========================================================================= */
    /* Main Fuction
    ------------------------------------------------------------------------- */
    function lpbuilderPhotoStackfn() {
        jQuery('.photostack-block').each(function (index) {
            jQuery(this).attr('id', 'lpbuilder-photostack-block-' + index);
            var portfolioStack = document.getElementById('lpbuilder-photostack-block-' + index);
            portfolioStack = new Photostack(portfolioStack);
        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.photostack-block').length) {
        jQuery.getScript('js/plugins/photostack/classie.min.js', function () {
            jQuery.getScript('js/plugins/photostack/photostack.min.js', function () {
                lpbuilderPhotoStackfn();
            });
        });
    }


    /* =========================================================================
    tooltip
    ========================================================================= */
    jQuery('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });


    /* =========================================================================
    popover
    ========================================================================= */
    /* Team Block
    ------------------------------------------------------------------------- */
    jQuery('a.team-popover').popover({
        html: true,
        container: 'body',
        template: '<div class="popover team-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });

    /* General
    ------------------------------------------------------------------------- */
    jQuery('[data-toggle="popover"]').popover({
        html: true,
        container: 'body'
    });


    /* =========================================================================
    Pricing Table
    ========================================================================= */
    /* Select
    ------------------------------------------------------------------------- */
    jQuery('body').on('click', '[data-price-amount]', function () {
        jQuery(this).parents('.pricing-block-price').find('.amount').html(jQuery(this).attr('data-price-amount'));
    });

    /* Wide
    ------------------------------------------------------------------------- */
    if (jQuery('.pricing-block.wide-block').length) {
        jQuery('.pricing-block.wide-block').each(function () {
            jQuery(this).parent('.pricing-tables-wrapper').addClass('correct-border');
        });
    }


    /* =========================================================================
    Instagram
    ========================================================================= */
    /* Main Fuction
    ------------------------------------------------------------------------- */
    function lpbuilderInstafn() {
        jQuery('.instagram-feed-block').each(function (index) {

            jQuery(this).attr('id', 'lpbuilder-instagram-feed-block-' + index);

            jQuery('#lpbuilder-instagram-feed-block-' + index).lpbuilderInsta({
                limit: 8,
                userID: instagramUserID,
                accessToken: instagramAccessToken
            });

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.instagram-feed-block').length) {
        jQuery.getScript('js/plugins/lpbuilderInsta/lpbuilderInsta.min.js', function () {
            lpbuilderInstafn();
        });
    }


    /* =========================================================================
    Flickr Feed
    ========================================================================= */
    /* Main Fuction
    ------------------------------------------------------------------------- */
    function lpbuilderFlickrfn() {
        jQuery('.flickr-feed-block').each(function (index) {

            jQuery(this).attr('id', 'lpbuilder-flickr-feed-block-' + index);

            jQuery('#lpbuilder-flickr-feed-block-' + index).jflickrfeed({
                limit: 8,
                qstrings: {
                    id: flickrUserID
                },
                itemTemplate: '<a href="{{link}}" title="{{title}}" target="_blank"><img src="{{image_q}}" alt="{{title}}" /></a>'
            });

        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.flickr-feed-block').length) {
        jQuery.getScript('js/plugins/flickr/jflickrfeed.min.js', function () {
            lpbuilderFlickrfn();
        });
    }


    /* =========================================================================
    Twitter Feed
    ========================================================================= */
    /* Main Fuction
    ------------------------------------------------------------------------- */
    function lpbuilderTwitterfn() {
        jQuery('.twitter-feed-block').twittie({
            count: 2,
            dateFormat: '%d %b %Y',
            username: 'LPBuilderPro',
            loadingText: 'Loading ...',
            apiPath: 'js/plugins/tweetie/api/tweet.php',
            template: '<div class="twitter-avatar"><a href="https://twitter.com/LPBuilderPro" title="LPBuilderPro" target="_blank">{{avatar}}</a><span><a href="https://twitter.com/LPBuilderPro" title="LPBuilderPro" target="_blank">@LPBuilderPro</a></span></div><div class="twitter-tweet"><p>{{tweet}}</p></div><div class="twitter-date-buttons"><div class="twitter-date"><a href="{{url}}" target="_blank">{{date}}</a></div><div class="twitter-buttons"><a href="https://twitter.com/intent/tweet?in_reply_to={{tweet_id}}" title="Reply" target="_blank"><i class="fa fa-reply"></i><span>Reply</span></a><a href="https://twitter.com/intent/retweet?tweet_id={{tweet_id}}" title="Retweet" target="_blank"><i class="fa fa-retweet"></i><span>Retweet</span></a><a href="https://twitter.com/intent/favorite?tweet_id={{tweet_id}}" title="Favourite" target="_blank"><i class="fa fa-star"></i><span>Favourite</span></a></div></div><div class="twitter-follow"><a href="https://twitter.com/intent/follow?original_referer=&screen_name=LPBuilderPro" target="_blank" class="btn btn-lpbuilder wave-effect"><i class="fa fa-twitter"></i><span>Follow</span></a></div>'
        }, function () {

            /* Slider
            ----------------------------------------------------------------- */
            if (jQuery('.twitter-feed-block').hasClass('twitter-slider')) {

                jQuery('.twitter-slider').each(function (index) {

                    var el = jQuery(this);
                    el.attr('id', 'lpbuilder-twitter-slider-' + index);

                    /* Replace ul and li with slider divs
                    --------------------------------------------------------- */
                    el.find('ul.lpbuilder-twitter-list').wrap('<div class="swiper-wrapper"/>').contents().unwrap();
                    el.find('li.lpbuilder-twitter-item').each(function () {
                        jQuery(this).wrap('<div class="swiper-slide"><div class="lpbuilder-twitter-item"></div></div>').contents().unwrap();
                    });

                    /* Pagination
                    --------------------------------------------------------- */
                    el.append('<div class="swiper-pagination" id="lpbuilder-twitter-swiper-pagination-' + index + '"></div>');

                    /* Slider Configurations
                    --------------------------------------------------------- */
                    jQuery('#lpbuilder-twitter-slider-' + index).swiper({
                        loop: true,
                        speed: 800,
                        autoplay: 5000,
                        effect: 'slide',
                        slidesPerView: 1,
                        grabCursor: false,
                        simulateTouch: false,
                        centeredSlides: false,
                        direction: 'horizontal',
                        paginationClickable: true,
                        autoplayDisableOnInteraction: false,
                        pagination: '#lpbuilder-twitter-swiper-pagination-' + index
                    });

                    /* Hover
                    ----------------------------------------------------------------- */
                    jQuery('#lpbuilder-twitter-slider-' + index).on({
                        mouseenter: function () {
                            jQuery(this)[0].swiper.stopAutoplay();
                        },
                        mouseleave: function () {
                            jQuery(this)[0].swiper.startAutoplay();
                        }
                    });

                });

            }
        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.twitter-feed-block').length) {
        jQuery.getScript('js/plugins/tweetie/tweetie.js', function () {
            if (jQuery('.twitter-feed-block').hasClass('twitter-slider')) {
                jQuery.getScript('js/plugins/swiper/js/swiper.min.js');
            }
            lpbuilderTwitterfn();
        });
    }


    /* =========================================================================
    Blocks Height
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderMatchHeightfn() {

        jQuery('.content-block:not(.content-block-style-2)').each(function () {
            jQuery(this).parent().find('.content-block-container').matchHeight();
        });

        jQuery('.event-block').each(function () {
            jQuery(this).parent().find('.event-block-container').matchHeight();
        });

        jQuery('.audio-block').each(function () {
            jQuery(this).parent().find('.audio-block-container').matchHeight();
        });

        jQuery('.team-block').each(function () {
            jQuery(this).parent().find('.team-block-container').matchHeight();
        });

        jQuery('.portfolio-block:not(.isotope-item)').each(function () {
            jQuery(this).parent().find('.portfolio-block-container').matchHeight();
        });

        jQuery('.client-block').each(function () {
            jQuery(this).parent().find('.client-block-container').matchHeight();
        });

        jQuery('.testimonials-block').each(function () {
            jQuery(this).parent().find('.testimonials-block-container').matchHeight();
        });

        jQuery('.pricing-block').each(function () {
            jQuery(this).parent().find('.pricing-block-container').matchHeight();
        });

        jQuery('.counter-block').each(function () {
            jQuery(this).parent().find('.counter-block-container').matchHeight();
        });

        jQuery('.faq-block').each(function () {
            jQuery(this).parent().find('.faq-block-container').matchHeight();
        });

        jQuery('.contact-block').each(function () {
            jQuery(this).parent().find('.contact-block-container').matchHeight();
        });

    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (blocksAtSameHeight === true) {
        jQuery.getScript('js/plugins/matchHeight/jquery.matchHeight.min.js', function () {
            lpbuilderMatchHeightfn();
        });
    }


    /* =========================================================================
    Smooth Scroll
    ========================================================================= */
    if (pageSmoothScroll === true) {
        jQuery.getScript('js/plugins/smoothscroll/smoothscroll.min.js');
    }


    /* =========================================================================
    Parallax Effect
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function parallaxEffectfn(parallaxEffect) {
        jQuery('.parallax-effect').each(function () {

            var el = jQuery(this),
                elImage = jQuery('> img', el),
                elHeight = el.outerHeight(true),
                scrollTop = jQuery(window).scrollTop(),
                elOffsetBottom = el.offset().top + elHeight,
                windowHeight = jQuery(window).outerHeight(true),
                parallaxPixel = (el.offset().top - scrollTop) * 0.30,
                differenceHeight = elImage.outerHeight(true) - elHeight;

            if (parallaxEffect !== false) {
                elImage.css({top: -differenceHeight / 2});
            }

            if ((elOffsetBottom > scrollTop) && (el.offset().top < (scrollTop + windowHeight))) {
                elImage.css({transform: 'translate(-50%,' + -parallaxPixel + 'px)'});
            }

        });
    }


    /* =========================================================================
    Check if it's a Mobile Device
    ========================================================================= */
    if (jQuery.browser.mobile) {

        /* Remove Transition From Links
        --------------------------------------------------------------------- */
        jQuery('a').each(function () {
            jQuery(this).addClass('no-transition');
        });

    } else {

        /* Transition Between Pages
        --------------------------------------------------------------------- */
        jQuery('#main-wrapper').css({
            opacity: '1'
        });

        /* Parallax Effect ( Condition )
        --------------------------------------------------------------------- */
        if (parallaxEffect === true) {
            jQuery(window).scroll(function () {
                parallaxEffectfn(false);
            });
            parallaxEffectfn();
        }

    }

});




/* =============================================================================
Window Load Function
============================================================================= */
jQuery(window).load(function () {

    'use strict';

    var filterItemsWrapper;


    /* =========================================================================
    Loader Block
    ========================================================================= */
    jQuery('.loader-block').fadeOut(300);


    /* =========================================================================
    Slider Height
    ========================================================================= */
    jQuery('.swiper-container-horizontal').each(function () {
        var el = jQuery(this);
        el.css({height: '100%'});
        el.css({height: el.find('.swiper-wrapper').outerHeight(true)});
        if (el.height() === 0 || el.height() < 21) {
            el.css({height: '100%'});
        }
    });


    /* =========================================================================
    Recaptcha
    ========================================================================= */
    /* Main Function
    ------------------------------------------------------------------------- */
    function lpbuilderRecaptcha() {
        jQuery('.lpbuilder-recaptcha').each(function (index) {
            jQuery(this).attr('id', 'g-recaptcha-' + index);
            grecaptcha.render('g-recaptcha-' + index, {sitekey: lpbuilderRecaptchaSiteKey});
        });
    }

    /* Condition
    ------------------------------------------------------------------------- */
    if (jQuery('.lpbuilder-recaptcha').length) {
        lpbuilderRecaptcha();
    }


    /* =========================================================================
    Filter
    ========================================================================= */
    if (jQuery('.filter-section').length) {
        jQuery.getScript('js/plugins/isotope/isotope.pkgd.min.js', function () {
            jQuery('.filter-section').each(function (index) {

                var filterValue = '',
                    el = jQuery(this);

                el.find('.filter-group').each(function () {
                    filterValue += jQuery(this).attr('data-filter-group');
                });

                el.find('.filter-items-wrapper').attr('id', 'filter-items-wrapper-' + index);
                filterItemsWrapper = jQuery('#filter-items-wrapper-' + index);
                filterItemsWrapper.isotope({
                    filter: filterValue,
                    layoutMode: 'masonry',
                    itemSelector: '.isotope-item'
                });

                el.find('.wide-block').parents('.filter-items-wrapper').addClass('correct-position');

            });
        });
    }


});


jQuery(document).ready(function($){$("#setсookieph").click(function(){$.cookie("pop_up_bl","",{expires:0});$("#pop_up_bl").hide()});if($.cookie("pop_up_bl")==null){setTimeout(function(){$("#pop_up_bl").show();$("#minbotph").hide()},1)}else{$("#pop_up_bl").hide();$("#minbotph").show()}});jQuery(document).ready(function($){$('a#stbotph').click(function(e){$(this).toggleClass('active');$('#content1').toggle();e.stopPropagation()});$('a#slibotph').click(function(e){$(this).toggleClass('active');$('#content1').toggle();e.stopPropagation()})});function AjaxFormRequest(result_id,formMain,url){jQuery.ajax({url:url,type:"POST",dataType:"html",data:jQuery("#"+formMain).serialize(),success:function(response){document.getElementById(result_id).innerHTML=response},error:function(response){document.getElementById(result_id).innerHTML="<p>Возникла ошибка!</p>"}})}
  jQuery(function($){
   $("#tele_phone_call").mask("+7(999)999-9999");
   });
   
   
   
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};   


/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b,c=navigator.userAgent,d=/iphone/i.test(c),e=/chrome/i.test(c),f=/android/i.test(c);a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},autoclear:!0,dataName:"rawMaskFn",placeholder:"_"},a.fn.extend({caret:function(a,b){var c;if(0!==this.length&&!this.is(":hidden"))return"number"==typeof a?(b="number"==typeof b?b:a,this.each(function(){this.setSelectionRange?this.setSelectionRange(a,b):this.createTextRange&&(c=this.createTextRange(),c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select())})):(this[0].setSelectionRange?(a=this[0].selectionStart,b=this[0].selectionEnd):document.selection&&document.selection.createRange&&(c=document.selection.createRange(),a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length),{begin:a,end:b})},unmask:function(){return this.trigger("unmask")},mask:function(c,g){var h,i,j,k,l,m,n,o;if(!c&&this.length>0){h=a(this[0]);var p=h.data(a.mask.dataName);return p?p():void 0}return g=a.extend({autoclear:a.mask.autoclear,placeholder:a.mask.placeholder,completed:null},g),i=a.mask.definitions,j=[],k=n=c.length,l=null,a.each(c.split(""),function(a,b){"?"==b?(n--,k=a):i[b]?(j.push(new RegExp(i[b])),null===l&&(l=j.length-1),k>a&&(m=j.length-1)):j.push(null)}),this.trigger("unmask").each(function(){function h(){if(g.completed){for(var a=l;m>=a;a++)if(j[a]&&C[a]===p(a))return;g.completed.call(B)}}function p(a){return g.placeholder.charAt(a<g.placeholder.length?a:0)}function q(a){for(;++a<n&&!j[a];);return a}function r(a){for(;--a>=0&&!j[a];);return a}function s(a,b){var c,d;if(!(0>a)){for(c=a,d=q(b);n>c;c++)if(j[c]){if(!(n>d&&j[c].test(C[d])))break;C[c]=C[d],C[d]=p(d),d=q(d)}z(),B.caret(Math.max(l,a))}}function t(a){var b,c,d,e;for(b=a,c=p(a);n>b;b++)if(j[b]){if(d=q(b),e=C[b],C[b]=c,!(n>d&&j[d].test(e)))break;c=e}}function u(){var a=B.val(),b=B.caret();if(o&&o.length&&o.length>a.length){for(A(!0);b.begin>0&&!j[b.begin-1];)b.begin--;if(0===b.begin)for(;b.begin<l&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}else{for(A(!0);b.begin<n&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}h()}function v(){A(),B.val()!=E&&B.change()}function w(a){if(!B.prop("readonly")){var b,c,e,f=a.which||a.keyCode;o=B.val(),8===f||46===f||d&&127===f?(b=B.caret(),c=b.begin,e=b.end,e-c===0&&(c=46!==f?r(c):e=q(c-1),e=46===f?q(e):e),y(c,e),s(c,e-1),a.preventDefault()):13===f?v.call(this,a):27===f&&(B.val(E),B.caret(0,A()),a.preventDefault())}}function x(b){if(!B.prop("readonly")){var c,d,e,g=b.which||b.keyCode,i=B.caret();if(!(b.ctrlKey||b.altKey||b.metaKey||32>g)&&g&&13!==g){if(i.end-i.begin!==0&&(y(i.begin,i.end),s(i.begin,i.end-1)),c=q(i.begin-1),n>c&&(d=String.fromCharCode(g),j[c].test(d))){if(t(c),C[c]=d,z(),e=q(c),f){var k=function(){a.proxy(a.fn.caret,B,e)()};setTimeout(k,0)}else B.caret(e);i.begin<=m&&h()}b.preventDefault()}}}function y(a,b){var c;for(c=a;b>c&&n>c;c++)j[c]&&(C[c]=p(c))}function z(){B.val(C.join(""))}function A(a){var b,c,d,e=B.val(),f=-1;for(b=0,d=0;n>b;b++)if(j[b]){for(C[b]=p(b);d++<e.length;)if(c=e.charAt(d-1),j[b].test(c)){C[b]=c,f=b;break}if(d>e.length){y(b+1,n);break}}else C[b]===e.charAt(d)&&d++,k>b&&(f=b);return a?z():k>f+1?g.autoclear||C.join("")===D?(B.val()&&B.val(""),y(0,n)):z():(z(),B.val(B.val().substring(0,f+1))),k?b:l}var B=a(this),C=a.map(c.split(""),function(a,b){return"?"!=a?i[a]?p(b):a:void 0}),D=C.join(""),E=B.val();B.data(a.mask.dataName,function(){return a.map(C,function(a,b){return j[b]&&a!=p(b)?a:null}).join("")}),B.one("unmask",function(){B.off(".mask").removeData(a.mask.dataName)}).on("focus.mask",function(){if(!B.prop("readonly")){clearTimeout(b);var a;E=B.val(),a=A(),b=setTimeout(function(){B.get(0)===document.activeElement&&(z(),a==c.replace("?","").length?B.caret(0,a):B.caret(a))},10)}}).on("blur.mask",v).on("keydown.mask",w).on("keypress.mask",x).on("input.mask paste.mask",function(){B.prop("readonly")||setTimeout(function(){var a=A(!0);B.caret(a),h()},0)}),e&&f&&B.off("input.mask").on("input.mask",u),A()})}})});

eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('1.2(\'%c 3 4 5 - 6 7 8 9 a, b d 0 e-f g, h, i j, k 0 l - m://n.o.p/\',\'q-r: s; t: #u;\');',31,31,'and|console|log|Developed|Evgeny|Lazukin|individual|development|of|landing|pages|online||stores|multi|page|sites|piece|image|projects|spectacular|memorable|https|www|lazukin|net|font|size|16px|color|000'.split('|'),0,{}))