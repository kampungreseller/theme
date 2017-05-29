

/* globals lp, ga, $ */

(function() {
  var EventTracker, lpScriptVersion;

  lpScriptVersion = '1.4.1';

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');;

  ga('create', 'UA-98190255-1', 'auto');

  if ((window.ub.page.variantId != null) && window.ub.page.usedAs === "main") {
    ga('send', 'pageview', document.location.pathname + window.ub.page.variantId + window.location.search);
  } else {
    ga('send', 'pageview');
  }

  EventTracker = (function() {
    function EventTracker() {
      lp.jQuery(document).ready((function(_this) {
        return function() {
          return _this._addHandlers();
        };
      })(this));
    }

    EventTracker.prototype._addHandlers = function() {
      lp.jQuery('.lp-pom-form .lp-pom-button').unbind('click tap touchstart').bind('click tap touchstart', (function(_this) {
        return function(e) {
          return _this._formHandler(e);
        };
      })(this));
      lp.jQuery('.lp-pom-form form').unbind('keypress').keypress((function(_this) {
        return function(e) {
          if (e.which === 13 && e.target.nodeName.toLowerCase() !== 'textarea') {
            return _this._formHandler(e);
          }
        };
      })(this));
      lp.jQuery('.lp-pom-button').not('.lp-pom-form .lp-pom-button').click((function(_this) {
        return function(e) {
          var $parentElm;
          $parentElm = lp.jQuery(e.currentTarget);
          return _this._linkHandler(e, $parentElm);
        };
      })(this));
      lp.jQuery('.lp-pom-image a').click((function(_this) {
        return function(e) {
          var $parentElm;
          $parentElm = lp.jQuery(e.currentTarget).closest('.lp-pom-image');
          return _this._linkHandler(e, $parentElm);
        };
      })(this));
      return lp.jQuery('.lp-pom-text a').click((function(_this) {
        return function(e) {
          var $parentElm;
          $parentElm = lp.jQuery(e.currentTarget).closest('.lp-pom-text');
          return _this._linkHandler(e, $parentElm);
        };
      })(this));
    };

    EventTracker.prototype._isGaLoaded = function() {
      return !!window.ga && !!ga.create;
    };

    EventTracker.prototype._formHandler = function(event) {
      var $form, $formContainer, params;
      event.preventDefault();
      event.stopPropagation();
      $formContainer = lp.jQuery(event.currentTarget).closest('.lp-pom-form');
      $form = $formContainer.children('form');
      if ($form.valid()) {
        if (!this._isGaLoaded()) {
          return $form.submit();
        }
        params = lp.jQuery.extend({
          category: 'Form',
          action: 'Submit',
          label: "#" + ($formContainer.attr('id'))
        }, $formContainer.data('ubGAParams'));
        this._logEvent(params);
        return ga('send', 'event', params.category, params.action, params.label, {
          hitCallback: function() {
            return $form.submit();
          }
        });
      }
    };

    EventTracker.prototype._linkHandler = function(event, $parentElm) {
      var $element, browser, hasHandler, id, params, parentId, preventingDefault, target, uri;
      if (!this._isGaLoaded()) {
        return;
      }
      $element = lp.jQuery(event.currentTarget);
      uri = $element.attr('href');
      id = $element.attr('id');
      target = $element.attr('target');
      browser = lp.jQuery.browser;
      parentId = $parentElm.attr('id');
      hasHandler = this._hasHandler(id || parentId);
      preventingDefault = !hasHandler && target !== '_blank';
      if (browser.msie === true && browser.version <= 8.0) {
        preventingDefault = false;
      }
      if (preventingDefault) {
        event.preventDefault();
      }
      params = lp.jQuery.extend({}, this._getEventParams(uri, parentId), $parentElm.data('ubGAParams'));
      this._logEvent(params);
      return ga('send', 'event', params.category, params.action, params.label, {
        hitCallback: function() {
          var _ref;
          if (preventingDefault) {
            if (uri.indexOf('#') === 0) {
              return lp.jQuery('html, body').scrollTop((_ref = lp.jQuery(uri).offset()) != null ? _ref.top : void 0);
            } else {
              switch (target) {
                case '_top':
                  return window.top.location.href = uri;
                case '_parent':
                  return window.parent.location.href = uri;
                default:
                  return window.location.href = uri;
              }
            }
          }
        }
      });
    };

    EventTracker.prototype._hasHandler = function(id) {
      var clickHandlers, handler, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      clickHandlers = [].concat(typeof $ === "function" ? (_ref = $('#' + id).data('events')) != null ? _ref.click : void 0 : void 0, typeof $ === "function" ? (_ref1 = $('#' + id + ' a').data('events')) != null ? _ref1.click : void 0 : void 0, (_ref2 = lp.jQuery('#' + id).data('events')) != null ? _ref2.click : void 0, (_ref3 = lp.jQuery('#' + id + ' a').data('events')) != null ? _ref3.click : void 0);
      for (_i = 0, _len = clickHandlers.length; _i < _len; _i++) {
        handler = clickHandlers[_i];
        if ((_ref4 = handler != null ? handler.namespace : void 0) === 'fb' || _ref4 === 'smoothScroll') {
          return true;
        }
      }
      return false;
    };

    EventTracker.prototype._getEventParams = function(uri, id) {
      var host, _ref;
      host = ((_ref = uri.split('/')) != null ? _ref[2] : void 0) || '';
      id = "#" + id;
      if (uri.indexOf('#') === 0) {
        return {
          category: 'In-Page',
          action: uri,
          label: id
        };
      } else if (host.indexOf('facebook') > -1) {
        return {
          category: 'Social',
          action: 'Facebook',
          label: id
        };
      } else if (host.indexOf('twitter') > -1) {
        return {
          category: 'Social',
          action: 'Twitter',
          label: id
        };
      } else if (host.indexOf('linkedin') > -1) {
        return {
          category: 'Social',
          action: 'Linkedin',
          label: id
        };
      } else if (host.indexOf('plus.google.com') > -1) {
        return {
          category: 'Social',
          action: 'Google+',
          label: id
        };
      } else if (uri.indexOf('mailto:') > -1) {
        return {
          category: 'Email',
          action: uri.replace('mailto:', ''),
          label: id
        };
      } else if (uri.indexOf('/tel/') > -1) {
        return {
          category: 'Phone',
          action: uri.split('/tel/')[1],
          label: id
        };
      } else if (uri.indexOf('/rel/') > -1) {
        return {
          category: 'Lightbox',
          action: 'Lightbox',
          label: id
        };
      } else if (/\.(pdf|doc|docx|csv)/.test(uri)) {
        return {
          category: 'Download',
          action: this._cleanUri(uri),
          label: id
        };
      } else {
        return {
          category: 'Outbound',
          action: this._cleanUri(uri),
          label: id
        };
      }
    };

    EventTracker.prototype._cleanUri = function(uri) {
      return uri.replace(/clk[n,g]\//, '').replace('/', '://');
    };

    EventTracker.prototype._logEvent = function(params) {
      return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log("Sending event:\n Category: " + params.category + "\n Action: " + params.action + "\n Label: " + params.label) : void 0 : void 0;
    };

    EventTracker.prototype.trackAll = function() {
      return void 0;
    };


    /*
     * Public API
     * trackOne: allows the user to override Google Analytics event params
     *   (category, action, label) for a given element (using the given selector)
     */

    EventTracker.prototype.trackOne = function(selector, category, action, label) {
      return lp.jQuery(selector).data('ubGAParams', {
        category: category,
        action: action,
        label: label
      });
    };

    return EventTracker;

  })();

  window.eventTracker = new EventTracker();

}).call(this);
