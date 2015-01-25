var example = require("washington")
var assert  = require("assert")

var Negator = require("../object-pattern").Negator
var Matchable = require("../object-pattern").Matchable



example("Negator is a Matchable", function () {
  assert(new Negator instanceof Matchable)
})



example("Negator: delegates and negates", function () {
  var matchable = new Matchable
  var theObject = {}
  matchable.match = function (object) {
    this.match.calledWith = object
    return false }

  assert(
    new Negator(matchable)
      .match(theObject) )

  assert.equal(
    matchable.match.calledWith, theObject)
})
