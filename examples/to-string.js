var example       = require("washington")
var ArrayEllipsis = require("../object-pattern").ArrayEllipsis
var ArrayPattern  = require("../object-pattern").ArrayPattern
var ObjectPattern = require("../object-pattern").ObjectPattern
var ExactProperty = require("../object-pattern").ExactProperty

example("toString: a:'value'", function (check) {
  check(new ObjectPattern(
      new ExactProperty( "a", "value" )
    ).toString(),
    "a:'value'"
  )
})


example("toString: a:24", function (check) {
  check(new ObjectPattern(
      new ExactProperty( "a", 24 )
    ).toString(),
    "a:24"
  )
})


example("toString: a:true", function (check) {
  check(new ObjectPattern(
      new ExactProperty( "a", true )
    ).toString(),
    "a:true"
  )
})


example("toString: a:false", function (check) {
  check(
    new ObjectPattern(
      new ExactProperty( "a", false )
    ).toString(),
    "a:false"
  )
})


example("toString: /a", function (check) {
  check(
    new ArrayPattern( "a" ).toString(),
    "/a"
  )
})


example("toString: /a/**/i", function (check) {
  check(
    new ArrayPattern( "a", new ArrayEllipsis("i") ).toString(),
    "/a/**/i"
  )
})
