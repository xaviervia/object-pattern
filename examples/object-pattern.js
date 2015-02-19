var example = require("washington")

var ObjectPattern = require("../object-pattern").ObjectPattern
var Matchable = require("../object-pattern").Matchable
var ExactProperty = require("../object-pattern").ExactProperty
var WildcardProperty = require("../object-pattern").WildcardProperty



example("ObjectPattern is a Matchable", function () {
  return new ObjectPattern instanceof Matchable
})



example("ObjectPattern: AND of three properties", function () {
  var property = new ObjectPattern(
    new ExactProperty("public", true),
    new WildcardProperty("value"),
    new ExactProperty("timestamp", 123456789)
  )

  return property.match({
    "public": true,
    "anyProp": "value",
    "timestamp": 123456789
  })
})



example("ObjectPattern: AND of three properties (false)", function () {
  var property = new ObjectPattern(
    new ExactProperty("public", true),
    new WildcardProperty("value"),
    new ExactProperty("timestamp", 123456789)
  )

  return ! property.match({
    "public": false,
    "anyProp": "value",
    "timestamp": 123456789
  })
})
