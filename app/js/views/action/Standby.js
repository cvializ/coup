define([
  'views/action/Action',
  'models/action/Action'
], function (ActionView, ActionModel) {
  var StandbyActionView = ActionView.extend({
    initialize: function (options) {
      options = options || {};
      options.title = options.title || 'Waiting...';
      options.text = options.text || 'Two players are duking it out!';

      this.model = options.model || new ActionModel(options);
    }
  });

  return StandbyActionView;
});
