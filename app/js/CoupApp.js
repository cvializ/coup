define(['marionette'], function (Marionette, PlayView) {
  CoupApp = new Marionette.Application();

  CoupApp.addRegions({
    main: '#coup-main'
  });

  CoupApp.addInitializer(function (options) {
    options.LandingController.trigger('landing:init');
    this.LandingController = options.LandingController;
  });

  return CoupApp;
});
