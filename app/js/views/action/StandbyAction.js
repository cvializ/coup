define(['views/action/Action', 'models/action/Action'], function (ActionView, ActionModel) {
  var StandbyActionView = ActionView.extend({
    initialize: function (options) {
      options = options || {};
      
      this.model = options.model || new ActionModel({
        title: 'Waiting...',
        text: 'Two players are duking it out!'
      });
    }
  });

  return StandbyActionView;
});