define([
  'models/action/influence/Influence'
], function (InfluenceModel) {
  var DefaultModel = InfluenceModel.extend({
    defaults: {
      name: 'Default',
      abilities: [
        { name: 'Income', verb: 'Take Income' },
        { name: 'Foreign Aid', verb: 'take Foreign Aid' },
        { name: 'Coup', verb: 'Coup' }
      ]
    }
  });

  return DefaultModel;
});
