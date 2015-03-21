object-pattern
==============

[![Codeship status](https://codeship.com/projects/168ec210-8ee6-0132-51af-0a0cf4fe8e66/status?branch=master)](https://codeship.com/projects/61105)

Object Pattern structures for Node.js

Matchable
---------

A common parent for all matchables. The interface that they are supposed to
implement (although `Matchable` itself does not) is to expose a `match`
method that returns either `true` or `false`.

WildcardProperty
----------------

Returns `true` if the value of any property is `===` to the assigned value.
`false` otherwise. If initialized with an inheritor of `Matchable` it will
forward the `match` to the matchable instead.

Usage:

```javascript
// Static value property
var wildcardProperty = new WildcardProperty("public"):
wildcardProperty.match({"project": "public"}); // => true

// Matchable
var matchable    = new Matchable();
matchable.match  = function () { return true } ;
wildcardProperty = new WildcardProperty(matchable);
wildcardProperty.match({"property": "value"}); // => true
```

ExactProperty
-------------

Returns `true` if there is a property with the given name which value is
`===` to the assigned value. `false` otherwise.

If initialized with an inheritor of `Matchable` it will
forward the `match` to the matchable, if the property exists.

Usage:

```javascript
// Static value property
var exactProperty = new ExactProperty("project", "public"):
exactProperty.match({"project": "public"}); // => true

// Matchable
var matchable    = new Matchable();
matchable.match  = function () { return true } ;
exactProperty = new ExactProperty("property", matchable);
exactProperty.match({"property": "value"}); // => true

// Matchable but property missing
var matchable    = new Matchable();
matchable.match  = function () { return true };
exactProperty = new ExactProperty("project", matchable);
exactProperty.match({"property": "value"}); // => false
```

Negator
-------

Delegates the matching to the sent matchable and negates the result.

Usage:
```javascript
var matchable = new Matchable();
matchable.match = function () {
  return true;
}

var negator = new Negator(matchable);
negator.match({"here": "ignored"}); // => false
```

ObjectPattern
-------------

Returns the `&&` result of calling the `match` method in each `properties`,
forwarding the argument.

Usage:
```javascript
var property = new ObjectPattern(
  new ExactProperty("public", true),
  new WildcardProperty("value"),
  new ExactProperty("timestamp", 123456789)
)

property.match({
  "public": true,
  "anyProp": "value",
  "timestamp": 123456789
}) // => true
```

WildcardValue
-------------

Returns always `true` except if the argument is `undefined`.

Usage:
```javascript
var wildcardValue = new WildcardValue();
wildcardValue.match("something"); // => true
```

TypedValue
----------

If initialized with a `Function`, returns `true` only if the argument if
`instanceof` the `Function`.

If initialized with the following `String` arguments, it returns `true`:

- **number**: any value that serialized to JSON would be casted into a
  `number` literal.
- **string**: any value that serialized to JSON would be casted into a
  `string` literal.
- **array**: any value that serialized to JSON would be casted into an
  `array` literal.
- **object**: any value that serialized to JSON would be casted into an
  `object` literal.
- **boolean**: any value that serialized to JSON would be casted into
  either `true` or `false`

Usage:

```javascript
var Type = function () {};
var typedValue = new TypedValue(Type);

typedValue.match(new Type()) // => true
```

ArrayPattern
------------

Handles `ArrayMatchable`s, combining their results to return a final
`Boolean` value representing whether the `Array` was or not a match.

Usage:

```javascript
var arrayMatcher = new ArrayPattern(
  new TypedValue( 'number' ),
  'user',
  new WildcardValue(),
  new ArrayEllipsis( 9 )
);

arrayMatcher.match([6, 'user', 9]); // => false
arrayMatcher.match([-56.2, 'user', 'extra', 9]); // => true
```

ArrayMatchable
--------------

A common parent for all descriptors of `Array` components. `ArrayMatchable`s
have a slightly different interface than regular `Matchable`s because they
need to send back the chunk of the Array that wasn't consumed by the current
pattern so that the `ArrayPattern` can forward it to the next
`ArrayMatchable`.

ArrayEllipsis
-------------

The `ArrayEllipsis` represents a variable length pattern, and it's behavior
depends on how it is configured.

1. Passing no arguments to the `ArrayEllipsis` will create a _catch all_
   pattern that will match anything, even no elements at all.
2. Passing any `Matchable` to the `ArrayEllipsis` will cause it to
   sequentially probe each element for a match with the `Matchable`. That
   `Matchable` is called the _termination_ of the ellipsis pattern. If a
   match happens, the `ArrayEllipsis` will stop, return `true` in `matched`
   and the remainings of the `Array` in `unmatched`.

Usage:

```javascript
var arrayEllipsis = new ArrayEllipsis();

var result = arrayEllipsis.match(['element', 2, {}]);
result.matched; // => true
result.unmatched; // => []
```

With termination:

```javascript
var arrayEllipsis = new ArrayEllipsis(new TypedValue('string'));

var result = arrayEllipsis.match([2, 4, 'text', 'extra']);
result.matched; // => true
result.unmatched; // => ['extra']
```

parse
-----

Parses an [OPN (Object Pattern Notation)](https://github.com/xaviervia/sydney/wiki/Object-Pattern-Notation)
string and returns the corresponding pattern structure.

### Usage

```javascript
var parse = require("object-pattern").parse

var pattern = parse("name:*,age:<number>")
pattern.match({
  name: "Alex",
  age: 24
}) // => true
```

For more examples please refer to the [OPN examples](OPN.js)
