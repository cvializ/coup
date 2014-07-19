define(['marionette'], function (Marionette) {
  CoupApp = new Marionette.Application();

  CoupApp.addRegions({
    main: '#coup-main'
  });

  CoupApp.addInitializer(function (options) {
    var landingController = new CoupController();
    var playController = new PlayController();

    CoupApp.vent.trigger('landing:init');
  });

  return CoupApp;
});
