var example = require("washington")
var assert  = require("assert")

var typedValue = require("../object-pattern").typedValue
var Matchable = require("../object-pattern").Matchable



example("typedValue's match has type Matchable", function () {
  assert(typedValue().match.type === Matchable)
})



example("typedValue: true if value is of type", function () {
  assert(typedValue(Matchable).match(new Matchable))
})



example("typedValue: false if value is not of type", function () {
  assert( ! typedValue(typedValue).match(new Matchable))
})



example("typedValue + 'number': true if value is an integer", function () {
  assert(typedValue('number').match(3))
})



example("typedValue + 'number': true if value is a float", function () {
  assert(typedValue('number').match(-2.4))
})



example("typedValue + 'number': false if value is a string", function () {
  assert( ! typedValue('number').match('-1'))
})



example("typedValue + 'string': true if value is a plain String", function () {
  assert(typedValue('string').match('some string'))
})



example("typedValue + 'string': true if value is a String object", function () {
  assert(typedValue('string').match(new String('some string')))
})



example("typedValue + 'string': false if value is a number", function () {
  assert( ! typedValue('string').match(3))
})



example("typedValue + 'array': true if value is an Array", function () {
  assert(typedValue('array').match(new Array))
})



example("typedValue + 'array': false if value is arguments object", function () {
  assert( ! typedValue('array').match(arguments))
})



example("typedValue + 'array': false if value is a regular object", function () {
  assert( ! typedValue('array').match({}))
})



example("typedValue + 'boolean': true if value is true", function () {
  assert(typedValue('boolean').match(true))
})



example("typedValue + 'boolean': true if value is false", function () {
  assert(typedValue('boolean').match(false))
})



example("typedValue + 'object': true if value is a regular object", function () {
  assert(typedValue('object').match({}))
})



example("typedValue + 'object': false if value is a string", function () {
  assert( ! typedValue('object').match('string'))
})



example("typedValue + 'object': false if value is a number", function () {
  assert( ! typedValue('object').match(-4))
})



example("typedValue + 'object': false if value is a boolean", function () {
  assert( ! typedValue('object').match(true))
})



example("typedValue + 'object': false if value is an array", function () {
  assert( ! typedValue('object').match([]))
})



example("typedValue + 'object': false if value is a function", function () {
  assert( ! typedValue('object').match(new Function()))
})
