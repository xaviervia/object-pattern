var example = require("washington")
var assert  = require("assert")

var WildcardValue = require("../object-pattern").WildcardValue
var Matchable = require("../object-pattern").Matchable



example("WildcardValue is a Matchable", function () {
  assert(new WildcardValue instanceof Matchable)
})



example("WildcardValue: true if not undefined", function () {
  assert(
    new WildcardValue().match("anything") )
})



example("WildcardValue: false if undefined", function () {
  assert(
    ! new WildcardValue().match())
})
