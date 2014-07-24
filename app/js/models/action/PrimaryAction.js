define(['backbone'], function (Backbone) {
  var PrimaryActionModel = Backbone.Model.extend({
    defaults: {
      title: 'It\'s your turn',
      text: 'Choose your move below!',
      choices: [
        { title: 'Take Income', id: 'primary-income' },
        { title: 'Request Foregin Aid', id: 'primary-aid' },
        { title: 'Coup', id: 'primary-coup' },
      ]
    }
  });

  return PrimaryActionModel;
});
