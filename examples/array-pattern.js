var example = require("washington")

var ArrayEllipsis = require("../object-pattern").ArrayEllipsis
var ArrayPattern = require("../object-pattern").ArrayPattern
var ArrayMatchable = require("../object-pattern").ArrayMatchable
var Matchable = require("../object-pattern").Matchable
var TypedValue = require("../object-pattern").TypedValue
var WildcardValue = require("../object-pattern").WildcardValue



example("ArrayPattern is a Matchable", function () {
  return new ArrayPattern instanceof Matchable
})



example("ArrayPattern + undefined: false for non array", function () {
  return ! new ArrayPattern().match('non array')
})



example("ArrayPattern + undefined: true for empty array", function () {
  return new ArrayPattern().match([])
})



example("ArrayPattern + undefined: false for non empty array", function () {
  return ! new ArrayPattern().match([ 'something' ])
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

  return  arrayMatchable.match.called[0] == 'something' &&
          result
})



example("ArrayPattern + [AM]: remaining elements mean not a match", function () {
  var arrayMatchable = new ArrayMatchable
  arrayMatchable.match = function () {
    return {
      matched: true,
      unmatched: [ 'element!' ]
    }
  }

  return ! new ArrayPattern(arrayMatchable).match(['something'])
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

  return secondMatchable.match.called[0] === remaining
})



example("ArrayPattern + [AM, AM]: next is not called if first is false", function () {
  var firstMatchable = new ArrayMatchable
  var secondMatchable = new ArrayMatchable
  firstMatchable.match = function () {
    return {
      matched: false,
      unmatched: [] } }
  secondMatchable.match = function () { this.called = true }

  return ! new ArrayPattern(firstMatchable, secondMatchable).match(['']) &&
         ! secondMatchable.match.called
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

  return  arrayMatchable.match.argument[0] == 'extra' &&
          arrayMatchable.match.argument.length == 1
})



example("ArrayPattern[non-AM, non-AM]: true when match", function () {
  return new ArrayPattern(5, 6).match([5, 6])
})



example("ArrayPattern[non-AM, non-AM]: false when not a match", function () {
  return ! new ArrayPattern(5, 6).match([5, 7])
})



example("ArrayPattern[M, AM]: true when a match, sends the rest to the next AM", function () {
  var arrayMatchable = new ArrayMatchable
  var matchable = new Matchable
  var arrayMatcher = new ArrayPattern(matchable, arrayMatchable)
  matchable.match = function (value) {
    return value === 'exactly'
  }
  arrayMatchable.match = function (argument) {
    this.match.argument = argument
    return {
      matched: true,
      unmatched: []
    }
  }

  arrayMatcher.match(['exactly', 'extra'])

  return  arrayMatchable.match.argument[0] == 'extra' &&
          arrayMatchable.match.argument.length == 1
})



example("ArrayPattern <number>/user/*/9 doesn't match [6, 'user', 9]", function () {
  var arrayMatcher = new ArrayPattern(
    new TypedValue( 'number' ),
    'user',
    new WildcardValue(),
    new ArrayEllipsis( 9 )
  )

  return ! arrayMatcher.match([6, 'user', 9])
})



example("ArrayPattern <number>/user/*/9 matches [-56.2, 'user', 'extra', 9]", function () {
  var arrayMatcher = new ArrayPattern(
    new TypedValue( 'number' ),
    'user',
    new WildcardValue(),
    new ArrayEllipsis( 9 )
  )

  return arrayMatcher.match([-56.2, 'user', 'extra', 9])
})
