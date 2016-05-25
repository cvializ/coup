'use strict';

const Ability = require('../models/Ability'),
      influenceData = require('../app/js/models/action/influence/cards/'),
      Influences = clone(influenceData);

for (let key in Influences) {
  eachInfluence(Influences[key], key, Influences);
}

// Decorate the JSON data with the server actions.
function eachInfluence(influence, i, arr) {
  const actions = require('../models/cards/' + influence.name),
        abilities = {},
        abilityData = influence.abilities;

  for (let key in abilityData) {
    let abilityDatum = abilityData[key];

    let options = {
      influence: influence.name,
      action: actions[abilityDatum.name]
    };
    options = Object.assign(options, abilityDatum);

    abilities[abilityDatum.name] = new Ability(options);
  }

  influence.abilities = abilities;
}

function clone() {
  return JSON.parse(JSON.stringify.apply(this, arguments));
}

module.exports = Influences;
