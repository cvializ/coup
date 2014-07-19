define(['marionette', 'MainRegion', 'Vent', 'controllers/CoupController', 'controllers/PlayController'],
function (Marionette, mainRegion, vent, CoupController, PlayController) {
  CoupApp = new Marionette.Application();

  CoupApp.main = mainRegion;

  CoupApp.addInitializer(function initialize(options) {
    options = options || {};
    options.socket = options.socket || null;

    var landingController = new CoupController({ socket: options.socket });
    var playController = new PlayController({ socket: options.socket });

    vent.trigger('landing:init');
  });

  return CoupApp;
});
