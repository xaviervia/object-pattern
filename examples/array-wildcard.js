var example = require("washington")
var assert  = require("assert")

var arrayWildcard = require("../object-pattern").arrayWildcard
var ArrayMatchable = require("../object-pattern").ArrayMatchable



example("arrayWildcard's match has type ArrayMatchable", function () {
  assert( arrayWildcard().match.type === ArrayMatchable )
})



example("arrayWildcard: false if empty", function () {
  assert( ! arrayWildcard().match([]).matched )
})



example("arrayWildcard: true if non empty", function () {
  assert( arrayWildcard().match(['something']).matched )
})



example("arrayWildcard: unmatched has the rest of the array", function () {
  var result = arrayWildcard().match(['more', 'than', 'one'])
  assert.equal( result.unmatched.length, 2 )
  assert.equal( result.unmatched[0], 'than' )
  assert.equal( result.unmatched[1], 'one' )
})
