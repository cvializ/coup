define([
  'Vent',
  'views/action/Action',
  'models/action/Tertiary'
], function (vent, ActionView, TertiaryActionModel) {
  var TertiaryAction = ActionView.extend({
    actionModel: TertiaryActionModel,

    events: {
      'click #tertiary-allow': function allow() {
        vent.trigger('play:move:tertiary', { type: 'concede' });
      },
      'click #tertiary-doubt': function doubt() {
        vent.trigger('play:move:tertiary', { type: 'doubt' });
      }
    }
  });

  return TertiaryAction;
});
