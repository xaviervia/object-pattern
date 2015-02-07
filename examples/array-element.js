var example = require("washington")
var assert  = require("assert")

var arrayElement = require("../object-pattern").arrayElement
var ArrayMatchable = require("../object-pattern").ArrayMatchable
var Matchable = require("../object-pattern").Matchable



example("arrayElement's match has type ArrayMatchable", function () {
  assert( arrayElement().match.type === ArrayMatchable )
})



example("arrayElement: encapsulates any Matchable", function () {
  var matchable = {
    match: Matchable(function (argument) {
      this.match.argument = argument
      return 'matched'
    })
  }
  var element = arrayElement(matchable)
  var result = undefined

  result = element.match(['something', 'extra'])

  assert.equal( result.matched, 'matched' )
  assert.equal( matchable.match.argument, 'something' )
  assert.equal( result.unmatched[0], 'extra' )
})
