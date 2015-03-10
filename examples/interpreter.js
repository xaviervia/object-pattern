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

var value = function (chunk) {

  if (chunk.substring(0, 1) === '"' &&
      chunk.substring(chunk.length - 1, chunk.length) === '"')
    return chunk.substring(1, chunk.length - 1)

  if (chunk.substring(0, 1) === "'" &&
      chunk.substring(chunk.length - 1, chunk.length) === "'")
    return chunk.substring(1, chunk.length - 1)

  if (chunk === "true") return true

  if (chunk === "false") return false

  if (!isNaN(chunk)) return parseFloat(chunk)

  return chunk
}

var Interpreter = function (source) {
  this.pattern = this.object(source)
}


Interpreter.prototype.object = function (source) {
  var buffer = ""
  var deepness = []
  var object = new ObjectPattern

  source.split("").forEach(function (character, index) {
    if (character === "," && deepness.length === 0) {
      object.properties.push(this.property(buffer))
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
        object.properties.push(this.property(buffer))
        buffer = ""
      }
    }

    if (character === '"') {
      if (deepness.length > 0 &&
          deepness[deepness.length - 1].character === '"') {
        deepness.pop()

        if (deepness.length === 0) {
          object.properties.push(this.property(buffer))
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
          object.properties.push(this.property(buffer))
          buffer = ""
        }
      }

      else
        deepness.push({character: "'"})
    }

    if (index + 1 === source.length && buffer !== "")
      object.properties.push(this.property(buffer))
  }.bind(this))

  return object
}


Interpreter.prototype.property = function (source) {
  var buffer        = ""
  var deepness      = 0
  var propertyName  = source.substring(0, source.indexOf(":"))
  var propertyValue = this.value(source.substring(source.indexOf(":") + 1))

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


Interpreter.prototype.value = function (source) {
  if (source === "*")
    return new WildcardValue

  if (source.substring(0, 1) === "<" &&
      source.substring(source.length - 1, source.length) === ">")
    return new TypedValue(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "(" &&
      source.substring(source.length - 1, source.length) === ")")
    return this.object(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "/")
    return this.array(source)

  return value(source)
}


Interpreter.prototype.array = function (source) {
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
    .filter(function (chunk) {
      return chunk !== ""
    })
    .map(function (chunk, index, list) {
      if (chunk === "*")
        return new WildcardValue

      else if (chunk.substring(0, 3) === "**/")
        return new ArrayEllipsis(chunk.substring(3))

      else if (chunk === "**")
        return new ArrayEllipsis

      else if (chunk.substring(0, 1) === "[" &&
          chunk.substring(chunk.length - 1, chunk.length) === "]")
        return this.array(chunk.substring(1, chunk.length - 1))

      else if (chunk.substring(0, 1) === "(" &&
          chunk.substring(chunk.length - 1, chunk.length) === ")")
        return this.object(chunk.substring(1, chunk.length - 1))

      return value(chunk)
    }.bind(this))

  return pattern
}



example("Interpreter: '' > OP", function () {
  return new Interpreter("")
    .pattern instanceof ObjectPattern
})



example("Interpreter: 'key:value' > OP[EP]", function () {
  return new Interpreter("key:value")
    .pattern
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'key:value' > OP[EP[key]]", function () {
  return new Interpreter("key:value")
    .pattern
    .properties[0]
    .name === "key"
})



example("Interpreter: 'key:value' > OP[EP[,value]]", function () {
  return new Interpreter("key:value")
    .pattern
    .properties[0]
    .value === "value"
})



example("Interpreter: '*:value' > OP[WP]", function () {
  return new Interpreter("*:value")
    .pattern
    .properties[0] instanceof WildcardProperty
})



example("Interpreter: '*:value,other:23' > OP[WP,EP]", function () {
  var properties = new Interpreter("*:value,other:23").pattern.properties

  return  properties[0] instanceof WildcardProperty &&
          properties[1] instanceof ExactProperty
})



example("Interpreter: '!prop:value' > OP[N[EP]]", function () {
  return  new Interpreter("!prop:value")
    .pattern
    .properties[0]
    .matchable instanceof ExactProperty
})



example("Interpreter: '!prop:value' > OP[N[EP[prop]]]", function () {
  return  new Interpreter("!prop:value")
    .pattern
    .properties[0]
    .matchable
    .name === "prop"
})



example("Interpreter: '!prop:value' > OP[N[EP[,value]]]", function () {
  return  new Interpreter("!prop:value")
    .pattern
    .properties[0]
    .matchable
    .value === "value"
})



example("Interpreter: '!*:value' > OP[N[WP]]", function () {
  return  new Interpreter("!*:value")
    .pattern
    .properties[0]
    .matchable instanceof WildcardProperty
})



example("Interpreter: '!*:value' > OP[N[WP[value]]]", function () {
  return  new Interpreter("!*:value")
    .pattern
    .properties[0]
    .matchable
    .value === "value"
})



example("Interpreter: 'something:*' > OP[EP[WV]]", function () {
  return  new Interpreter("something:*")
    .pattern
    .properties[0]
    .value instanceof WildcardValue
})



example("Interpreter: 'type:<string>' > OP[EP[TV]]", function () {
  return  new Interpreter("type:<string>")
    .pattern
    .properties[0]
    .value instanceof TypedValue
})



example("Interpreter: 'type:<string>' > OP[EP[TV[string]]]", function () {
  return  new Interpreter("type:<string>")
    .pattern
    .properties[0]
    .value
    .type === "string"
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value instanceof ObjectPattern
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP]]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP[object]]]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value
    .properties[0]
    .name === "object"
})



example("Interpreter: 'prop:(object:inside)' > OP[EP[OP[EP[,inside]]]]", function () {
  return  new Interpreter("prop:(object:inside)")
    .pattern
    .properties[0]
    .value
    .properties[0]
    .value === "inside"
})



example("Interpreter: 'type:/some/array' > OP[EP[AP]]", function () {
  return  new Interpreter("type:/some/array")
    .pattern
    .properties[0]
    .value instanceof ArrayPattern
})



example("Interpreter: 'type:/some/array' > OP[EP[AP[some]]]", function () {
  return  new Interpreter("type:/some/array")
    .pattern
    .properties[0]
    .value
    .matchables[0] === "some"
})



example("Interpreter: 'type:/some/array' > OP[EP[AP[/array]]]", function () {
  return  new Interpreter("type:/some/array")
    .pattern
    .properties[0]
    .value
    .matchables[1] === "array"
})



example("Interpreter: 'type:/*/array' > OP[EP[AP[WV]]]", function () {
  return  new Interpreter("type:/*/array")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("Interpreter: 'type:/**/array' > OP[EP[AP[AE]]]", function () {
  return  new Interpreter("type:/**/array")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/**/array' > OP[EP[AP[AE[array]]]]", function () {
  return  new Interpreter("type:/**/array")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .termination === "array"
})



example("Interpreter: 'type:/**' > OP[EP[AP[AE]]]", function () {
  return  new Interpreter("type:/**")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/**' > OP[EP[AP[AE[undefined]]]]", function () {
  return  new Interpreter("type:/**")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .termination === undefined
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[WV]]]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[WV]]]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof WildcardValue
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,AE]]]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[1] instanceof ArrayEllipsis
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,AE[a]]]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[1]
    .termination === "a"
})



example("Interpreter: 'type:/*/**/a/b' > OP[EP[AP[,,b]", function () {
  return  new Interpreter("type:/*/**/a/b")
    .pattern
    .properties[0]
    .value
    .matchables[2] === "b"
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP]]]", function () {
  return  new Interpreter("a:/[/sub/array]/b")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ArrayPattern
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP]]]", function () {
  return  new Interpreter("a:/[/sub/array]/b")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ArrayPattern
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP[sub]]]]", function () {
  return  new Interpreter("a:/[/sub/array]/b")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .matchables[0] === "sub"
})



example("Interpreter: 'a:/[/sub/array]/b' > OP[EP[AP[AP[,array]]]]", function () {
  return  new Interpreter("a:/[/sub/array]/b")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .matchables[1] === "array"
})



example("Interpreter: 'a:/[/sub/[/sub]/array]/b' > OP[EP[AP[AP[,AP]]]]", function () {
  return  new Interpreter("a:/[/sub/[/sub]/array]/b")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .matchables[1] instanceof ArrayPattern
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP]]]", function () {
  return  new Interpreter("a:/(sub:object)/b")
    .pattern
    .properties[0]
    .value
    .matchables[0] instanceof ObjectPattern
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP]]]]", function () {
  return  new Interpreter("a:/(sub:object)/b")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .properties[0] instanceof ExactProperty
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP[sub]]]]]", function () {
  return  new Interpreter("a:/(sub:object)/b")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .properties[0]
    .name === "sub"
})



example("Interpreter: 'a:/(sub:object)/b' > OP[EP[AP[OP[EP[,object]]]]]", function () {
  return  new Interpreter("a:/(sub:object)/b")
    .pattern
    .properties[0]
    .value
    .matchables[0]
    .properties[0]
    .value === "object"
})



example("Interpreter: 'a:true' > OP[EP[,true]]", function () {
  return  new Interpreter("a:true")
    .pattern
    .properties[0]
    .value === true
})



example("Interpreter: 'a:false' > OP[EP[,false]]", function () {
  return  new Interpreter("a:false")
    .pattern
    .properties[0]
    .value === false
})



example("Interpreter: 'a:24' > OP[EP[,24]]", function () {
  return  new Interpreter("a:24")
    .pattern
    .properties[0]
    .value === 24
})



example("Interpreter: 'a:24.7' > OP[EP[,24.7]]", function () {
  return  new Interpreter("a:24.7")
    .pattern
    .properties[0]
    .value === 24.7
})



example("Interpreter: 'a:-24.7' > OP[EP[,-24.7]]", function () {
  return  new Interpreter("a:-24.7")
    .pattern
    .properties[0]
    .value === -24.7
})



example("Interpreter: 'a:\"true\"' > OP[EP[,\"true\"]]", function () {
  return  new Interpreter("a:\"true\"")
    .pattern
    .properties[0]
    .value === "true"
})



example("Interpreter: 'a:\"/true/(a:b)\"' > OP[EP[,\"/true/(a:b)\"]]", function () {
  return  new Interpreter("a:\"/true/(a:b)\"")
    .pattern
    .properties[0]
    .value === "/true/(a:b)"
})



example("Interpreter: 'a:/true' > OP[AP[true]]", function () {
  return  new Interpreter("a:/true")
    .pattern
    .properties[0]
    .value
    .matchables[0] === true
})



example("Interpreter: 'a:/false' > OP[AP[false]]", function () {
  return  new Interpreter("a:/false")
    .pattern
    .properties[0]
    .value
    .matchables[0] === false
})



example("Interpreter: 'a:/23' > OP[AP[23]]", function () {
  return  new Interpreter("a:/23")
    .pattern
    .properties[0]
    .value
    .matchables[0] === 23
})



example("Interpreter: 'a:/23.2' > OP[AP[23.2]]", function () {
  return  new Interpreter("a:/23.2")
    .pattern
    .properties[0]
    .value
    .matchables[0] === 23.2
})



example("Interpreter: 'a:/-23.2' > OP[AP[-23.2]]", function () {
  return  new Interpreter("a:/-23.2")
    .pattern
    .properties[0]
    .value
    .matchables[0] === -23.2
})



example("Interpreter: 'a:/\"23\"' > OP[AP[\"23\"]]", function () {
  return  new Interpreter("a:/\"23\"")
    .pattern
    .properties[0]
    .value
    .matchables[0] === "23"
})



example("Interpreter: 'a:/\"true\"' > OP[AP[true]]", function () {
  return  new Interpreter("a:/\"true\"")
    .pattern
    .properties[0]
    .value
    .matchables[0] === "true"
})



example("Interpreter: 'a:/\"so/th/(go:1)\"' > OP[AP[\"so/th/(go:1)\"]]", function () {
  return  new Interpreter("a:/\"so/th/(go:1)\"")
    .pattern
    .properties[0]
    .value
    .matchables[0] === "so/th/(go:1)"
})



example("Interpreter: 'a:'(sogo:/1/2)'' > OP[EP['(sogo:/1/2)']]", function () {
  return  new Interpreter("a:'(sogo:/1/2)'")
    .pattern
    .properties[0]
    .value === "(sogo:/1/2)"
})



example("Interpreter: 'a:/'so/th/(go:1)'' > OP[AP['so/th/(go:1)']]", function () {
  return  new Interpreter("a:/'so/th/(go:1)'")
    .pattern
    .properties[0]
    .value
    .matchables[0] === "so/th/(go:1)"
})

example("Interpreter: 'a:\"some\\\"thing\"' > OP[EP[\"some\\\"thing\"]]")
