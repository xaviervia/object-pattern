var example = require("washington")
var assert  = require("assert")

var Matchable = require("../object-pattern").Matchable
var wildcardProperty = require("../object-pattern").wildcardProperty



example("wildcardProperty match has type Matchable", function () {
  assert(wildcardProperty().match.type === Matchable)
})



example("wildcardProperty + string value #match: correct value, true", function () {
  assert( wildcardProperty("value").match({"something": "value"}) )
})



example("wildcardProperty + string value #match: incorrect value, false", function () {
  assert( ! wildcardProperty("value").match({"something": "not-value"}) )
})



example("wildcardProperty + number value #match: correct value, true", function () {
  assert( wildcardProperty(4).match({"otherThing": 4}) )
})



example("wildcardProperty + Matchable value #match: delegate, send values to Matchable (propagate false)", function () {
  var matchable = {
    match: Matchable(function (match) {
      (this.match.called = this.match.called || {})[match] = true
      return false
    })
  }
  var toMatch   = {"something": "value", "other": "other-value"}

  assert( ! wildcardProperty(matchable).match(toMatch) )

  assert(matchable.match.called["value"])
  assert(matchable.match.called["other-value"])
})



example("wildcardProperty + Matchable value #match: delegate, send values to Matchable (propagate true)", function () {
  var matchable = {
    match: Matchable(function (match) {
      (this.match.called = this.match.called || {})[match] = true
      return match === "value"
    })
  }
  var toMatch   = {"something": "value", "other": "other-value"}

  assert( wildcardProperty(matchable).match(toMatch) )
})
