var example = require("washington")

var ExactProperty = require("../object-pattern").ExactProperty
var WildcardProperty = require("../object-pattern").WildcardProperty
var Negator = require("../object-pattern").Negator
var ObjectPattern = require("../object-pattern").ObjectPattern

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

  if (propertyName === "*")
    this.pattern.properties.push(
      new WildcardProperty(propertyValue) )

  else if (propertyName.substring(0, 1) === "!")
    this.pattern.properties.push(
      new Negator(
        propertyName.substring(1) === "*" ?
          new WildcardProperty(propertyValue) :
          new ExactProperty(propertyValue) ) )

  else
    this.pattern.properties.push(
      new ExactProperty(propertyName, propertyValue) )
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



example("Interpreter: '!*:value' > OP[N[WP]]", function () {
  return  new Interpreter("!*:value")
    .pattern
    .properties[0]
    .matchable instanceof WildcardProperty
})
