var example = require("washington")
var assert  = require("assert")

var arrayEllipsis = require("../object-pattern").arrayEllipsis
var ArrayMatchable = require("../object-pattern").ArrayMatchable
var typedValue = require("../object-pattern").typedValue



example("arrayEllipsis's match has type ArrayMatchable", function () {
  assert( arrayEllipsis().match.type === ArrayMatchable )
})



example("arrayEllipsis[]: true if empty", function () {
  assert( arrayEllipsis().match([]).matched )
})



example("arrayEllipsis[]: true with some elements", function () {
  assert( arrayEllipsis().match([2 , 4]).matched )
})



example("arrayEllipsis[typedValue]: true when there is an element of that type", function () {
  assert( arrayEllipsis(typedValue('string')).match(['a']).matched )
})



example("arrayEllipsis[typedValue]: false when there is no element of that type", function () {
  assert( ! arrayEllipsis(typedValue('string')).match([2]).matched )
})



example("arrayEllipsis[non-matchable]: true when an element === the non matchable", function () {
  assert( arrayEllipsis(5).match([6, 5, 7]) )
})



example("arrayEllipsis[non-matchable]: false when not found", function () {
  assert( ! arrayEllipsis(7).match([1, 2, 3]).matched )
})



example("arrayEllipsis[non-matchable]: returns the remaining elements, non-greedy", function () {
  var result = arrayEllipsis(6).match([2, 6, 3, 6])

  assert.equal( result.unmatched.length, 2 )
  assert.equal( result.unmatched[0], 3 )
  assert.equal( result.unmatched[1], 6 )
})
