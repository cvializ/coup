define(['backbone'], function (Backbone) {
  var SecondaryActionModel = Backbone.Model.extend({
    defaults: {
      title: 'Challenge',
      text: 'Someone has attempted to make a move!',
      choices: [
        { title: 'Allow', id: 'secondary-allow' },
        { title: 'Block', id: 'secondary-block' },
        { title: 'Doubt Influence', id: 'secondary-doubt' }
      ]
    }
  });

  return SecondaryActionModel;
});