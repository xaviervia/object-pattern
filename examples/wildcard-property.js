var example = require("washington")
var assert  = require("assert")

var Matchable = require("../object-pattern").Matchable
var WildcardProperty = require("../object-pattern").WildcardProperty



example("WildcardProperty + string value #match: correct value, true", function () {
  assert(
    new WildcardProperty("value")
    .match({"something": "value"}) )
})



example("WildcardProperty + string value #match: incorrect value, false", function () {
  assert(
    ! new WildcardProperty("value")
    .match({"something": "not-value"}) )
})



example("WildcardProperty + number value #match: correct value, true", function () {
  assert(
    new WildcardProperty(4)
    .match({"otherThing": 4}) )
})



example("WildcardProperty + Matchable value #match: delegate, send values to Matchable (propagate false)", function () {
  var matchable = new Matchable()
  var toMatch   = {"something": "value", "other": "other-value"}
  matchable.match = function (match) {
    (this.match.called = this.match.called || {})[match] = true
    return false }

    assert(
      ! new WildcardProperty(matchable)
      .match(toMatch) )

      assert(matchable.match.called["value"])
      assert(matchable.match.called["other-value"])
})



example("WildcardProperty + Matchable value #match: delegate, send values to Matchable (propagate true)", function () {
  var matchable = new Matchable()
  var toMatch   = {"something": "value", "other": "other-value"}
  matchable.match = function (match) {
    (this.match.called = this.match.called || {})[match] = true
    return match === "value" }

    assert(
      new WildcardProperty(matchable)
      .match(toMatch) )
})
