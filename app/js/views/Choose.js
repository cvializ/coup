define([
  'marionette',
  'Vent',
  'hbs!templates/choose'
], function (Marionette, vent, chooseTemplate) {
  var ChooseView = Marionette.CompositeView.extend({
    className: 'c-choose-view c-group',
    template: chooseTemplate,
    childViewContainer: '.c-choices',
    onRenderCollection: function collectionRendered() {
      // The render:collection event is triggered before
      // the newly rendered element in this.elBuffer is
      // attached to the DOM. So we need to manipulate this.elBuffer
      // GROSS
      this.elBuffer.querySelector('input[type="radio"]').setAttribute('checked', 'checked');
    },
    ui: {
      select: 'input[type="button"]'
    },
    getChoice: function () {
      return $('input[type="radio"]:checked', this.$el).val();
    },
    selectEvent: null,
    choiceKey: 'choice',
    events: {
      'click @ui.select': function clickSelect() {
        var data = {};
        for (var key in this.ui) {
          if (key !== 'select') {
            data[key] = this.ui[key].val();
          }
        }
        data[this.choiceKey] = this.getChoice();

        vent.trigger(this.selectEvent, data);
      }
    }
  });

  return ChooseView;
});
