define([
  'Vent',
  'views/action/Action',
  'models/action/SecondaryAction'
], function (vent, ActionView, SecondaryActionModel) {
  var SecondaryAction = ActionView.extend({
    actionModel: SecondaryActionModel,

    events: {
      'click #secondary-allow': function allow() {
        vent.trigger('play:move:secondary', { type: 'allow' });
      },
      'click #secondary-block': function block() {
        vent.trigger('play:move:secondary', { type: 'block' });
      },
      'click #secondary-doubt': function doubt() {
        vent.trigger('play:move:secondary', { type: 'doubt' });
      }
    }
  });

  return SecondaryAction;
});