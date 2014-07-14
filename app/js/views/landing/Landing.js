define(['marionette', 'hbs!templates/landing/landing'], function (Marionette, landingTemplate) {
  var LandingView = Marionette.LayoutView.extend({
    className: 'c-landing-view',
    template: landingTemplate,
    regions: {
      login: '#c-login-area',
      create: '#c-create-game-area'
    }
  });

  return LandingView;
});
