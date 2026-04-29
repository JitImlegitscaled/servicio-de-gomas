/**
 * Vercel Web Analytics initialization
 * 
 * This script initializes Vercel Web Analytics using the inject method.
 * The inject function is inlined from @vercel/analytics to work without a bundler.
 */

// Inline the inject function from @vercel/analytics
(function() {
  'use strict';
  
  // Queue initialization
  var initQueue = function() {
    if (window.va) return;
    window.va = function va() {
      var params = Array.prototype.slice.call(arguments);
      (window.vaq = window.vaq || []).push(params);
    };
  };

  // Environment detection
  function isBrowser() {
    return typeof window !== 'undefined';
  }

  function detectEnvironment() {
    try {
      var env = process && process.env && process.env.NODE_ENV;
      if (env === 'development' || env === 'test') {
        return 'development';
      }
    } catch (e) {
      // process is not defined in browser
    }
    return 'production';
  }

  function setMode(mode) {
    if (mode === 'auto') {
      window.vam = detectEnvironment();
      return;
    }
    window.vam = mode;
  }

  function getMode() {
    return window.vam || 'production';
  }

  function isSelfHosted() {
    return !!window.vadsn;
  }

  function isProduction() {
    return getMode() === 'production';
  }

  function isDevelopment() {
    return getMode() === 'development';
  }

  // Script injection
  function injectScript(props) {
    var mode = props && props.mode || 'auto';
    setMode(mode);
    
    if (!isBrowser() || window.vai) return;
    window.vai = true;
    
    if (isDevelopment()) {
      // In development mode, just log events
      window.va = function(event, data) {
        console.log('[Vercel Analytics]', event, data);
      };
      return;
    }
    
    initQueue();
    
    var scriptSrc = props && props.scriptSrc || '/_vercel/insights/script.js';
    
    var script = document.createElement('script');
    script.src = scriptSrc;
    script.defer = true;
    script.setAttribute('data-sdkn', '@vercel/analytics');
    script.setAttribute('data-sdkv', '2.0.1');
    
    if (props && props.dsn) {
      script.setAttribute('data-dsn', props.dsn);
      window.vadsn = props.dsn;
    }
    
    if (props && props.debug) {
      script.setAttribute('data-debug', 'true');
    }
    
    var target = document.head || document.body;
    if (target) {
      target.appendChild(script);
    }
  }

  // Public inject function
  function inject(props, confString) {
    try {
      if (confString) {
        var conf = JSON.parse(confString);
        props = Object.assign({}, conf, props || {});
      }
    } catch (e) {
      console.error('Failed to parse analytics config:', e);
    }
    
    injectScript(props);
  }

  // Initialize analytics
  inject({
    mode: 'auto',
    debug: false
  });
})();
