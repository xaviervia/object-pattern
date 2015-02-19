var example = require("washington")

var TypedValue = require("../object-pattern").TypedValue
var Matchable = require("../object-pattern").Matchable



example("TypedValue is a Matchable", function () {
  return new TypedValue instanceof Matchable
})



example("TypedValue: true if value is of type", function () {
  return new TypedValue(Matchable).match(new Matchable)
})



example("TypedValue: false if value is not of type", function () {
  return ! new TypedValue(TypedValue).match(new Matchable)
})



example("TypedValue + 'number': true if value is an integer", function () {
  return new TypedValue('number').match(3)
})



example("TypedValue + 'number': true if value is a float", function () {
  return new TypedValue('number').match(-2.4)
})



example("TypedValue + 'number': false if value is a string", function () {
  return ! new TypedValue('number').match('-1')
})



example("TypedValue + 'string': true if value is a plain String", function () {
  return new TypedValue('string').match('some string')
})



example("TypedValue + 'string': true if value is a String object", function () {
  return new TypedValue('string').match(new String('some string'))
})



example("TypedValue + 'string': false if value is a number", function () {
  return ! new TypedValue('string').match(3)
})



example("TypedValue + 'array': true if value is an Array", function () {
  return new TypedValue('array').match(new Array)
})



example("TypedValue + 'array': false if value is arguments object", function () {
  return ! new TypedValue('array').match(arguments)
})



example("TypedValue + 'array': false if value is a regular object", function () {
  return ! new TypedValue('array').match({})
})



example("TypedValue + 'boolean': true if value is true", function () {
  return new TypedValue('boolean').match(true)
})



example("TypedValue + 'boolean': true if value is false", function () {
  return new TypedValue('boolean').match(false)
})



example("TypedValue + 'object': true if value is a regular object", function () {
  return new TypedValue('object').match({})
})



example("TypedValue + 'object': false if value is a string", function () {
  return ! new TypedValue('object').match('string')
})



example("TypedValue + 'object': false if value is a number", function () {
  return ! new TypedValue('object').match(-4)
})



example("TypedValue + 'object': false if value is a boolean", function () {
  return ! new TypedValue('object').match(true)
})



example("TypedValue + 'object': false if value is an array", function () {
  return ! new TypedValue('object').match([])
})



example("TypedValue + 'object': false if value is a function", function () {
  return ! new TypedValue('object').match(new Function())
})
