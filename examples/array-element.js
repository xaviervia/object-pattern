var example = require("washington")
var assert  = require("assert")

var ArrayMatchable = require("../object-pattern").ArrayMatchable
var Matchable = require("../object-pattern").Matchable

var arrayElement = require("../object-pattern").arrayElement



example("arrayElement is tagged as ArrayMatchable", function () {
  assert( arrayElement().tags.indexOf(ArrayMatchable) > -1 )
})



example("arrayElement: encapsulates any Matchable", function () {
  var matchable = Matchable({
    match: function (argument) {
      this.match.argument = argument
      return 'matched'
    }
  })
  var element = arrayElement(matchable)
  var result = undefined

  result = element.match(['something', 'extra'])

  assert.equal( result.matched, 'matched' )
  assert.equal( matchable.match.argument, 'something' )
  assert.equal( result.unmatched[0], 'extra' )
})
