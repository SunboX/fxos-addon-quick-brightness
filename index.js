(function () {

  // If injecting into an app that was already running at the time
  // the app was enabled, simply initialize it.
  if (document.documentElement) {
    initialize();
  }

  // Otherwise, we need to wait for the DOM to be ready before
  // starting initialization since add-ons are usually (always?)
  // injected *before* `document.documentElement` is defined.
  else {
    window.addEventListener('DOMContentLoaded', initialize);
  }

  function initialize() {

    // Just a small shortcut to repeat myself less
    var $$ = document.getElementById.bind(document);

    // Remove existing control, for when this addon is re-run.
    var existingContainerEl = $$('quick-brightness-container');
    if (existingContainerEl) {
      existingContainerEl.parentNode.removeChild(existingContainerEl);
    }

    // Build the brightness control elements.
    var containerEl = document.createElement('div');
    containerEl.setAttribute('id', 'quick-brightness-container');
    containerEl.setAttribute('data-time-inserted', Date.now());

    // Inline styles are icky, but I think injected addon CSS is broken right now.
    // see: https://developer.mozilla.org/en-US/Firefox_OS/Add-ons#Stylesheets
    containerEl.setAttribute('style', [
      'height: 3.5rem;',
      'margin: 1.5rem 0 0 0;'
    ].join('\n'));

    // Markup stolen and munged from gaia settings
    containerEl.innerHTML = [
      '<label class="range-icons brightness">',
      '  <span data-icon="moon" aria-hidden="true" style="margin: 0; position: absolute; left: 1.5rem"></span>',
      '  <input id="quick-brightness-control"',
      '         style="height: 2.5rem; position: absolute; ',
      '                background: transparent; border: none; margin: 0 auto;',
      '                left: 6.25rem; width: calc(100% - 12.5rem)"',
      '         step="0.01" min="0.1" value="0.5" max="1" type="range">',
      '  <span data-icon="brightness" aria-hidden="true" style="margin: 0; position: absolute; right: 1.5rem"></span>',
      '</label>'
    ].join('\n');

    // Inject the elements into the system app
    var trayEl = $$('utility-tray-footer');
    var quickSettings = $$('quick-settings');
    trayEl.insertBefore(containerEl, quickSettings);

    // Borrow some code from Gaia shared/js/settings_listener.js
    var _lock;
    function sl_getSettingsLock() {
      if (_lock && !_lock.closed) { return _lock; }
      var settings = window.navigator.mozSettings;
      return (_lock = settings.createLock());
    }

    // Wire up an event listener to set brightness on slider change.
    var sliderEl = $$('quick-brightness-control');
    sliderEl.addEventListener('change', function (ev) {
      sl_getSettingsLock().set({
        'screen.brightness': sliderEl.value
      });
    });

  }
  
}());