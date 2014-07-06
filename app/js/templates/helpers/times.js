define('templates/helpers/times', ['hbs/handlebars'], function (Handlebars) {
  function times(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i) {
      accum += block.fn(i);
    }
    return accum;
  }

  Handlebars.registerHelper('times', times);

  return times;
});