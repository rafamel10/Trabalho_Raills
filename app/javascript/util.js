// panel.js
var Panel = {
  nav_list: function() {
    var thisElement = jQuery(this);
    var aElements = thisElement.find('a');
    var result = [];

    aElements.each(function() {
      var currentElement = jQuery(this);
      var indent = Math.max(0, currentElement.parents('li').length - 1);
      var href = currentElement.attr('href');
      var target = currentElement.attr('target');

      result.push('<a class="link depth-' + indent + '"' +
        (target ? ' target="' + target + '"' : '') +
        (href ? ' href="' + href + '"' : '') +
        '><span class="indent-' + indent + '"></span>' +
        currentElement.text() +
        '</a>');
    });

    return result.join('');
  },

  panel: function(userConfig) {
    if (!this.length || this.length > 1) return this;

    var thisElement = jQuery(this);
    var body = jQuery('body');
    var window = jQuery(window);
    var id = thisElement.attr('id');
    var config = jQuery.extend({
      delay: 0,
      hideOnClick: false,
      hideOnEscape: false,
      hideOnSwipe: false,
      resetScroll: false,
      resetForms: false,
      side: null,
      target: thisElement,
      visibleClass: 'visible'
    }, userConfig);

    if (config.target instanceof jQuery) {
      config.target = config.target;
    }

    if (thisElement.css('-ms-overflow-style', '-ms-autohiding-scrollbar')) {
      thisElement.css('-webkit-overflow-scrolling', 'touch');
    }

    if (config.hideOnClick) {
      thisElement.find('a').css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

      thisElement.on('click', 'a', function(event) {
        var a = jQuery(this);
        var href = a.attr('href');
        var target = a.attr('target');

        if (!href || href === '#' || href === '' || href === '#' + id) return;

        event.preventDefault();
        event.stopPropagation();

        _hide();

        window.setTimeout(function() {
          if (target === '_blank') {
            window.open(href);
          } else {
            window.location.href = href;
          }
        }, 10);
      });
    }

    thisElement.on('touchstart', function(event) {
      var touch = event.originalEvent.touches[0];
      thisElement.touchPosX = touch.pageX;
      thisElement.touchPosY = touch.pageY;
    });

    thisElement.on('touchmove', function(event) {
      if (thisElement.touchPosX === null || thisElement.touchPosY === null) return;

      var diffX = thisElement.touchPosX - event.originalEvent.touches[0].pageX;
      var diffY = thisElement.touchPosY - event.originalEvent.touches[0].pageY;
      var th = thisElement.outerHeight();
      var ts = (thisElement.get(0).scrollHeight - thisElement.scrollTop());

      if (config.hideOnSwipe) {
        var result = false;
        var boundary = 20;
        var delta = 50;

        switch (config.side) {
          case 'left':
            result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
            break;
          case 'right':
            result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
            break;
          case 'top':
            result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
            break;
          case 'bottom':
            result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
            break;
        }

        if (result) {
          thisElement.touchPosX = null;
          thisElement.touchPosY = null;
          _hide();
          return false;
        }
      }

      if ((thisElement.scrollTop() < 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    thisElement.on('click touchend touchstart touchmove', function(event) {
      event.stopPropagation();
    });

    thisElement.on('click', 'a[href="#' + id + '"]', function(event) {
      event.preventDefault();
      event.stopPropagation();
      config.target.removeClass(config.visibleClass);
    });

    body.on('click touchend', function(event) {
      _hide(event);
    });

    body.on('click', 'a[href="#' + id + '"]', function(event) {
      event.preventDefault();
      event.stopPropagation();
      config.target.toggleClass(config.visibleClass);
    });

    if (config.hideOnEscape) {
      window.on('keydown', function(event) {
        if (event.keyCode === 27) {
          _hide(event);
        }
      });
    }

    return thisElement;

    function _hide(event) {
      if (config.target.hasClass(config.visibleClass)) {
        config.target.removeClass(config.visibleClass);

        if (config.resetScroll) {
          config.target.animate({ scrollTop: 0 }, 0);
        }

        if (config.resetForms) {
          config.target.find('form').each(function() {
            this.reset();
          });
        }

        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  },

  placeholder: function() {
    if (!document.createElement('input').placeholder) return this;
    if (!this.length || this.length > 1) return this;

    var thisElement = jQuery(this);

    thisElement.find('input[type=text],textarea').each(function() {
      var element = jQuery(this);

      if (!element.val() || element.val() === element.attr('placeholder')) {
        element.addClass('polyfill-placeholder').val(element.attr('placeholder'));
      }

      element.on('blur', function() {
        if (element.attr('name').match(/-polyfill-field$/)) return;

        if (!element.val()) {
          element.addClass('polyfill-placeholder').val(element.attr('placeholder'));
        }
      });

      element.on('focus', function() {
        if (element.attr('name').match(/-polyfill-field$/)) return;

        if (element.val() === element.attr('placeholder')) {
          element.removeClass('polyfill-placeholder').val('');
        }
      });
    });

    return thisElement;
  }
};
