// object-pattern
// ==============
//
// ![Codeship status](https://codeship.com/projects/168ec210-8ee6-0132-51af-0a0cf4fe8e66/status?branch=master)
//
// Object Pattern structures for Node.js
//
// Alpha status, documentation is a work in progress.
//
// Matchable
// ---------
//
// A common interface for all matchables. The interface that they are supposed to
// implement is to expose a `match`
// method that returns either `true` or `false`.
//
var Matchable = function (o) {
  (o.tags = o.tags || []).push(Matchable)
  return o
}


// ArrayMatchable
// --------------
//
// A common interface for all descriptors of `Array` components. `ArrayMatchable`s
// have a slightly different interface than regular `Matchable`s because they
// need to send back the chunk of the Array that wasn't consumed by the current
// pattern so that the `arrayPattern` can forward it to the next
// `ArrayMatchable`.
//
var ArrayMatchable = function (o) {
  (o.tags = o.tags || []).push(ArrayMatchable)
  return o
}


// wildcardProperty
// ----------------
//
// Returns `true` if the value of any property of the `object` is `===` to the
// `value`, `false` otherwise. If `value` is a `Function` it will
// forward the value of each of the properties of `object` to that function
// instead and return `true` only if the function returns `true` for some
// property.
//
// Usage:
//
// ```javascript
// // Static value property
// var matchPublich = wildcardProperty("public"):
// matchPublic.match({"project": "public"}); // => true
//
// // Matchable
// var matchable    = {
//   match: function (value) {
//     return value === "some value";
//   },
//   tags: [Matchable]
// }
// var matchSomeValue = wildcardProperty(matchable);
// matchSomeValue({"property": "value"}); // => true
// ```
//
var wildcardProperty = (function (match) {
  return function (value) {
    return {
      value: value,
      match: match,
      tags: [Matchable]
    }
  }
})(function (object) {
  if (this.value.tags && this.value.tags.indexOf(Matchable) > -1) {
    for (key in object) if (this.value.match(object[key])) return true }

  else {
    for (key in object) if (object[key] === this.value) return true }

  return false
})



// exactProperty
// -------------
//
// Returns `true` if there is a property with the given name which value is
// `===` to the assigned value. `false` otherwise.
//
// If initialized with a `Matchable` it will forward the property value to the
// `match` method to the matchable, if the property exists.
//
// Usage:
//
// ```javascript
// // Static value property
// var exactProperty = exactProperty("project", "public"):
// exactProperty.match({"project": "public"}); // => true
//
// // Matchable
// var matchable    = {
//   match: function () { return true },
//   tags: [Matchable]
// }
// exactProperty    = exactProperty("property", matchable);
// exactProperty.match({"property": "value"}); // => true
//
// // Matchable but property missing
// var matchable    = {
//   match: function () { return true },
//   tags: [Matchable]
// }
// exactProperty    = exactProperty("project", matchable);
// exactProperty.match({"property": "value"}); // => false
// ```
//
var exactProperty = (function (match) {
  return function (name, value) {
    return {
      name: name,
      value: value,
      match: match,
      tags: [Matchable]
    }
  }
})(function (object) {
  if (this.value.tags && this.value.tags.indexOf(Matchable) > -1)
    return  object[this.name] &&
            this.value.match(object[this.name])

  return  object[this.name] &&
          object[this.name] === this.value
})



// negator
// -------
//
// Delegates the matching to the sent matchable and negates the result.
//
// Usage:
// ```javascript
// var matchable = {
//   match: function () {
//     return true;
//   },
//   tags: [Matchable]
// }
//
// var negator   = negator(matchable);
// negator.match({"here": "ignored"}); // => false
// ```
//
var negator = (function (match) {
  return function (matchable) {
    return {
      matchable: matchable,
      match: match,
      tags: [Matchable]
    }
  }
})(function (object) {
  return !this.matchable.match(object)
})



// objectPattern
// -------------
//
// Returns the `&&` result of calling the `match` method in each `properties`,
// forwarding the argument.
//
// Usage:
// ```javascript
// var property = objectPattern(
//   exactProperty("public", true),
//   wildcardProperty("value"),
//   exactProperty("timestamp", 123456789)
// )
//
// property.match({
//   "public": true,
//   "anyProp": "value",
//   "timestamp": 123456789
// }) // => true
// ```
//
var objectPattern = (function (match) {
  return function () {
    var properties = []
    var i = 0
    var length = arguments.length

    for (; i < length; i ++)
      properties.push(arguments[i])

    return {
      properties: properties,
      match: match,
      tags: [Matchable]
    }
  }
})(function (object) {
  for (var i = 0, j = this.properties.length; i < j; i ++)
    if (!this.properties[i].match(object)) return false

  return true
})



// wildcardValue
// -------------
//
// Returns always `true` except if the argument is `undefined`.
//
// Usage:
// ```javascript
// var wildcardValue = wildcardValue();
// wildcardValue.match("something"); // => true
// ```
//
var wildcardValue = (function (match) {
  return function () {
    return {
      match: match,
      tags: [Matchable]
    }
  }
})(function (object) {
  return object !== undefined
})



// typedValue
// ----------
//
// If initialized with a `Function`, returns `true` only if the argument is
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
// var typedValue = typedValue(Type);
//
// typedValue.match(new Type()) // => true
// ```
//
var typedValue = (function (match) {
  return function (type) {
    return {
      type: type,
      match: match,
      tags: [Matchable]
    }
  }
})(function (object) {
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
})



// arrayPattern
// ------------
//
// Handles `ArrayMatchable`s, combining their results to return a final
// `Boolean` value representing whether the `Array` was or not a match.
//
// Usage:
//
// ```javascript
// var arrayMatcher = arrayPattern(
//   arrayElement( typedValue( 'number' ) ),
//   'user',
//   arrayWildcard(),
//   arrayEllipsis( 9 )
// );
//
// arrayMatcher.match([6, 'user', 9]); // => false
// arrayMatcher.match([-56.2, 'user', 'extra', 9]); // => true
// ```
//
var arrayPattern = (function (match) {
  return function () {
    var matchables = []

    for (var i = 0; i < arguments.length; i ++)
      matchables.push(arguments[i])

    return {
      matchables: matchables,
      match: match,
      tags: [Matchable]
    }
  }
})(function (array) {
  var filteredArray = undefined
  var result = undefined
  var i = undefined
  var length = undefined

  if (!(array instanceof Array))
    return false

  if (this.matchables.length === 0 && array.length > 0)
    return false

  else if (this.matchables.length === 0 && array.length === 0)
    return true

  filteredArray = array
  result = {}
  i = 0
  length = this.matchables.length

  for (; i < length; i ++) {
    if (this.matchables[i].tags &&
        this.matchables[i].tags.indexOf(ArrayMatchable) > -1) {
      result = this.matchables[i].match(filteredArray)

      if (result.matched === false)
        return false

      filteredArray = result.unmatched
    }

    else {
      if (filteredArray.length === 0)
        return false

      if (filteredArray[0] !== this.matchables[i])
        return false

      result.matched = true
      filteredArray  = filteredArray.slice(1)
    }
  }

  return result.matched && filteredArray.length === 0
})






// arrayElement
// ------------
//
// Encapsulates any Matchable. Forwards the content of the first element
// of the argument `Array` to the `Matchable`'s `match` and returns:
//
// - `"matched"`: the result of `match`
// - `"unmatched"`: the rest of the `Array`
//
// Usage:
//
// ```javascript
// var arrayElement = arrayElement(typedValue('string'));
//
// var result = arrayElement.match(['text', 'extra']);
// result.matched; // => true
// result.unmatched; // => ['extra']
// ```
//
var arrayElement = (function (match) {
  return function (matchable) {
    return {
      matchable: matchable,
      match: match,
      tags: [ArrayMatchable]
    }
  }
})(function (array) {
  return {
    matched: this.matchable.match(array[0]),
    unmatched: array.slice(1)
  }
})



// arrayWildcard
// -------------
//
// Returns `true` unless there is nothing in the `Array`. Removes the first
// element from the `Array`.
//
// Usage:
//
// ```javascript
// var arrayWildcard = new arrayWildcard();
//
// var result = arrayWildcard.match(['anything', 'extra']);
// result.matched; // => true
// result.unmatched; // => ['extra']
// ```
//
var arrayWildcard = (function (match) {
  return function () {
    return {
      match: match,
      tags: [ArrayMatchable]
    }
  }
})(function (array) {
  return {
    matched: array.length > 0,
    unmatched: array.slice(1)
  }
})



// arrayEllipsis
// -------------
//
// The `arrayEllipsis` represents a variable length pattern, and it's behavior
// depends on how it is configured.
//
// 1. Passing no arguments to the `arrayEllipsis` will create a _catch all_
//    pattern that will match anything, even no elements at all.
// 2. Passing any `Matchable` to the `arrayEllipsis` will cause it to
//    sequentially probe each element for a match with the `Matchable`. That
//    `Matchable` is called the _termination_ of the ellipsis pattern. If a
//    match happens, the `arrayEllipsis` will stop, return `true` in `matched`
//    and the remainings of the `Array` in `unmatched`.
//
// Usage:
//
// ```javascript
// var ellipsis = arrayEllipsis();
//
// var result = arrayEllipsis.match(['element', 2, {}]);
// result.matched; // => true
// result.unmatched; // => []
// ```
//
// With termination:
//
// ```javascript
// var ellipsis = arrayEllipsis(typedValue('string'));
//
// var result = ellipsis.match([2, 4, 'text', 'extra']);
// result.matched; // => true
// result.unmatched; // => ['extra']
// ```
//
var arrayEllipsis = (function (match) {
  return function (termination) {
    return {
      termination: termination,
      match: match,
      tags: [ArrayMatchable]
    }
  }
})(function (array) {

  if ( ! this.termination)
    return {
      matched: true,
      unmached: [] }

  for (var index = 0; index < array.length; index ++) {
    if (this.termination.tags && this.termination.tags.indexOf(Matchable) > -1) {
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
})


module.exports = {
  Matchable: Matchable,
  ArrayMatchable: ArrayMatchable,
  arrayElement: arrayElement,
  arrayEllipsis: arrayEllipsis,
  arrayPattern: arrayPattern,
  arrayWildcard: arrayWildcard,
  exactProperty: exactProperty,
  negator: negator,
  objectPattern: objectPattern,
  typedValue: typedValue,
  wildcardProperty: wildcardProperty,
  wildcardValue: wildcardValue
}
