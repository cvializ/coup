define([
  'Vent',
  'views/action/Action',
  'models/action/Ready'
], function (vent, ActionView, ReadyActionModel) {
  var ReadyAction = ActionView.extend({
    actionModel: ReadyActionModel,

    events: {
      'click #ready-start-play': function ready() {
        vent.trigger('play:start:ready');
      }
    }
  });

  return ReadyAction;
});
