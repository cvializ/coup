define([
  'Vent',
  'views/action/Action',
  'models/action/influence/Default'
], function (vent, ActionView, DefaultInfluenceModel) {
  var DefaultInfluenceView = ActionView.extend({
    actionModel: DefaultInfluenceModel,

    events: {
      'click #primary-income' : function income() {
        vent.trigger('play:move:primary', { name: 'Take Income', influence: 'default' });
      },
      'click #primary-aid' : function aid() {
        vent.trigger('play:move:primary', { name: 'Foreign Aid', influence: 'default' });
      },
      'click #primary-coup' : function coup() {
        vent.trigger('play:move:primary', { name: 'Coup', influence: 'default' });
      }
    }
  });

  return DefaultInfluenceView;
});
