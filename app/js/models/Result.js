define(['backbone'], function () {
  var ResultModel = Backbone.Model.extend({
    defaults: {
      title: 'Unnamed Result',
      message: 'This is a result message'
    }
  });

  return ResultModel;
});