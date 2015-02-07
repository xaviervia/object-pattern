var example = require("washington")
var assert  = require("assert")

var negator = require("../object-pattern").negator
var Matchable = require("../object-pattern").Matchable



example("negator match has type Matchable", function () {
  assert(negator().match.type === Matchable)
})



example("negator: delegates and negates", function () {
  var matchable = new Matchable
  var theObject = {}
  matchable.match = function (object) {
    this.match.calledWith = object
    return false }

  assert( negator(matchable).match(theObject) )

  assert.equal(
    matchable.match.calledWith, theObject)
})
