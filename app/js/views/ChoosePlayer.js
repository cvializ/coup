define([
  'marionette',
  'Vent',
  'views/PlayerChoice',
  'hbs!templates/choosePlayer'
], function (Marionette, vent, PlayerChoiceView, choosePlayerTemplate) {
  var ChoosePlayerView = Marionette.CompositeView.extend({
    className: 'c-choose-player-view c-group',
    template: choosePlayerTemplate,
    childView: PlayerChoiceView,
    childViewContainer: '.c-player-choices',
    onRenderCollection: function collectionRendered() {
      // The render:collection event is triggered before
      // the newly rendered element in this.elBuffer is
      // attached to the DOM. So we need to manipulate this.elBuffer
      // GROSS
      this.elBuffer.querySelector('input[type="radio"]').setAttribute('checked', 'checked');
    },
    ui: {
      select: 'input[type="button"]'
    },
    events: {
      'click @ui.select': function clickSelect() {
        vent.trigger('play:move:primary:choice', {
          choice: $('input[type="radio"]:checked', this.$el).val()
        });
      }
    }
  });

  return ChoosePlayerView;
});
