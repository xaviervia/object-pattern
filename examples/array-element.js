var example = require("washington")
var assert  = require("assert")

var ArrayElement = require("../object-pattern").ArrayElement
var ArrayMatchable = require("../object-pattern").ArrayMatchable
var Matchable = require("../object-pattern").Matchable



example("ArrayElement is ArrayMatchable", function () {
  assert( new ArrayElement instanceof ArrayMatchable )
})



example("ArrayElement: encapsulates any Matchable", function () {
  var matchable = new Matchable
  var arrayElement = new ArrayElement(matchable)
  var result = undefined
  matchable.match = function (argument) {
    this.match.argument = argument
    return 'matched'
  }

  result = arrayElement.match(['something', 'extra'])

  assert.equal( result.matched, 'matched' )
  assert.equal( matchable.match.argument, 'something' )
  assert.equal( result.unmatched[0], 'extra' )
})
