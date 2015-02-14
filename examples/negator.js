var example = require("washington")
var assert  = require("assert")

var negator = require("../object-pattern").negator
var Matchable = require("../object-pattern").Matchable



example("negator match has type Matchable", function () {
  assert(negator().tags.indexOf(Matchable) > -1)
})



example("negator: delegates and negates", function () {
  var matchable = {
    tags: [Matchable],
    match: function (object) {
      this.match.calledWith = object
      return false
    }
  }
  var theObject = {}

  assert( negator(matchable).match(theObject) )

  assert.equal(
    matchable.match.calledWith, theObject)
})
