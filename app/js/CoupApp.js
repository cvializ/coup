define(['marionette'], function (Marionette) {
  CoupApp = new Marionette.Application();

  CoupApp.addRegions({
    main: '#coup-main'
  });

  CoupApp.addInitializer(function (options) {
    CoupApp.vent.trigger('landing:init');
  });

  return CoupApp;
});
