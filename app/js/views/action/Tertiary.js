define([
  'Vent',
  'views/action/Action',
  'models/action/Tertiary',
  'constants/client'
], function (vent, ActionView, TertiaryActionModel, clientConstants) {
  var TertiaryAction = ActionView.extend({
    actionModel: TertiaryActionModel,

    events: {
      'click #tertiary-allow': function allow() {
        vent.trigger(clientConstants.PLAY_MOVE_TERTIARY, { type: 'concede' });
      },
      'click #tertiary-doubt': function doubt() {
        vent.trigger(clientConstants.PLAY_MOVE_TERTIARY, { type: 'doubt' });
      }
    }
  });

  return TertiaryAction;
});
