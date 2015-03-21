// object-pattern
// ==============
//
// [![Codeship status](https://codeship.com/projects/168ec210-8ee6-0132-51af-0a0cf4fe8e66/status?branch=master)](https://codeship.com/projects/61105)
//
// Object Pattern structures for Node.js
//
// Matchable
// ---------
//
// A common parent for all matchables. The interface that they are supposed to
// implement (although `Matchable` itself does not) is to expose a `match`
// method that returns either `true` or `false`.
//
var Matchable = function () {}



// WildcardProperty
// ----------------
//
// Returns `true` if the value of any property is `===` to the assigned value.
// `false` otherwise. If initialized with an inheritor of `Matchable` it will
// forward the `match` to the matchable instead.
//
// Usage:
//
// ```javascript
// // Static value property
// var wildcardProperty = new WildcardProperty("public"):
// wildcardProperty.match({"project": "public"}); // => true
//
// // Matchable
// var matchable    = new Matchable();
// matchable.match  = function () { return true } ;
// wildcardProperty = new WildcardProperty(matchable);
// wildcardProperty.match({"property": "value"}); // => true
// ```
//
var WildcardProperty = function (value) {
  this.value = value
}


WildcardProperty.prototype = new Matchable


WildcardProperty.prototype.match = function (object) {
  if (this.value instanceof Matchable) {
    for (key in object) if (this.value.match(object[key])) return true }

  else {
    for (key in object) if (object[key] === this.value) return true }

  return false
}



// ExactProperty
// -------------
//
// Returns `true` if there is a property with the given name which value is
// `===` to the assigned value. `false` otherwise.
//
// If initialized with an inheritor of `Matchable` it will
// forward the `match` to the matchable, if the property exists.
//
// Usage:
//
// ```javascript
// // Static value property
// var exactProperty = new ExactProperty("project", "public"):
// exactProperty.match({"project": "public"}); // => true
//
// // Matchable
// var matchable    = new Matchable();
// matchable.match  = function () { return true } ;
// exactProperty = new ExactProperty("property", matchable);
// exactProperty.match({"property": "value"}); // => true
//
// // Matchable but property missing
// var matchable    = new Matchable();
// matchable.match  = function () { return true };
// exactProperty = new ExactProperty("project", matchable);
// exactProperty.match({"property": "value"}); // => false
// ```
//
var ExactProperty = function (name, value) {
  this.name   = name
  this.value  = value
}


ExactProperty.prototype = new Matchable


ExactProperty.prototype.match = function (object) {
  if (this.value instanceof Matchable)
    return object[this.name] && this.value.match(object[this.name])

  return object[this.name] && object[this.name] === this.value
}



// Negator
// -------
//
// Delegates the matching to the sent matchable and negates the result.
//
// Usage:
// ```javascript
// var matchable = new Matchable();
// matchable.match = function () {
//   return true;
// }
//
// var negator = new Negator(matchable);
// negator.match({"here": "ignored"}); // => false
// ```
//
var Negator = function (matchable) {
  this.matchable = matchable
}

Negator.prototype = new Matchable

Negator.prototype.match = function (object) {
  return !this.matchable.match(object)
}



// ObjectPattern
// -------------
//
// Returns the `&&` result of calling the `match` method in each `properties`,
// forwarding the argument.
//
// Usage:
// ```javascript
// var property = new ObjectPattern(
//   new ExactProperty("public", true),
//   new WildcardProperty("value"),
//   new ExactProperty("timestamp", 123456789)
// )
//
// property.match({
//   "public": true,
//   "anyProp": "value",
//   "timestamp": 123456789
// }) // => true
// ```
//
var ObjectPattern = function () {
  this.properties = []
  for (var i = 0, j = arguments.length; i < j; i ++)
    this.properties.push(arguments[i])
}

ObjectPattern.prototype = new Matchable


ObjectPattern.prototype.match = function (object) {
  for (var i = 0, j = this.properties.length; i < j; i ++)
    if (!this.properties[i].match(object)) return false

  return true
}



// WildcardValue
// -------------
//
// Returns always `true` except if the argument is `undefined`.
//
// Usage:
// ```javascript
// var wildcardValue = new WildcardValue();
// wildcardValue.match("something"); // => true
// ```
//
var WildcardValue = function () {}

WildcardValue.prototype = new Matchable

WildcardValue.prototype.match = function (object) {
  return object !== undefined
}



// TypedValue
// ----------
//
// If initialized with a `Function`, returns `true` only if the argument if
// `instanceof` the `Function`.
//
// If initialized with the following `String` arguments, it returns `true`:
//
// - **number**: any value that serialized to JSON would be casted into a
//   `number` literal.
// - **string**: any value that serialized to JSON would be casted into a
//   `string` literal.
// - **array**: any value that serialized to JSON would be casted into an
//   `array` literal.
// - **object**: any value that serialized to JSON would be casted into an
//   `object` literal.
// - **boolean**: any value that serialized to JSON would be casted into
//   either `true` or `false`
//
// Usage:
//
// ```javascript
// var Type = function () {};
// var typedValue = new TypedValue(Type);
//
// typedValue.match(new Type()) // => true
// ```
//
var TypedValue = function (type) {
  this.type = type
}


TypedValue.prototype = new Matchable


TypedValue.prototype.match = function (object) {
  switch (this.type) {
    case 'array':
      return JSON.stringify(object).substring(0, 1) === '['
      break;

    case 'boolean':
      return object === true || object === false
      break

    case 'number':
      return JSON.stringify(object) === '' + object
      break

    case 'object':
      return (JSON.stringify(object) || '').substring(0, 1) === '{'
      break

    case 'string':
      return JSON.stringify(object) === '"' + object + '"'
      break

    default:
      return object instanceof this.type
  }
}



// ArrayPattern
// ------------
//
// Handles `ArrayMatchable`s, combining their results to return a final
// `Boolean` value representing whether the `Array` was or not a match.
//
// Usage:
//
// ```javascript
// var arrayMatcher = new ArrayPattern(
//   new TypedValue( 'number' ),
//   'user',
//   new WildcardValue(),
//   new ArrayEllipsis( 9 )
// );
//
// arrayMatcher.match([6, 'user', 9]); // => false
// arrayMatcher.match([-56.2, 'user', 'extra', 9]); // => true
// ```
//
var ArrayPattern = function () {
  this.matchables = []

  for (var i = 0; i < arguments.length; i ++)
    this.matchables.push(arguments[i])
}

ArrayPattern.prototype = new Matchable

ArrayPattern.prototype.match = function (array) {
  if (!(array instanceof Array))
    return false

  if (this.matchables.length === 0 && array.length > 0)
    return false

  else if (this.matchables.length === 0 && array.length === 0)
    return true

  var filteredArray = array
  var result = {}
  var i = 0

  for (; i < this.matchables.length; i ++) {
    if (this.matchables[i] instanceof ArrayMatchable) {
      result = this.matchables[i].match(filteredArray)

      if (result.matched === false)
        return false

      filteredArray = result.unmatched
    }

    else {
      if (filteredArray.length === 0)
        return false

      if (this.matchables[i] instanceof Matchable) {
        if (! this.matchables[i].match(filteredArray[0]) )
          return false
      }

      else if (filteredArray[0] !== this.matchables[i])
        return false

      result.matched = true
      filteredArray  = filteredArray.slice(1)
    }
  }

  return result.matched && filteredArray.length === 0
}



// ArrayMatchable
// --------------
//
// A common parent for all descriptors of `Array` components. `ArrayMatchable`s
// have a slightly different interface than regular `Matchable`s because they
// need to send back the chunk of the Array that wasn't consumed by the current
// pattern so that the `ArrayPattern` can forward it to the next
// `ArrayMatchable`.
//
var ArrayMatchable = function () {}



// ArrayEllipsis
// -------------
//
// The `ArrayEllipsis` represents a variable length pattern, and it's behavior
// depends on how it is configured.
//
// 1. Passing no arguments to the `ArrayEllipsis` will create a _catch all_
//    pattern that will match anything, even no elements at all.
// 2. Passing any `Matchable` to the `ArrayEllipsis` will cause it to
//    sequentially probe each element for a match with the `Matchable`. That
//    `Matchable` is called the _termination_ of the ellipsis pattern. If a
//    match happens, the `ArrayEllipsis` will stop, return `true` in `matched`
//    and the remainings of the `Array` in `unmatched`.
//
// Usage:
//
// ```javascript
// var arrayEllipsis = new ArrayEllipsis();
//
// var result = arrayEllipsis.match(['element', 2, {}]);
// result.matched; // => true
// result.unmatched; // => []
// ```
//
// With termination:
//
// ```javascript
// var arrayEllipsis = new ArrayEllipsis(new TypedValue('string'));
//
// var result = arrayEllipsis.match([2, 4, 'text', 'extra']);
// result.matched; // => true
// result.unmatched; // => ['extra']
// ```
//
var ArrayEllipsis = function (termination) {
  this.termination = termination
}


ArrayEllipsis.prototype = new ArrayMatchable


ArrayEllipsis.prototype.match = function (array) {
  if ( ! this.termination)
    return {
      matched: true,
      unmatched: [] }

  for (var index = 0; index < array.length; index ++) {
    if (this.termination instanceof Matchable) {
      if (this.termination.match(array[index]))
        return {
          matched: true,
          unmatched: array.slice(index + 1) }
    }

    else {
      if (this.termination === array[index])
        return {
          matched: true,
          unmatched: array.slice(index + 1)}
    }
  }

  return {
    matched: false,
    unmatched: []
  }
}


// parse
// -----
//
// Parses an OPN (Object Pattern Notation) string and returns the corresponding
// pattern structure.
//
// ### Usage
//
// ```javascript
// var parse = require("object-pattern").parse
//
// var pattern = parse("name:*,age:<number>")
// pattern.match({
//   name: "Alex",
//   age: 24
// }) // => true
// ```
//
// For more examples please refer to the [OPN examples](OPN.js)
var parse = function (source) {
  if (source === "") return undefined

  if (source.substring(0, 1) === "/")
    return parse.array(source)

  if (source === "*")
    return new WildcardValue

  if (source.substring(0, 1) === "[" &&
      source.substring(source.length - 1, source.length) === "]")
    return parse.array(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "<" &&
      source.substring(source.length - 1, source.length) === ">")
    return new TypedValue(source.substring(1, source.length - 1))

  if (source.substring(0, 1) === "(" &&
      source.substring(source.length - 1, source.length) === ")")
    return parse.object(source.substring(1, source.length - 1))

  if (( source.substring(0, 1) === '"' &&
        source.substring(source.length - 1, source.length) === '"') ||
      ( source.substring(0, 1) === "'" &&
        source.substring(source.length - 1, source.length) === "'"))
    return source
      .substring(1, source.length - 1)
      .split("\\\\")
      .map(function (chunk) { return chunk.replace("\\", "") })
      .join("\\")

  if (source === "true") return true

  if (source === "false") return false

  if (!isNaN(source)) return parseFloat(source)

  if (source.indexOf(":") > -1) return parse.object(source)

  return source
}


parse.array = function (source) {
  var pattern = new ArrayPattern
  var nested = parse.nestedChecker(["/"])
  var buffer = ""
  var list = []

  source.split("").forEach(function (character, index) {
    if (nested(character) && buffer !== "**") {
      list.push(buffer)
      buffer = ""
    }

    else
      buffer += character
  })

  list.push(buffer)

  pattern.matchables = list
    .filter(function (source) {
      return source !== ""
    })
    .map(function (source, index, list) {
      if (source.substring(0, 3) === "**/")
        return new ArrayEllipsis(parse(source.substring(3)))

      else if (source === "**")
        return new ArrayEllipsis

      return parse(source)
    })

  return pattern
}


parse.nestedChecker = function (separators) {
  var stack = []
  var brackets = [["(", ")"], ["[", "]"]]
  var quotes = ["'", '"']
  separators = separators || []

  return function (character) {
    brackets.forEach(function (pair) {
      if (character === pair[0])
        stack.push(pair[0])

      if (character === pair[1] &&
          stack[stack.length - 1] === pair[0])
        stack.pop()
    })

    quotes.forEach(function (quote) {
      if (character === quote) {
        if (stack[stack.length - 1] === quote)
          stack.pop()

        else
          stack.push(quote)
      }
    })

    if (stack.length > 0) return false

    return separators
      .filter(function (separator) { return character === separator })
      .length > 0
  }
}


parse.object = function (source) {
  var buffer = ""
  var nested = parse.nestedChecker([","])
  var deepness = []
  var pattern = new ObjectPattern
  var escaped = false

  source.split("").forEach(function (character, index) {
    if (nested(character) && !escaped) {
      pattern.properties.push(parse.property(buffer))
      buffer = ""
    }

    else
      buffer += character

    escaped = false

    if (character === "\\") escaped = true
  })

  pattern.properties.push(parse.property(buffer))

  return pattern
}


parse.property = function (source) {
  var buffer        = ""
  var deepness      = 0
  var propertyName  = source.substring(0, source.indexOf(":"))
  var propertyValue = parse(source.substring(source.indexOf(":") + 1))

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



module.exports = {
  Matchable: Matchable,
  WildcardProperty: WildcardProperty,
  ExactProperty: ExactProperty,
  Negator: Negator,
  ObjectPattern: ObjectPattern,
  WildcardValue: WildcardValue,
  TypedValue: TypedValue,
  ArrayPattern: ArrayPattern,
  ArrayMatchable: ArrayMatchable,
  ArrayEllipsis: ArrayEllipsis,
  parse: parse
}
