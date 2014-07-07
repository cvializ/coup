define(
['views/Action', 'models/TertiaryAction', 'socket'],
function (ActionView, TertiaryActionModel, socket) {
  var TertiaryAction = ActionView.extend({
    actionModel: TertiaryActionModel,

    events: {
      'click #tertiary-allow': function allow() {
        console.log('allow');
      },
      'click #tertiary-doubt': function doubt() {
        console.log('doubt');
      }
    }
  });

  return TertiaryAction;
});