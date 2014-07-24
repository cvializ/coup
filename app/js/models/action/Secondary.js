define(['models/action/Action'], function (ActionModel) {
  var SecondaryActionModel = ActionModel.extend({
    defaults: {
      title: 'Challenge',
      text: 'Someone has attempted to make a move!',
      choices: [
        { title: 'Allow', id: 'secondary-allow' },
        { title: 'Block', id: 'secondary-block', condition: 'blockable' },
        { title: 'Doubt Influence', id: 'secondary-doubt', condition: 'doubtable' }
      ]
    }
  });

  return SecondaryActionModel;
});
