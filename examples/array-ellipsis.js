var example = require("washington")
var assert  = require("assert")

var ArrayEllipsis = require("../object-pattern").ArrayEllipsis
var ArrayMatchable = require("../object-pattern").ArrayMatchable
var TypedValue = require("../object-pattern").TypedValue



example("ArrayEllipsis is a ArrayMatchable", function () {
  assert( new ArrayEllipsis instanceof ArrayMatchable )
})



example("ArrayEllipsis[]: true if empty", function () {
  assert( new ArrayEllipsis().match([]).matched )
})



example("ArrayEllipsis[]: true with some elements", function () {
  assert( new ArrayEllipsis().match([2 , 4]).matched )
})



example("ArrayEllipsis[TypedValue]: true when there is an element of that type", function () {
  assert( new ArrayEllipsis(new TypedValue('string')).match(['a']).matched )
})



example("ArrayEllipsis[TypedValue]: false when there is no element of that type", function () {
  assert( ! new ArrayEllipsis(new TypedValue('string')).match([2]).matched )
})



example("ArrayEllipsis[non-matchable]: true when an element === the non matchable", function () {
  assert( new ArrayEllipsis(5).match([6, 5, 7]) )
})



example("ArrayEllipsis[non-matchable]: false when not found", function () {
  assert( ! new ArrayEllipsis(7).match([1, 2, 3]).matched )
})



example("ArrayEllipsis[non-matchable]: returns the remaining elements, non-greedy", function () {
  var result = new ArrayEllipsis(6).match([2, 6, 3, 6])

  assert.equal( result.unmatched.length, 2 )
  assert.equal( result.unmatched[0], 3 )
  assert.equal( result.unmatched[1], 6 )
})
