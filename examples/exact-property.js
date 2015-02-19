var example = require("washington")

var ExactProperty = require("../object-pattern").ExactProperty
var Matchable = require("../object-pattern").Matchable



example("ExactProperty is a Matchable", function () {
  return new ExactProperty instanceof Matchable
})



example("ExactProperty + non-Matchable #match: true if both OK", function () {
  return new ExactProperty("name", "value").match({"name": "value"})
})



example("ExactProperty + non-Matchable #match: false if exists but value is wrong", function () {
  return ! new ExactProperty("name", "other-value").match({"name": "value"})
})



example("ExactProperty #match: false if property is not there", function () {
  return ! new ExactProperty("other-name", "value").match({"name": "value"})
})



example("ExactProperty + Matchable #match: delegates to matchable", function () {
  var matchable = new Matchable()
  matchable.match = function (value) {
    this.match.calledWith = value
    return true }

  return  new ExactProperty("property", matchable)
            .match({"property": "value"}) &&
          matchable.match.calledWith == "value"
})
