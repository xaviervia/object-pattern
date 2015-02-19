var example = require("washington")

var WildcardValue = require("../object-pattern").WildcardValue
var Matchable = require("../object-pattern").Matchable



example("WildcardValue is a Matchable", function () {
  return new WildcardValue instanceof Matchable
})



example("WildcardValue: true if not undefined", function () {
  return new WildcardValue().match("anything")
})



example("WildcardValue: false if undefined", function () {
  return ! new WildcardValue().match()
})
