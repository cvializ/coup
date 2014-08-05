define(['backbone'], function (Backbone) {
  var ActionModel = Backbone.Model.extend({
    defaults: {
      title: 'Untitled Action',
      text: 'This action doesn\'t do anything!',
      choices: [
        { id: 'ok', title: 'OK', action: function action() { console.log('YOU CHOSE OK.'); }}
      ]
    },

    initialize: function (options) {
      options = options || {};

      var i,
          condition,
          choices,
          ability = options.ability;

      // Make a shallow copy of the array; it and its contents are references to the objects
      // in the actionModel's defaults array GROSS : S
      this.set('choices', this.get('choices').slice());
      choices = this.get('choices');

      if (ability) {
        for (i = 0; i < choices.length; i++) {
          condition = choices[i].condition;

          if ((ability && ability[condition] === false) ||
              (options.conditions && options.conditions[condition] === false)) {
            choices.splice(i, 1);
          }
        }
      }
    }
  });

  return ActionModel;
});
