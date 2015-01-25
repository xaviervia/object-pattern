var example = require("washington")
var assert  = require("assert")

var ArrayPattern = require("../object-pattern").ArrayPattern
var ArrayMatchable = require("../object-pattern").ArrayMatchable
var Matchable = require("../object-pattern").Matchable



example("ArrayPattern is a Matchable", function () {
  assert( new ArrayPattern instanceof Matchable )
})



example("ArrayPattern + undefined: false for non array", function () {
  assert( ! new ArrayPattern().match('non array') )
})



example("ArrayPattern + undefined: true for empty array", function () {
  assert( new ArrayPattern().match([]) )
})



example("ArrayPattern + undefined: false for non empty array", function () {
  assert( ! new ArrayPattern().match([ 'something' ]) )
})



example("ArrayPattern + [ArrayMatchable]: forward elements and return `matched`", function () {
  var arrayMatchable = new ArrayMatchable
  arrayMatchable.match = function () {
    this.match.called = arguments
    return {
      matched: 'matched',
      unmatched: []
    }
  }

  var result = new ArrayPattern(arrayMatchable).match(['something'])

  assert.equal( arrayMatchable.match.called[0], 'something' )
  assert.equal( result, true )
})



example("ArrayPattern + [AM]: remaining elements mean not a match", function () {
  var arrayMatchable = new ArrayMatchable
  arrayMatchable.match = function () {
    return {
      matched: true,
      unmatched: [ 'element!' ]
    }
  }

  assert( ! new ArrayPattern(arrayMatchable).match(['something']) )
})



example("ArrayPattern + [AM, AM]: remaining elements are send to the next", function () {
  var firstMatchable = new ArrayMatchable
  var secondMatchable = new ArrayMatchable
  var remaining = ['some', 'remaining']
  firstMatchable.match = function () {
    return {
      matched: true,
      unmatched: remaining } }
  secondMatchable.match = function () {
    this.match.called = arguments
    return {
      matched: true,
      unmatched: ['irrelevant'] } }

  new ArrayPattern(firstMatchable, secondMatchable).match(['irrelevant'])

  assert.equal( secondMatchable.match.called[0], remaining )
})



example("ArrayPattern + [AM, AM]: next is not called if first is false", function () {
  var firstMatchable = new ArrayMatchable
  var secondMatchable = new ArrayMatchable
  firstMatchable.match = function () {
    return {
      matched: false,
      unmatched: [] } }
  secondMatchable.match = function () { this.called = true }

  assert( ! new ArrayPattern(firstMatchable, secondMatchable).match(['']) )
  assert( ! secondMatchable.match.called )
})



example("ArrayPattern[non-AM, AM]: true when existing, sends the rest to the next AM", function () {
  var arrayMatchable = new ArrayMatchable
  var arrayMatcher = new ArrayPattern('exactly', arrayMatchable)
  arrayMatchable.match = function (argument) {
    this.match.argument = argument
    return {
      matched: true,
      unmatched: []
    }
  }

  arrayMatcher.match(['exactly', 'extra'])

  assert.equal( arrayMatchable.match.argument[0], 'extra' )
  assert.equal( arrayMatchable.match.argument.length, 1 )
})



example("ArrayPattern[non-AM, non-AM]: true when match", function () {
  assert( new ArrayPattern(5, 6).match([5, 6]) )
})



example("ArrayPattern[non-AM, non-AM]: false when not a match", function () {
  assert( ! new ArrayPattern(5, 6).match([5, 7]) )
})
