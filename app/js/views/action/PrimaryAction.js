define([
  'views/action/Action',
  'models/action/PrimaryAction'
], function (ActionView, PrimaryActionModel, socket) {
  var PrimaryAction = ActionView.extend({
    actionModel: PrimaryActionModel,

    events: {
      'click #primary-move' : function move() {
        console.log('Move!');
      }
    }
  });

  return PrimaryAction;
});