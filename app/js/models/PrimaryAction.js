define(['backbone'], function (Backbone) {
  var PrimaryActionModel = Backbone.Model.extend({
    defaults: {
      title: 'It\'s your turn',
      text: 'Choose your move below!',
      choices: [
        { title: 'Move', id: 'primary-move' }
      ]
    }
  });

  return PrimaryActionModel;
});