define([
  'Vent',
  'views/action/Action',
  'models/action/PrimaryAction'
], function (vent, ActionView, PrimaryActionModel) {
  var PrimaryAction = ActionView.extend({
    actionModel: PrimaryActionModel,

    events: {
      'click #primary-income' : function income() {
        vent.trigger('play:move:primary', { name: 'Take Income', influence: 'default' });
      },
      'click #primary-aid' : function aid() {
        vent.trigger('play:move:primary', { name: 'Foreign Aid', influence: 'default' });
      },
      'click #primary-coup' : function coup() {
        vent.trigger('play:move:primary', { name: 'Coup', influence: 'default' });
      }
    }
  });

  return PrimaryAction;
});
