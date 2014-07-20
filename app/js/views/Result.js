define(['marionette', 'hbs!templates/result'], function (Marionette, resultTemplate) {
  var ResultView = Marionette.ItemView.extend({
    className: 'c-result-view',
    template: resultTemplate
  });

  return ResultView;
});