define([
  'marionette',
  'MainRegion',
  'Vent',
  'controllers/Landing',
  'controllers/Play'
], function (Marionette, mainRegion, vent, LandingController, PlayController) {
  var CoupApp = new Marionette.Application(),
      landingController,
      playController;

  CoupApp.main = mainRegion;

  CoupApp.addInitializer(function initialize(options) {
    options = options || {};
    options.socket = options.socket || null;

    landingController = new LandingController({ socket: options.socket });
    playController = new PlayController({ socket: options.socket });

    vent.trigger('landing:init');
  });

  return CoupApp;
});
