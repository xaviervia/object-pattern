var example = require("washington")

var ExactProperty = require("../object-pattern").ExactProperty
var WildcardProperty = require("../object-pattern").WildcardProperty
var Negator = require("../object-pattern").Negator
var ObjectPattern = require("../object-pattern").ObjectPattern
var WildcardValue = require("../object-pattern").WildcardValue
var TypedValue = require("../object-pattern").TypedValue
var ArrayPattern = require("../object-pattern").ArrayPattern

var Interpreter = function (source) {
  this.pattern = new ObjectPattern

  this.object(source)
}


Interpreter.prototype.object = function (source) {
  var buffer = ""

  source.split("").forEach(function (character, index) {
    if (character === ",") {
      this.property(buffer)
      buffer = ""
    }

    else buffer += character

    if (index + 1 === source.length)
      this.property(buffer)

  }.bind(this))
}


Interpreter.prototype.property = function (source) {
  var buffer        = ""
  var propertyName  = undefined
  var propertyValue = undefined

  source.split("").forEach(function (character, index) {
    if (character === ":") {
      propertyName  = buffer
      buffer        = ""
    }

    else buffer += character

    if (index + 1 === source.length)
      propertyValue = buffer
  }.bind(this))

  propertyValue = this.value(propertyValue)

  if (propertyName === "*")
    this.pattern.properties.push(
      new WildcardProperty(propertyValue) )

  else if (propertyName.substring(0, 1) === "!")
    this.pattern.properties.push(
      new Negator(
        propertyName.substring(1) === "*" ?
          new WildcardProperty(propertyValue) :
          new ExactProperty(
            propertyName.substring(1),
            propertyValue ) ) )

  else
    this.pattern.properties.push(
      new ExactProperty(propertyName, propertyValue) )
}


Interpreter.prototype.value = function (source) {
  if (source === "*")
    return new WildcardValue

  if (source.substring(0, 1) === "<" &&
      source.substring(source.length - 1, source.length) === ">")
    return new TypedValue(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "/")
    return this.array(source)

  return source
}


Interpreter.prototype.array = function (source) {
  var pattern = new ArrayPattern

  source.split("/").forEach(function (chunk) {
    if (chunk !== "")
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