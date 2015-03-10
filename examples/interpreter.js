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

var object = function (source) {
  var buffer = ""
  var deepness = []
  var pattern = new ObjectPattern

  source.split("").forEach(function (character, index) {
    if (character === "," && deepness.length === 0) {
      pattern.properties.push(property(buffer))
      buffer = ""
    }

    else
      buffer += character

    if (character === "(")
      deepness.push({character: "("})

    if (character === ")") {
      if (deepness[deepness.length - 1].character === "(")
        deepness.pop()

      if (deepness.length === 0) {
        pattern.properties.push(property(buffer))
        buffer = ""
      }
    }

    if (character === '"') {
      if (deepness.length > 0 &&
          deepness[deepness.length - 1].character === '"') {
        deepness.pop()

        if (deepness.length === 0) {
          pattern.properties.push(property(buffer))
          buffer = ""
        }
      }

      else
        deepness.push({character: '"'})
    }

    if (character === "'") {
      if (deepness.length > 0 &&
          deepness[deepness.length - 1].character === "'") {
        deepness.pop()

        if (deepness.length === 0) {
          pattern.properties.push(property(buffer))
          buffer = ""
        }
      }

      else
        deepness.push({character: "'"})
    }

    if (index + 1 === source.length && buffer !== "")
      pattern.properties.push(property(buffer))
  })

  return pattern
}

var property = function (source) {
  var buffer        = ""
  var deepness      = 0
  var propertyName  = source.substring(0, source.indexOf(":"))
  var propertyValue = value(source.substring(source.indexOf(":") + 1))

  if (propertyName === "*")
    return new WildcardProperty(propertyValue)

  else if (propertyName.substring(0, 1) === "!")
    return new Negator( propertyName.substring(1) === "*" ?
      new WildcardProperty(propertyValue) :
      new ExactProperty(
        propertyName.substring(1),
        propertyValue ) )

  else
    return new ExactProperty(propertyName, propertyValue)
}

var array = function (source) {
  var pattern = new ArrayPattern
  var termination = false
  var deepness = []
  var buffer = ""
  var list = []

  source.split("").forEach(function (character, index) {
    if (character === "/" && deepness.length === 0 && buffer !== "**") {
      list.push(buffer)
      buffer = ""
    }

    else
      buffer += character

    if (character === "(")
      deepness.push({character: "("})

    if (character === "[")
      deepness.push({character: "["})

    if (character === ")") {
      if (deepness[deepness.length - 1].character === "(")
        deepness.pop()

      if (deepness.length === 0) {
        list.push(buffer)
        buffer = ""
      }
    }

    if (character === "]") {
      if (deepness.length > 0 &&
          deepness[deepness.length - 1].character === "[")
        deepness.pop()

      if (deepness.length === 0) {
        list.push(buffer)
        buffer = ""
      }
    }

    if (character === '"') {
      if (deepness.length > 0 &&
          deepness[deepness.length - 1].character === '"') {
        deepness.pop()

        if (deepness.length === 0) {
          list.push(buffer)
          buffer = ""
        }
      }

      else
        deepness.push({character: '"'})
    }

    if (character === "'") {
      if (deepness.length > 0 &&
          deepness[deepness.length - 1].character === "'") {
        deepness.pop()

        if (deepness.length === 0) {
          list.push(buffer)
          buffer = ""
        }
      }

      else
        deepness.push({character: "'"})
    }

    if (index + 1 === source.length)
      list.push(buffer)
  })

  pattern.matchables = list
    .filter(function (source) {
      return source !== ""
    })
    .map(function (source, index, list) {
      if (source.substring(0, 3) === "**/")
        return new ArrayEllipsis(source.substring(3))

      else if (source === "**")
        return new ArrayEllipsis

      return value(source)
    })

  return pattern
}

var value = function (source) {
  if (source.substring(0, 1) === "/")
    return array(source)

  if (source === "*")
    return new WildcardValue

  if (source.substring(0, 1) === "[" &&
      source.substring(source.length - 1, source.length) === "]")
    return array(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "<" &&
      source.substring(source.length - 1, source.length) === ">")
    return new TypedValue(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "(" &&
      source.substring(source.length - 1, source.length) === ")")
    return object(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === '"' &&
      source.substring(source.length - 1, source.length) === '"')
    return source.substring(1, source.length - 1)

  if (source.substring(0, 1) === "'" &&
      source.substring(source.length - 1, source.length) === "'")
    return source.substring(1, source.length - 1)

  if (source === "true") return true

  if (source === "false") return false

  if (!isNaN(source)) return parseFloat(source)

  return source
}

var Interpreter = function (source) {
  return object(source)
}


example("Interpreter: '' > OP", function () {
  return Interpreter("") instanceof ObjectPattern
})



example("Interpreter: 'key:value' > OP[EP]", function () {
  return Interpreter("key:value")
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'key:value' > OP[EP[key]]", function () {
  return Interpreter("key:value")
    .properties[0]
    .name === "key"
})



example("Interpreter: 'key:value' > OP[EP[,value]]", function () {
  return Interpreter("key:value")
    .properties[0]
    .value === "value"
})



example("Interpreter: '*:value' > OP[WP]", function () {
  return Interpreter("*:value")
    .properties[0] instanceof WildcardProperty
})



example("Interpreter: '*:value,other:23' > OP[WP,EP]", function () {
  var properties = Interpreter("*:value,other:23").properties

  return  properties[0] instanceof WildcardProperty &&
          properties[1] instanceof ExactProperty
})



example("Interpreter: '!prop:value' > OP[N[EP]]", function () {
  return  Interpreter("!prop:value")
    .properties[0]
    .matchable instanceof ExactProperty
})



example("Interpreter: '!prop:value' > OP[N[EP[prop]]]", function () {
  return  Interpreter("!prop:value")
    .properties[0]
    .matchable
    .name === "prop"
})



example("Interpreter: '!prop:value' > OP[N[EP[,value]]]", function () {
  return  Interpreter("!prop:value")
    .properties[0]
    .matchable
    .value === "value"
})



example("Interpreter: '!*:value' > OP[N[WP]]", function () {
  return  Interpreter("!*:value")
    .properties[0]
    .matchable instanceof WildcardProperty
})



example("Interpreter: '!*:value' > OP[N[WP[value]]]", function () {
  return  Interpreter("!*:value")
    .properties[0]
    .matchable
    .value === "value"
})



example("Interpreter: 'something:*' > OP[EP[WV]]", function () {
  return  Interpreter("something:*")
    .properties[0]
    .value instanceof WildcardValue
})



example("Interpreter: 'type:<string>' > OP[EP[TV]]", function () {
  return  Interpreter("type:<string>")
    .properties[0]
    .value instanceof TypedValue
})



example("Interpreter: 'type:<string>' > OP[EP[TV[string]]]", function () {
  return  Interpreter("type:<string>")
    .properties[0]
    .value
    .type === "string"
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP]]", function () {
  return  Interpreter("prop:(object:inside)")
    .properties[0]
    .value instanceof ObjectPattern
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP]]]", function () {
  return  Interpreter("prop:(object:inside)")
    .properties[0]
    .value
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP[object]]]]", function () {
  return  Interpreter("prop:(object:inside)")
    .properties[0]
    .value
    .properties[0]
    .name === "object"
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP[,inside]]]]", function () {
  return  Interpreter("prop:(object:inside)")
    .properties[0]
    .value
    .properties[0]
    .value === "inside"
})



example("Interpreter: 'type:/some/array' > OP[EP[AP]]", function () {
  return  Interpreter("type:/some/array")
    .properties[0]
    .value instanceof ArrayPattern
})



example("Interpreter: 'type:/some/array' > OP[EP[AP[some]]]", function () {
  return  Interpreter("type:/some/array")
    .properties[0]
    .value
    .matchables[0] === "some"
})



example("Interpreter: 'type:/some/array' > OP[EP[AP[/array]]]", function () {
  return  Interpreter("type:/some/array")
    .properties[0]
    .value
    .matchables[1] === "array"
})



example("Interpreter: 'type:/*/array' > OP[EP[AP[WV]]]", function () {
  return  Interpreter("type:/*/array")
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("Interpreter: 'type:/**/array' > OP[EP[AP[AE]]]", function () {
  return  Interpreter("type:/**/array")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/**/array' > OP[EP[AP[AE[array]]]]", function () {
  return  Interpreter("type:/**/array")
    .properties[0]
    .value
    .matchables[0]
    .termination === "array"
})



example("Interpreter: 'type:/**' > OP[EP[AP[AE]]]", function () {
  return  Interpreter("type:/**")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/**' > OP[EP[AP[AE[undefined]]]]", function () {
  return  Interpreter("type:/**")
    .properties[0]
    .value
    .matchables[0]
    .termination === undefined
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[WV]]]", function () {
  return  Interpreter("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[WV]]]", function () {
  return  Interpreter("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,AE]]]", function () {
  return  Interpreter("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[1] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,AE[a]]]", function () {
  return  Interpreter("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[1]
    .termination === "a"
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,,b]", function () {
  return  Interpreter("type:/*/**/a/b")
    .properties[0]
    .value
    .matchables[2] === "b"
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP]]]", function () {
  return  Interpreter("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayPattern
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP]]]", function () {
  return  Interpreter("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0] instanceof ArrayPattern
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP[sub]]]]", function () {
  return  Interpreter("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0]
    .matchables[0] === "sub"
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP[,array]]]]", function () {
  return  Interpreter("a:/[/sub/array]/b")
    .properties[0]
    .value
    .matchables[0]
    .matchables[1] === "array"
})



example("Interpreter: 'a:/[/sub/[/sub]/array]/b' > OP[EP[AP[AP[,AP]]]]", function () {
  return  Interpreter("a:/[/sub/[/sub]/array]/b")
    .properties[0]
    .value
    .matchables[0]
    .matchables[1] instanceof ArrayPattern
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP]]]", function () {
  return  Interpreter("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0] instanceof ObjectPattern
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP]]]]", function () {
  return  Interpreter("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0]
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP[sub]]]]]", function () {
  return  Interpreter("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0]
    .properties[0]
    .name === "sub"
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP[,object]]]]]", function () {
  return  Interpreter("a:/(sub:object)/b")
    .properties[0]
    .value
    .matchables[0]
    .properties[0]
    .value === "object"
})



example("Interpreter: 'a:true' > OP[EP[,true]]", function () {
  return  Interpreter("a:true")
    .properties[0]
    .value === true
})



example("Interpreter: 'a:false' > OP[EP[,false]]", function () {
  return  Interpreter("a:false")
    .properties[0]
    .value === false
})



example("Interpreter: 'a:24' > OP[EP[,24]]", function () {
  return  Interpreter("a:24")
    .properties[0]
    .value === 24
})



example("Interpreter: 'a:24.7' > OP[EP[,24.7]]", function () {
  return  Interpreter("a:24.7")
    .properties[0]
    .value === 24.7
})



example("Interpreter: 'a:-24.7' > OP[EP[,-24.7]]", function () {
  return  Interpreter("a:-24.7")
    .properties[0]
    .value === -24.7
})



example("Interpreter: 'a:\"true\"' > OP[EP[,\"true\"]]", function () {
  return  Interpreter("a:\"true\"")
    .properties[0]
    .value === "true"
})



example("Interpreter: 'a:\"/true/(a:b)\"' > OP[EP[,\"/true/(a:b)\"]]", function () {
  return  Interpreter("a:\"/true/(a:b)\"")
    .properties[0]
    .value === "/true/(a:b)"
})



example("Interpreter: 'a:/true' > OP[AP[true]]", function () {
  return  Interpreter("a:/true")
    .properties[0]
    .value
    .matchables[0] === true
})



example("Interpreter: 'a:/false' > OP[AP[false]]", function () {
  return  Interpreter("a:/false")
    .properties[0]
    .value
    .matchables[0] === false
})



example("Interpreter: 'a:/23' > OP[AP[23]]", function () {
  return  Interpreter("a:/23")
    .properties[0]
    .value
    .matchables[0] === 23
})



example("Interpreter: 'a:/23.2' > OP[AP[23.2]]", function () {
  return  Interpreter("a:/23.2")
    .properties[0]
    .value
    .matchables[0] === 23.2
})



example("Interpreter: 'a:/-23.2' > OP[AP[-23.2]]", function () {
  return  Interpreter("a:/-23.2")
    .properties[0]
    .value
    .matchables[0] === -23.2
})



example("Interpreter: 'a:/\"23\"' > OP[AP[\"23\"]]", function () {
  return  Interpreter("a:/\"23\"")
    .properties[0]
    .value
    .matchables[0] === "23"
})



example("Interpreter: 'a:/\"true\"' > OP[AP[true]]", function () {
  return  Interpreter("a:/\"true\"")
    .properties[0]
    .value
    .matchables[0] === "true"
})



example("Interpreter: 'a:/\"so/th/(go:1)\"' > OP[AP[\"so/th/(go:1)\"]]", function () {
  return  Interpreter("a:/\"so/th/(go:1)\"")
    .properties[0]
    .value
    .matchables[0] === "so/th/(go:1)"
})



example("Interpreter: 'a:'(sogo:/1/2)'' > OP[EP['(sogo:/1/2)']]", function () {
  return  Interpreter("a:'(sogo:/1/2)'")
    .properties[0]
    .value === "(sogo:/1/2)"
})



example("Interpreter: 'a:/'so/th/(go:1)'' > OP[AP['so/th/(go:1)']]", function () {
  return  Interpreter("a:/'so/th/(go:1)'")
    .properties[0]
    .value
    .matchables[0] === "so/th/(go:1)"
})

example("Interpreter: 'a:/<number>' > OP[AP[TV['number']]]")

example("Interpreter: 'a:\"some\\\"thing\"' > OP[EP[\"some\\\"thing\"]]")
