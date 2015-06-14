var example           = require("washington")

var ArrayEllipsis     = require("../object-pattern").ArrayEllipsis
var ArrayPattern      = require("../object-pattern").ArrayPattern
var ExactProperty     = require("../object-pattern").ExactProperty
var Negator           = require("../object-pattern").Negator
var ObjectPattern     = require("../object-pattern").ObjectPattern
var TypedValue        = require("../object-pattern").TypedValue
var WildcardProperty  = require("../object-pattern").WildcardProperty
var WildcardValue     = require("../object-pattern").WildcardValue



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


example("toString: /'a'", function (check) {
  check(
    new ArrayPattern( "a" ).toString(),
    "/'a'"
  )
})


example("toString: /'a'/**/'i'", function (check) {
  check(
    new ArrayPattern( "a", new ArrayEllipsis("i") ).toString(),
    "/'a'/**/'i'"
  )
})


example("toString: /'a'/**/'i'/(b:-23.3)", function (check) {
  check(
    new ArrayPattern(
      "a",
      new ArrayEllipsis("i"),
      new ObjectPattern(
        new ExactProperty("b", -23.3)
      )
    ).toString(),
    "/'a'/**/'i'/(b:-23.3)"
  )
})


example("toString: /'a'/'**/i/(b:-23.3)'", function (check) {
  check(
    new ArrayPattern(
      "a",
      "**/i/(b:-23.3)"
    ).toString(),
    "/'a'/'**/i/(b:-23.3)'"
  )
})


example("toString: a:(b:(c:'d'))", function (check) {
  check(
    new ObjectPattern(
      new ExactProperty(
        "a", new ObjectPattern(
          new ExactProperty("b",
            new ObjectPattern(
              new ExactProperty("c", "d")
            )
          )
        )
      )
    ).toString(),
    "a:(b:(c:'d'))"
  )
})


example("toString: !y:'z'", function (check) {
  check(
    new ObjectPattern(
      new Negator(
        new ExactProperty("y", "z")
      )
    ).toString(),
    "!y:'z'"
  )
})


example("toString: *:'g'", function (check) {
  check(
    new ObjectPattern(
      new WildcardProperty("g")
    ).toString(),
    "*:'g'"
  )
})


example("toString: *:*", function (check) {
  check(
    new ObjectPattern(
      new WildcardProperty(
        new WildcardValue
      )
    ).toString(),
    "*:*"
  )
})


example("toString: typed:<number>", function (check) {
  check(
    new ObjectPattern(
      new ExactProperty(
        "typed", new TypedValue("number")
      )
    ).toString(),
    "typed:<number>"
  )
})


example("toString: array:/'with'/*/(y:'object')", function (check) {
  check(
    new ObjectPattern(
      new ExactProperty(
        "array",

        new ArrayPattern(
          "with",
          new WildcardValue,
          new ObjectPattern(
            new ExactProperty("y", "object")
          )
        )
      )
    ).toString(),
    "array:/'with'/*/(y:'object')"
  )
})
