var example = require("washington")

var Negator = require("../object-pattern").Negator
var Matchable = require("../object-pattern").Matchable



example("Negator is a Matchable", function () {
  return new Negator instanceof Matchable
})



example("Negator: delegates and negates", function () {
  var matchable = new Matchable
  var theObject = {}
  matchable.match = function (object) {
    this.match.calledWith = object
    return false }

  return  new Negator(matchable).match(theObject) &&
          matchable.match.calledWith === theObject
})
