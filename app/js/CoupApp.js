define(['marionette', 'views/Play'], function (Marionette, PlayView) {
  CoupApp = new Marionette.Application();

  CoupApp.addRegions({
    main: '#coup-main'
  });

  CoupApp.addInitializer(function (options) {
    options.controller.trigger('init');
  });

  return CoupApp;
});