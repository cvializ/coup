define([
  'Vent',
  'views/action/Action',
  'models/action/PrimaryAction'
], function (vent, ActionView, PrimaryActionModel) {
  var PrimaryAction = ActionView.extend({
    actionModel: PrimaryActionModel,

    events: {
      'click #primary-move' : function move() {
        vent.trigger('play:move:primary', { name: 'Move', type: 'primary', target: null });
      }
    }
  });

  return PrimaryAction;
});