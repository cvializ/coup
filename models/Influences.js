var extend = require('extend'),
    Ability = require('../models/Ability'),
    influenceData = require('../app/js/models/action/influence/cards/'),
    Influences = extend(true, {}, influenceData),
    key;

for (key in Influences) {
  eachInfluence(Influences[key], key, Influences);
}

// Decorate the JSON data with the server actions.
function eachInfluence(influence, i, arr) {
  var actions = require('../models/cards/' + influence.name),
      abilities = {},
      abilityData = influence.abilities,
      abilityDatum,
      options
      key

  for (key in abilityData) {
    abilityDatum = abilityData[key];

    options = {
      influence: influence.name,
      action: actions[abilityDatum.name]
    };
    options = extend(options, abilityDatum);

    abilities[abilityDatum.name] = new Ability(options);
  }

  influence.abilities = abilities;
}

module.exports = Influences;
