var example = require("washington")
var assert  = require("assert")

var arrayPattern = require("../object-pattern").arrayPattern
var ArrayMatchable = require("../object-pattern").ArrayMatchable
var Matchable = require("../object-pattern").Matchable



example("arrayPattern's match has type Matchable", function () {
  assert( arrayPattern().match.type === Matchable )
})



example("arrayPattern + undefined: false for non array", function () {
  assert( ! arrayPattern().match('non array') )
})



example("arrayPattern + undefined: true for empty array", function () {
  assert( arrayPattern().match([]) )
})



example("arrayPattern + undefined: false for non empty array", function () {
  assert( ! arrayPattern().match([ 'something' ]) )
})



example("arrayPattern + [ArrayMatchable]: forward elements and return `matched`", function () {
  var arrayMatchable = {
    match: ArrayMatchable(function () {
      this.match.called = arguments
      return {
        matched: 'matched',
        unmatched: []
      }
    })
  }

  var result = arrayPattern(arrayMatchable).match(['something'])

  assert.equal( arrayMatchable.match.called[0], 'something' )
  assert.equal( result, true )
})



example("arrayPattern + [AM]: remaining elements mean not a match", function () {
  var arrayMatchable = {
    match: ArrayMatchable(function () {
      return {
        matched: true,
        unmatched: [ 'element!' ]
      }
    })
  }

  assert( ! arrayPattern(arrayMatchable).match(['something']) )
})



example("arrayPattern + [AM, AM]: remaining elements are send to the next", function () {
  var firstMatchable = {
    match: ArrayMatchable(function () {
      return {
        matched: true,
        unmatched: remaining }
    })
  }
  var secondMatchable = {
    match: ArrayMatchable(function () {
      this.match.called = arguments
      return {
        matched: true,
        unmatched: ['irrelevant'] }
    })
  }
  var remaining = ['some', 'remaining']

  arrayPattern(firstMatchable, secondMatchable).match(['irrelevant'])

  assert.equal( secondMatchable.match.called[0], remaining )
})



example("arrayPattern + [AM, AM]: next is not called if first is false", function () {
  var firstMatchable = {
    match: ArrayMatchable(function () {
      return {
        matched: false,
        unmatched: []
      }
    })
  }
  var secondMatchable = {
    match: ArrayMatchable(function () { this.called = true })
  }

  assert( ! arrayPattern(firstMatchable, secondMatchable).match(['']) )
  assert( ! secondMatchable.match.called )
})



example("arrayPattern[non-AM, AM]: true when existing, sends the rest to the next AM", function () {
  var arrayMatchable = {
    match: ArrayMatchable(function (argument) {
      this.match.argument = argument
      return {
        matched: true,
        unmatched: []
      }
    })
  }
  var arrayMatcher = arrayPattern('exactly', arrayMatchable)

  arrayMatcher.match(['exactly', 'extra'])

  assert.equal( arrayMatchable.match.argument[0], 'extra' )
  assert.equal( arrayMatchable.match.argument.length, 1 )
})



example("arrayPattern[non-AM, non-AM]: true when match", function () {
  assert( arrayPattern(5, 6).match([5, 6]) )
})



example("arrayPattern[non-AM, non-AM]: false when not a match", function () {
  assert( ! arrayPattern(5, 6).match([5, 7]) )
})
