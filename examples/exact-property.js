var example = require("washington")
var assert  = require("assert")

var ExactProperty = require("../object-pattern").ExactProperty
var Matchable = require("../object-pattern").Matchable



example("ExactProperty is a Matchable", function () {
  assert(new ExactProperty instanceof Matchable)
})



example("ExactProperty + non-Matchable #match: true if both OK", function () {
  assert(
    new ExactProperty("name", "value")
      .match({"name": "value"}) )
})



example("ExactProperty + non-Matchable #match: false if exists but value is wrong", function () {
  assert(
    ! new ExactProperty("name", "other-value")
      .match({"name": "value"}) )
})



example("ExactProperty #match: false if property is not there", function () {
  assert(
    ! new ExactProperty("other-name", "value")
      .match({"name": "value"}) )
})



example("ExactProperty + Matchable #match: delegates to matchable", function () {
  var matchable = new Matchable()
  matchable.match = function (value) {
    this.match.calledWith = value
    return true }

  assert(new ExactProperty("property", matchable).match({"property": "value"}))
  assert.equal(matchable.match.calledWith, "value")
})
