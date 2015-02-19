var example = require("washington")

var Matchable = require("../object-pattern").Matchable
var WildcardProperty = require("../object-pattern").WildcardProperty



example("WildcardProperty + string value #match: correct value, true", function () {
  return new WildcardProperty("value").match({"something": "value"})
})



example("WildcardProperty + string value #match: incorrect value, false", function () {
  return ! new WildcardProperty("value").match({"something": "not-value"})
})



example("WildcardProperty + number value #match: correct value, true", function () {
  return new WildcardProperty(4).match({"otherThing": 4})
})



example("WildcardProperty + Matchable value #match: delegate, send values to Matchable (propagate false)", function () {
  var matchable = new Matchable()
  var toMatch   = {"something": "value", "other": "other-value"}
  matchable.match = function (match) {
    (this.match.called = this.match.called || {})[match] = true
    return false }

  return  ! new WildcardProperty(matchable).match(toMatch) &&
          matchable.match.called["value"] &&
          matchable.match.called["other-value"]
})



example("WildcardProperty + Matchable value #match: delegate, send values to Matchable (propagate true)", function () {
  var matchable = new Matchable()
  var toMatch   = {"something": "value", "other": "other-value"}
  matchable.match = function (match) {
    (this.match.called = this.match.called || {})[match] = true
    return match === "value" }

  return new WildcardProperty(matchable).match(toMatch)
})
