define(['backbone'], function (Backbone) {
  var ResultModel = Backbone.Model.extend({
    defaults: {
      title: 'Unnamed Result',
      message: 'This is a result message'
    }
  });

  return ResultModel;
});