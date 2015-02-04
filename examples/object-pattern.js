var example = require("washington")
var assert  = require("assert")

var ObjectPattern = require("../object-pattern").ObjectPattern
var Matchable = require("../object-pattern").Matchable
var exactProperty = require("../object-pattern").exactProperty
var wildcardProperty = require("../object-pattern").wildcardProperty



example("ObjectPattern is a Matchable", function () {
  assert(new ObjectPattern instanceof Matchable)
})



example("ObjectPattern: AND of three properties", function () {
  var property = new ObjectPattern(
    exactProperty("public", true),
    wildcardProperty("value"),
    exactProperty("timestamp", 123456789)
  )

  assert(property.match({
    "public": true,
    "anyProp": "value",
    "timestamp": 123456789
  }))
})



example("ObjectPattern: AND of three properties (false)", function () {
  var property = new ObjectPattern(
    exactProperty("public", true),
    wildcardProperty("value"),
    exactProperty("timestamp", 123456789)
  )

  assert( ! property.match({
    "public": false,
    "anyProp": "value",
    "timestamp": 123456789
  }))
})
