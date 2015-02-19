var example = require("washington")

var ArrayWildcard = require("../object-pattern").ArrayWildcard
var ArrayMatchable = require("../object-pattern").ArrayMatchable



example("ArrayWildcard is a ArrayMatchable", function () {
  return new ArrayWildcard instanceof ArrayMatchable
})



example("ArrayWildcard: false if empty", function () {
  return ! new ArrayWildcard().match([]).matched
})



example("ArrayWildcard: true if non empty", function () {
  return new ArrayWildcard().match(['something']).matched
})



example("ArrayWildcard: unmatched has the rest of the array", function () {
  var result = new ArrayWildcard().match(['more', 'than', 'one'])
  return  result.unmatched.length == 2 &&
          result.unmatched[0] == 'than' &&
          result.unmatched[1] == 'one'
})
