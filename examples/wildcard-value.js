var example = require("washington")
var assert  = require("assert")

var wildcardValue = require("../object-pattern").wildcardValue
var Matchable = require("../object-pattern").Matchable



example("wildcardValue's match has type Matchable", function () {
  assert(wildcardValue().tags.indexOf(Matchable) > -1)
})



example("wildcardValue: true if not undefined", function () {
  assert( wildcardValue().match("anything") )
})



example("wildcardValue: false if undefined", function () {
  assert( ! wildcardValue().match())
})
