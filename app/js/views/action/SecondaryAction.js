define(
['views/action/Action', 'models/action/SecondaryAction', 'socket'],
function (ActionView, SecondaryActionModel, socket) {
  var SecondaryAction = ActionView.extend({
    actionModel: SecondaryActionModel,

    events: {
      'click #secondary-allow': function allow() {
        console.log('allow');
      },
      'click #secondary-block': function block() {
        console.log('block');
      },
      'click #secondary-doubt': function doubt() {
        console.log('doubt');
      }
    }
  });

  return SecondaryAction;
});