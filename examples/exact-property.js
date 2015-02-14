var example = require("washington")
var assert  = require("assert")

var exactProperty = require("../object-pattern").exactProperty
var Matchable = require("../object-pattern").Matchable



example("exactProperty match has type Matchable", function () {
  assert(exactProperty().tags.indexOf(Matchable) > -1 )
})



example("exactProperty + non-Matchable #match: true if both OK", function () {
  assert( exactProperty("name", "value").match({"name": "value"}) )
})



example("exactProperty + non-Matchable #match: false if exists but value is wrong", function () {
  assert( ! exactProperty("name", "other-value").match({"name": "value"}) )
})



example("exactProperty #match: false if property is not there", function () {
  assert( ! exactProperty("other-name", "value").match({"name": "value"}) )
})



example("exactProperty + Matchable #match: delegates to matchable", function () {
  var matchable = {
    match: function (value) {
      this.match.calledWith = value
      return true
    },
    tags: [Matchable]
  }

  assert(exactProperty("property", matchable).match({"property": "value"}))
  assert.equal(matchable.match.calledWith, "value")
})
