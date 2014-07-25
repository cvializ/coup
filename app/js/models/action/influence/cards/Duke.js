define([
  'models/action/influence/Influence'
], function (InfluenceModel) {
  var DukeModel = InfluenceModel.extend({
    defaults: {
      name: 'Duke',
      abilities: [
        { name: 'Treasury', verb: 'Tax the Treasury' }
      ]
    }
  });

  return DukeModel;
});
