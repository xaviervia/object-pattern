var example = require("washington")
var assert  = require("assert")

var objectPattern = require("../object-pattern").objectPattern
var Matchable = require("../object-pattern").Matchable
var exactProperty = require("../object-pattern").exactProperty
var wildcardProperty = require("../object-pattern").wildcardProperty



example("objectPattern's match has type Matchable", function () {
  assert(objectPattern().tags.indexOf(Matchable) > -1)
})



example("objectPattern: AND of three properties", function () {
  var property = objectPattern(
    exactProperty("public", true),
    wildcardProperty("value"),
    exactProperty("timestamp", "123456789")
  )

  assert(property.match({
    "public": true,
    "anyProp": "value",
    "timestamp": "123456789"
  }))
})



example("objectPattern: AND of three properties (false)", function () {
  var property = objectPattern(
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
