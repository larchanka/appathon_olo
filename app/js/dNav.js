(function (window, $) {
    var dNav = dNav || {},
        curEl,
        _bindKeyboardEvents;

    dNav.options = {
        elSelector: '.clickable:visible',
        hoverClass: 'is-hovered',
        containerSelector: 'body',
        keyActions: {}
    };


    var prevKeyDown = null;

    _bindKeyboardEvents = function (keyActions) {
        var onKeyDown = function (e) {
            switch (e.keyCode) {
                case CONTROL_KEYS['left']:
                    dNav.moveSelection([-1, 0]);
                    break;
                case CONTROL_KEYS['up']:
                    dNav.moveSelection([0, -1]);
                    break;
                case CONTROL_KEYS['right']:
                    dNav.moveSelection([1, 0]);
                    break;
                case CONTROL_KEYS['down']:
                    dNav.moveSelection([0, 1]);
                    break;
                case CONTROL_KEYS['ok']:
                    dNav.click(curEl);
                    break;
                case CONTROL_KEYS['menu']:
                  document.location = '../index.html';
                  break;
            }

            $.each(keyActions, function (i, keyAction) {
                if (e.keyCode == keyAction['keyCode'] && typeof keyAction['action'] == 'function') {
                    keyAction['action'](e);
                }
            });

            e.preventDefault();
            return false;
        };

        $(dNav.options.containerSelector).off('click').off('keydown', prevKeyDown);

        prevKeyDown = onKeyDown;

        $(dNav.options.containerSelector).on('click', dNav.options.elSelector, function () {
            eval($(this).data('action'));
        });

        $(dNav.options.containerSelector).on('keydown', onKeyDown);
    };

    _getElCoords = function (el) {
        if (!el) return false;

        var position = $(el).position(),
            w = $(el).width(),
            h = $(el).height();

        return [Math.round(position.left + w/2), Math.round(position.top + h/2)];
    };

    dNav.click = function (el) {
        el = $('.' + dNav.options.hoverClass)[0]; // TBR
        eval($(el).attr('data-action'));
        return false;
    };

    dNav.findDistance = function (coords1, coords2) {
        return Math.sqrt(
            Math.pow(coords2[0] - coords1[0], 2) + Math.pow(coords2[1] - coords1[1], 2)
        );
    };

    dNav.isIntersected = function ($el1, $el2, coordIndex) {
        var position1 = $($el1).offset(),
            w1 = $($el1).width(),
            h1 = $($el1).height(),
            position2 = $($el2).offset(),
            w2 = $($el2).width(),
            h2 = $($el2).height();


        position1.right = position1.left + w1;
        position1.bottom = position1.top + h1;
        position2.right = position2.left + w2;
        position2.bottom = position2.top + h2;



        if (
                (position2.left >= position1.left
                && position2.left <= position1.right
                && coordIndex == 1)
            ||
                (position2.right >= position1.left
                && position2.right <= position1.right
                && coordIndex == 1)
            ) {


            return true;
        }


        if (
                (position1.left >= position2.left
                && position1.left <= position2.right
                && coordIndex == 1)
            ||
                (position1.right >= position2.left
                && position1.right <= position2.right
                && coordIndex == 1)
            ) {


            return true;
        }

        if  (
                (position1.top >= position2.top
                && position1.top <= position2.bottom
                && coordIndex == 0)
            ||
                (position1.bottom >= position2.top
                && position1.bottom <= position2.bottom
                && coordIndex == 0)
            ) {


            return true;
        }

        return false;
    };

    dNav.findIntersected = function ($rel, coords, vector) {
        var $els = $(dNav.options.elSelector),
            $closest,
            elCoords,
            coordIndex = (vector[0] === 0) ? 1 : 0,
            closestDistance = Infinity,
            potentialEls = [];


        $els.each(function () {
            if (!$(this).hasClass(dNav.options.hoverClass)) {
                elCoords = _getElCoords($(this));
                // if the element goes in the right direction by axes
                if (elCoords[coordIndex] * vector[coordIndex] > coords[coordIndex] * vector[coordIndex]) {
                    potentialEls.push($(this));
                }
            }
        });

        $.each(potentialEls, function (i, $el) {
            if (dNav.isIntersected($rel, $el, coordIndex)) {
                if (closestDistance > dNav.findDistance(_getElCoords($el), coords)) {
                    $closest = $(this);
                    closestDistance = dNav.findDistance(_getElCoords($el), coords);
                }
            }
        });

        return $closest;
    };

    dNav.findClosest = function ($el, coords, vector) {
        var $els = $(dNav.options.elSelector),
            $closest,
            elCoords,
            coordIndex = (vector[0] === 0) ? 1 : 0,
            closestCoords = (vector[coordIndex] > 0) ? [Infinity, Infinity] : [0, 0],
            closestDistance = Infinity,
            potentialEls = [];

        $els.each(function () {

            if ( !$(this).hasClass(dNav.options.hoverClass) && !dNav.isIntersected($el, $(this), !coordIndex * 1) ) {
                elCoords = _getElCoords($(this));


                // if the element goes in the right direction by axes
                if (elCoords[coordIndex] * vector[coordIndex] > coords[coordIndex] * vector[coordIndex]) {
                    potentialEls.push($(this));

                    /* TODO: should be removed in case of no bugs in navigation
                     * old method that finds closest by one axis
                    if (closestCoords[coordIndex] * vector[coordIndex] >= elCoords[coordIndex] * vector[coordIndex]) {
                        $closest = $(this);
                        closestCoords = _getElCoords($closest);
                    }
                    */

                    if (closestDistance > dNav.findDistance(elCoords, coords)) {
                        $closest = $(this);
                        closestDistance = dNav.findDistance(elCoords, coords);
                    }

                }
            }
        });



        return $closest;
    };

    dNav.moveSelection = function (vector) {
        // TODO: find out wtf is going on there, that curEl disappears
        curEl = $('.' + dNav.options.hoverClass)[0]; // TBR

        var coords = _getElCoords(curEl),
            closestEl = dNav.findIntersected(curEl, coords, vector)// || dNav.findClosest(curEl, coords, vector);



        if (closestEl) {
           curEl = dNav.hover(closestEl);
        }
    };

    dNav.hover = function (el) {
        if (!el instanceof $) el = $(el);

        if (curEl) $(curEl).removeClass(dNav.options.hoverClass);


        $(el).addClass(dNav.options.hoverClass);

        if (parseInt($(el).attr('data-eventTypeID')) == INV_EVENTTYPEIDS.hover) {

            dNav.click(el);
        }

        return el;
    };

    dNav.init = function (options) {
        $(dNav.options.elSelector).removeClass('is-hovered');
        dNav.options = options ? options : dNav.options;

        _bindKeyboardEvents(dNav.options.keyActions);

        $(dNav.options.elSelector).each(function () {
            if (parseInt($(this).attr('data-eventTypeID')) !== INV_EVENTTYPEIDS.hover) {
                curEl = dNav.hover($(this));
                return false;
            }
        });

    };


    window.dNav = dNav;

    return dNav;
}(window, $));
