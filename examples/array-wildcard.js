var example = require("washington")
var assert  = require("assert")

var ArrayWildcard = require("../object-pattern").ArrayWildcard
var ArrayMatchable = require("../object-pattern").ArrayMatchable



example("ArrayWildcard is a ArrayMatchable", function () {
  assert( new ArrayWildcard instanceof ArrayMatchable )
})



example("ArrayWildcard: false if empty", function () {
  assert( ! new ArrayWildcard().match([]).matched )
})



example("ArrayWildcard: true if non empty", function () {
  assert( new ArrayWildcard().match(['something']).matched )
})



example("ArrayWildcard: unmatched has the rest of the array", function () {
  var result = new ArrayWildcard().match(['more', 'than', 'one'])
  assert.equal( result.unmatched.length, 2 )
  assert.equal( result.unmatched[0], 'than' )
  assert.equal( result.unmatched[1], 'one' )
})
