define(['marionette'], function (Marionette) {
  var MainRegion = Marionette.Region.extend({
    el: '#coup-main'
  });

  var mainRegion = new MainRegion();

  return mainRegion;
});

