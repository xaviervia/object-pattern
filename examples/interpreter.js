var example = require("washington")

var ArrayEllipsis = require("../object-pattern").ArrayEllipsis
var ArrayPattern = require("../object-pattern").ArrayPattern
var ArrayWildcard = require("../object-pattern").ArrayWildcard
var ExactProperty = require("../object-pattern").ExactProperty
var Negator = require("../object-pattern").Negator
var ObjectPattern = require("../object-pattern").ObjectPattern
var TypedValue = require("../object-pattern").TypedValue
var WildcardProperty = require("../object-pattern").WildcardProperty
var WildcardValue = require("../object-pattern").WildcardValue

var Interpreter = function (source) {
  this.pattern = this.object(source)
}


Interpreter.prototype.object = function (source) {
  var buffer = ""
  var deepness = 0
  var object = new ObjectPattern

  source.split("").forEach(function (character, index) {
    if (character === "," && deepness === 0) {
      object.properties.push(this.property(buffer))
      buffer = ""
    }

    else
      buffer += character

    if (character === "(") deepness ++
    if (character === ")") {
      deepness --
      if (deepness === 0) {
        object.properties.push(this.property(buffer))
        buffer = ""
      }
    }

    if (index + 1 === source.length)
      object.properties.push(this.property(buffer))
  }.bind(this))

  return object
}


Interpreter.prototype.property = function (source) {
  var buffer        = ""
  var deepness      = 0
  var propertyName  = source.substring(0, source.indexOf(":"))
  var propertyValue = this.value(source.substring(source.indexOf(":") + 1))

  if (propertyName === "*")
    return new WildcardProperty(propertyValue)

  else if (propertyName.substring(0, 1) === "!")
    return new Negator( propertyName.substring(1) === "*" ?
      new WildcardProperty(propertyValue) :
      new ExactProperty(
        propertyName.substring(1),
        propertyValue ) )

  else
    return new ExactProperty(propertyName, propertyValue)
}


Interpreter.prototype.value = function (source) {
  if (source === "*")
    return new WildcardValue

  if (source.substring(0, 1) === "<" &&
      source.substring(source.length - 1, source.length) === ">")
    return new TypedValue(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "(" &&
      source.substring(source.length - 1, source.length) === ")")
    return this.object(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "/")
    return this.array(source)

  return source
}


Interpreter.prototype.array = function (source) {
  var pattern = new ArrayPattern
  var termination = false

  source.split("/").forEach(function (chunk, index, list) {
    if (termination)
      termination = false

    else if (chunk === "*")
      pattern.matchables.push(new ArrayWildcard)

    else if (chunk === "**") {
      pattern.matchables.push(new ArrayEllipsis(
        index + 1 < list.length ? list[index + 1] : undefined ))
      termination = true
    }

    else if (chunk !== "")
      pattern.matchables.push(chunk)
  })

  return pattern
}



example("Interpreter: '' > OP", function () {
  return new Interpreter("")
    .pattern instanceof ObjectPattern
})



example("Interpreter: 'key:value' > OP[EP]", function () {
  return new Interpreter("key:value")
    .pattern
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'key:value' > OP[EP[key]]", function () {
  return new Interpreter("key:value")
    .pattern
    .properties[0]
    .name === "key"
})



example("Interpreter: 'key:value' > OP[EP[,value]]", function () {
  return new Interpreter("key:value")
    .pattern
    .properties[0]
    .value === "value"
})



example("Interpreter: '*:value' > OP[WP]", function () {
  return new Interpreter("*:value")
    .pattern
    .properties[0] instanceof WildcardProperty
})



example("Interpreter: '*:value,other:23' > OP[WP,EP]", function () {
  var properties = new Interpreter("*:value,other:23").pattern.properties

  return  properties[0] instanceof WildcardProperty &&
          properties[1] instanceof ExactProperty
})



example("Interpreter: '!prop:value' > OP[N[EP]]", function () {
  return  new Interpreter("!prop:value")
    .pattern
    .properties[0]
    .matchable instanceof ExactProperty
})



example("Interpreter: '!prop:value' > OP[N[EP[prop]]]", function () {
  return  new Interpreter("!prop:value")
    .pattern
    .properties[0]
    .matchable
    .name === "prop"
})



example("Interpreter: '!prop:value' > OP[N[EP[,value]]]", function () {
  return  new Interpreter("!prop:value")
    .pattern
    .properties[0]
    .matchable
    .value === "value"
})



example("Interpreter: '!*:value' > OP[N[WP]]", function () {
  return  new Interpreter("!*:value")
    .pattern
    .properties[0]
    .matchable instanceof WildcardProperty
})



example("Interpreter: '!*:value' > OP[N[WP[value]]]", function () {
  return  new Interpreter("!*:value")
    .pattern
    .properties[0]
    .matchable
    .value === "value"
})



example("Interpreter: 'something:*' > OP[EP[WV]]", function () {
  return  new Interpreter("something:*")
    .pattern
    .properties[0]
    .value instanceof WildcardValue
})



example("Interpreter: 'type:<string>' > OP[EP[TV]]", function () {
  return  new Interpreter("type:<string>")
    .pattern
    .properties[0]
    .value instanceof TypedValue
})



example("Interpreter: 'type:<string>' > OP[EP[TV[string]]]", function () {
  return  new Interpreter("type:<string>")
    .pattern
    .properties[0]
    .value
    .type === "string"
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value instanceof ObjectPattern
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP]]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP[object]]]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value
    .properties[0]
    .name === "object"
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP[,inside]]]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value
    .properties[0]
    .value === "inside"
})



example("Interpreter: 'type:/some/array' > OP[EP[AP]]", function () {
  return  new Interpreter("type:/some/array")
    .pattern
    .properties[0]
    .value instanceof ArrayPattern
})



example("Interpreter: 'type:/some/array' > OP[EP[AP[some]]]", function () {
  return  new Interpreter("type:/some/array")
    .pattern
    .properties[0]
    .value
    .matchables[0] === "some"
})



example("Interpreter: 'type:/some/array' > OP[EP[AP[/array]]]", function () {
  return  new Interpreter("type:/some/array")
    .pattern
    .properties[0]
    .value
    .matchables[1] === "array"
})



example("Interpreter: 'type:/*/array' > OP[EP[AP[AW]]]", function () {
  return  new Interpreter("type:/*/array")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ArrayWildcard
})



example("Interpreter: 'type:/**/array' > OP[EP[AP[AE]]]", function () {
  return  new Interpreter("type:/**/array")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/**/array' > OP[EP[AP[AE[array]]]]", function () {
  return  new Interpreter("type:/**/array")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .termination === "array"
})



example("Interpreter: 'type:/**' > OP[EP[AP[AE[undefined]]]]", function () {
  return  new Interpreter("type:/**")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .termination === undefined
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[AW]]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ArrayWildcard
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,AE]]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[1] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,AE[a]]]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[1]
    .termination === "a"
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,,b]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[2] === "b"
})
