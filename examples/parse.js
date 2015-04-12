var example = require("washington")

var ArrayEllipsis = require("../object-pattern").ArrayEllipsis
var ArrayPattern = require("../object-pattern").ArrayPattern
var ArrayWildcard = require("../object-pattern").ArrayWildcard
var ExactProperty = require("../object-pattern").ExactProperty
var Negator = require("../object-pattern").Negator
var ObjectPattern = require("../object-pattern").ObjectPattern
var TypedValue = require("../object-pattern").TypedValue
var WildcardProperty = require("../object-pattern").WildcardProperty
var WildcardValue = require("../object-pattern").WildcardValue
var parse = require("../object-pattern").parse

example("parse: '' > OP", function () {
  return parse("") === undefined
})



example("parse: 'key:value' > OP[EP]", function () {
  return parse("key:value")
    .properties[0] instanceof ExactProperty
})



example("parse: 'key:value' > OP[EP[key]]", function () {
  return parse("key:value")
    .properties[0]
    .name === "key"
})



example("parse: 'key:value' > OP[EP[,value]]", function () {
  return parse("key:value")
    .properties[0]
    .value === "value"
})



example("parse: '*:value' > OP[WP]", function () {
  return parse("*:value")
    .properties[0] instanceof WildcardProperty
})



example("parse: '*:value,other:23' > OP[WP,EP]", function () {
  var properties = parse("*:value,other:23").properties

  return  properties[0] instanceof WildcardProperty &&
          properties[1] instanceof ExactProperty
})



example("parse: '!prop:value' > OP[N[EP]]", function () {
  return parse("!prop:value")
    .properties[0]
    .matchable instanceof ExactProperty
})



example("parse: '!prop:value' > OP[N[EP[prop]]]", function () {
  return parse("!prop:value")
    .properties[0]
    .matchable
    .name === "prop"
})



example("parse: '!prop:value' > OP[N[EP[,value]]]", function () {
  return parse("!prop:value")
    .properties[0]
    .matchable
    .value === "value"
})



example("parse: '!*:value' > OP[N[WP]]", function () {
  return parse("!*:value")
    .properties[0]
    .matchable instanceof WildcardProperty
})



example("parse: '!*:value' > OP[N[WP[value]]]", function () {
  return parse("!*:value")
    .properties[0]
    .matchable
    .value === "value"
})



example("parse: 'something:*' > OP[EP[WV]]", function () {
  return parse("something:*")
    .properties[0]
    .value instanceof WildcardValue
})



example("parse: 'type:<string>' > OP[EP[TV]]", function () {
  return parse("type:<string>")
    .properties[0]
    .value instanceof TypedValue
})



example("parse: 'type:<string>' > OP[EP[TV[string]]]", function () {
  return parse("type:<string>")
    .properties[0]
    .value
    .type === "string"
})



example("parse: 'prop:(object:inside)' > OP[EP[OP]]", function () {
  return parse("prop:(object:inside)")
    .properties[0]
    .value instanceof ObjectPattern
})



example("parse: 'prop:(object:inside)' > OP[EP[OP[EP]]]", function () {
  return parse("prop:(object:inside)")
    .properties[0]
    .value
    .properties[0] instanceof ExactProperty
})



example("parse: 'prop:(object:inside)' > OP[EP[OP[EP[object]]]]", function () {
  return parse("prop:(object:inside)")
    .properties[0]
    .value
    .properties[0]
    .name === "object"
})



example("parse: 'prop:(object:inside)' > OP[EP[OP[EP[,inside]]]]", function () {
  return parse("prop:(object:inside)")
    .properties[0]
    .value
    .properties[0]
    .value === "inside"
})



example("parse: 'type:/some/array' > OP[EP[AP]]", function () {
  return parse("type:/some/array")
    .properties[0]
    .value instanceof ArrayPattern
})



example("parse: 'type:/some/array' > OP[EP[AP[some]]]", function () {
  return parse("type:/some/array")
    .properties[0]
    .value
    .matchables[0] === "some"
})



example("parse: 'type:/some/array' > OP[EP[AP[/array]]]", function () {
  return parse("type:/some/array")
    .properties[0]
    .value
    .matchables[1] === "array"
})



example("parse: 'type:/*/array' > OP[EP[AP[WV]]]", function () {
  return parse("type:/*/array")
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("parse: 'type:/**/array' > OP[EP[AP[AE]]]", function () {
  return parse("type:/**/array")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayEllipsis
})



example("parse: 'type:/**/array' > OP[EP[AP[AE[array]]]]", function () {
  return parse("type:/**/array")
    .properties[0]
    .value
    .matchables[0]
    .termination === "array"
})



example("parse: 'type:/**' > OP[EP[AP[AE]]]", function () {
  return parse("type:/**")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayEllipsis
})



example("parse: 'type:/**' > OP[EP[AP[AE[undefined]]]]", function () {
  return parse("type:/**")
    .properties[0]
    .value
    .matchables[0]
    .termination === undefined
})



example("parse: 'type:/*/**/a/b' > OP[EP[AP[WV]]]", function () {
  return parse("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("parse: 'type:/*/**/a/b' > OP[EP[AP[WV]]]", function () {
  return parse("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("parse: 'type:/*/**/a/b' > OP[EP[AP[,AE]]]", function () {
  return parse("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[1] instanceof ArrayEllipsis
})



example("parse: 'type:/*/**/a/b' > OP[EP[AP[,AE[a]]]", function () {
  return parse("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[1]
    .termination === "a"
})



example("parse: 'type:/*/**/a/b' > OP[EP[AP[,,b]", function () {
  return parse("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[2] === "b"
})



example("parse: 'a:/[/sub/array]/b' > OP[EP[AP[AP]]]", function () {
  return parse("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayPattern
})



example("parse: 'a:/[/sub/array]/b' > OP[EP[AP[AP]]]", function () {
  return parse("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayPattern
})



example("parse: 'a:/[/sub/array]/b' > OP[EP[AP[AP[sub]]]]", function () {
  return parse("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0]
    .matchables[0] === "sub"
})



example("parse: 'a:/[/sub/array]/b' > OP[EP[AP[AP[,array]]]]", function () {
  return parse("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0]
    .matchables[1] === "array"
})



example("parse: 'a:/[/sub/[/sub]/array]/b' > OP[EP[AP[AP[,AP]]]]", function () {
  return parse("a:/[/sub/[/sub]/array]/b")
    .properties[0]
    .value
    .matchables[0]
    .matchables[1] instanceof ArrayPattern
})



example("parse: 'a:/(sub:object)/b' > OP[EP[AP[OP]]]", function () {
  return parse("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0] instanceof ObjectPattern
})



example("parse: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP]]]]", function () {
  return parse("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0]
    .properties[0] instanceof ExactProperty
})



example("parse: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP[sub]]]]]", function () {
  return parse("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0]
    .properties[0]
    .name === "sub"
})



example("parse: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP[,object]]]]]", function () {
  return parse("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0]
    .properties[0]
    .value === "object"
})



example("parse: 'a:true' > OP[EP[,true]]", function () {
  return parse("a:true")
    .properties[0]
    .value === true
})



example("parse: 'a:false' > OP[EP[,false]]", function () {
  return parse("a:false")
    .properties[0]
    .value === false
})



example("parse: 'a:24' > OP[EP[,24]]", function () {
  return parse("a:24")
    .properties[0]
    .value === 24
})



example("parse: 'a:24.7' > OP[EP[,24.7]]", function () {
  return parse("a:24.7")
    .properties[0]
    .value === 24.7
})



example("parse: 'a:-24.7' > OP[EP[,-24.7]]", function () {
  return parse("a:-24.7")
    .properties[0]
    .value === -24.7
})



example("parse: 'a:\"true\"' > OP[EP[,\"true\"]]", function () {
  return parse("a:\"true\"")
    .properties[0]
    .value === "true"
})



example("parse: 'a:\"/true/(a:b)\"' > OP[EP[,\"/true/(a:b)\"]]", function () {
  return parse("a:\"/true/(a:b)\"")
    .properties[0]
    .value === "/true/(a:b)"
})



example("parse: 'a:/true' > OP[AP[true]]", function () {
  return parse("a:/true")
    .properties[0]
    .value
    .matchables[0] === true
})



example("parse: 'a:/false' > OP[AP[false]]", function () {
  return parse("a:/false")
    .properties[0]
    .value
    .matchables[0] === false
})



example("parse: 'a:/23' > OP[AP[23]]", function () {
  return parse("a:/23")
    .properties[0]
    .value
    .matchables[0] === 23
})



example("parse: 'a:/23.2' > OP[AP[23.2]]", function () {
  return parse("a:/23.2")
    .properties[0]
    .value
    .matchables[0] === 23.2
})



example("parse: 'a:/-23.2' > OP[AP[-23.2]]", function () {
  return parse("a:/-23.2")
    .properties[0]
    .value
    .matchables[0] === -23.2
})



example("parse: 'a:/\"23\"' > OP[AP[\"23\"]]", function () {
  return parse("a:/\"23\"")
    .properties[0]
    .value
    .matchables[0] === "23"
})



example("parse: 'a:/\"true\"' > OP[AP[true]]", function () {
  return parse("a:/\"true\"")
    .properties[0]
    .value
    .matchables[0] === "true"
})



example("parse: 'a:/\"so/th/(go:1)\"' > OP[AP[\"so/th/(go:1)\"]]", function () {
  return parse("a:/\"so/th/(go:1)\"")
    .properties[0]
    .value
    .matchables[0] === "so/th/(go:1)"
})



example("parse: 'a:'(sogo:/1/2)'' > OP[EP['(sogo:/1/2)']]", function () {
  return parse("a:'(sogo:/1/2)'")
    .properties[0]
    .value === "(sogo:/1/2)"
})



example("parse: 'a:/'so/th/(go:1)'' > OP[AP['so/th/(go:1)']]", function () {
  return parse("a:/'so/th/(go:1)'")
    .properties[0]
    .value
    .matchables[0] === "so/th/(go:1)"
})



example("parse: 'a:/<number>' > OP[AP[TV['number']]]", function () {
  return parse("a:/<number>")
    .properties[0]
    .value
    .matchables[0] instanceof TypedValue
})



example("parse: 'a:/<number>' > OP[AP[TV['number']]]", function () {
  return parse("a:/<number>")
    .properties[0]
    .value
    .matchables[0]
    .type === "number"
})



example("parse: 'a:\"some\\\"thing\"' > OP[EP[\"some\"thing\"]]", function () {
  return parse("a:\"some\\\"thing\"")
    .properties[0]
    .value === "some\"thing"
})



example("parse: '/a/b' > AP", function () {
  return parse("/a/b") instanceof ArrayPattern
})



example("parse: '/a/b' > AP[a]", function () {
  return parse("/a/b")
    .matchables[0] === "a"
})



example("parse: '/a/b' > AP[,b]", function () {
  return parse("/a/b")
    .matchables[1] === "b"
})



example("parse: /** > AP[AE]", function () {
  return parse("/**")
    .matchables[0] instanceof ArrayEllipsis
})



example("parse: /** > AP[AE[undefined]]", function () {
  return parse("/**")
    .matchables[0].termation === undefined
})



example("parse: /**/3 > AP[AE[3]]", function () {
  return parse("/**/3")
    .matchables[0].termination === 3
})


example("parse: @json {} > OP", function () {
  return parse({}) instanceof ObjectPattern
})


example("parse: @json {key:'value'} > OP[EP]", function () {
  return parse({ key: 'value' })
    .properties[0] instanceof ExactProperty
})


example("parse: @json {key:'value'} > OP[EP[key]]", function () {
  return parse({ key: 'value' })
    .properties[0]
    .name === 'key'
})


example("parse: @json {key:'value'} > OP[EP[,value]]", function () {
  return parse({ key: 'value' })
    .properties[0]
    .value === 'value'
})


example("parse: @json {*:'value'} > OP[WP]", function () {
  return parse({ '*': 'value' })
    .properties[0] instanceof WildcardProperty
})


example("parse: @json {*:'value'} > OP[WP[value]]", function () {
  return parse({ '*': 'value' })
    .properties[0]
    .value === 'value'
})


example("parse: @json {*:'value',other:23} > OP[WP,EP]", function () {
  var properties = parse({ '*': 'value', other: 23 }).properties

  return  properties[0] instanceof WildcardProperty &&
          properties[1] instanceof ExactProperty
})


example("parse: @json {'!prop':'value'} > OP[N[EP]]", function () {
  return parse({ '!prop': 'value' })
    .properties[0]
    .matchable instanceof ExactProperty
})


example("parse: @json {'!prop':'value'} > OP[N[EP[prop]]]", function () {
  return parse({ '!prop': 'value' })
    .properties[0]
    .matchable
    .name === "prop"
})


example("parse: @json {'!prop':'value'} > OP[N[EP[,value]]]", function () {
  return parse({ '!prop': 'value' })
    .properties[0]
    .matchable
    .value === "value"
})


example("parse: @json {'!*':'value'} > OP[N[WP]]", function () {
  return parse({ '!*': 'value' })
    .properties[0]
    .matchable instanceof WildcardProperty
})


example("parse: @json {'!*':'value'} > OP[N[WP[value]]]", function () {
  return parse({ '!*': 'value' })
    .properties[0]
    .matchable
    .value === "value"
})
