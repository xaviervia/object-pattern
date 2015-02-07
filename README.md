object-pattern
==============

![Codeship status](https://codeship.com/projects/168ec210-8ee6-0132-51af-0a0cf4fe8e66/status?branch=master)

Object Pattern structures for Node.js

Alpha status, documentation is a work in progress.

Matchable
---------

A common interface for all matchables. The interface that they are supposed to
implement is to expose a `match`
method that returns either `true` or `false`.

ArrayMatchable
--------------

A common interface for all descriptors of `Array` components. `ArrayMatchable`s
have a slightly different interface than regular `Matchable`s because they
need to send back the chunk of the Array that wasn't consumed by the current
pattern so that the `arrayPattern` can forward it to the next
`ArrayMatchable`.

wildcardProperty
----------------

Returns `true` if the value of any property of the `object` is `===` to the
`value`, `false` otherwise. If `value` is a `Function` it will
forward the value of each of the properties of `object` to that function
instead and return `true` only if the function returns `true` for some
property.

Usage:

```javascript
// Static value property
var matchPublich = wildcardProperty("public"):
matchPublic.match({"project": "public"}); // => true

// Matchable
var matchable    = {
  match: Matchable(function (value) {
    return value === "some value";
  })
}
var matchSomeValue = wildcardProperty(matchable);
matchSomeValue({"property": "value"}); // => true
```

exactProperty
-------------

Returns `true` if there is a property with the given name which value is
`===` to the assigned value. `false` otherwise.

If initialized with a `Matchable` it will forward the property value to the
`match` method to the matchable, if the property exists.

Usage:

```javascript
// Static value property
var exactProperty = exactProperty("project", "public"):
exactProperty.match({"project": "public"}); // => true

// Matchable
var matchable    = {
  match: Matchable(function () { return true });
}
exactProperty    = exactProperty("property", matchable);
exactProperty.match({"property": "value"}); // => true

// Matchable but property missing
var matchable    = {
  match: Matchable(function () { return true })
}
exactProperty    = exactProperty("project", matchable);
exactProperty.match({"property": "value"}); // => false
```

negator
-------

Delegates the matching to the sent matchable and negates the result.

Usage:
```javascript
var matchable = {
  match: Matchable(function () {
    return true;
  })
}

var negator   = negator(matchable);
negator.match({"here": "ignored"}); // => false
```

objectPattern
-------------

Returns the `&&` result of calling the `match` method in each `properties`,
forwarding the argument.

Usage:
```javascript
var property = objectPattern(
  exactProperty("public", true),
  wildcardProperty("value"),
  exactProperty("timestamp", 123456789)
)

property.match({
  "public": true,
  "anyProp": "value",
  "timestamp": 123456789
}) // => true
```

wildcardValue
-------------

Returns always `true` except if the argument is `undefined`.

Usage:
```javascript
var wildcardValue = wildcardValue();
wildcardValue.match("something"); // => true
```

typedValue
----------

If initialized with a `Function`, returns `true` only if the argument is
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
var typedValue = typedValue(Type);

typedValue.match(new Type()) // => true
```

arrayPattern
------------

Handles `ArrayMatchable`s, combining their results to return a final
`Boolean` value representing whether the `Array` was or not a match.

Usage:

```javascript
var arrayMatcher = arrayPattern(
  arrayElement( typedValue( 'number' ) ),
  'user',
  arrayWildcard(),
  arrayEllipsis( 9 )
);

arrayMatcher.match([6, 'user', 9]); // => false
arrayMatcher.match([-56.2, 'user', 'extra', 9]); // => true
```

arrayElement
------------

Encapsulated any Matchable. Forwards the content of the first element
of the argument `Array` to the `Matchable`'s `match` and returns:

- `"matched"`: the result of `match`
- `"unmatched"`: the rest of the `Array`

Usage:

```javascript
var arrayElement = arrayElement(typedValue('string'));

var result = arrayElement.match(['text', 'extra']);
result.matched; // => true
result.unmatched; // => ['extra']
```

arrayWildcard
-------------

Returns `true` unless there is nothing in the `Array`. Removes the first
element from the `Array`.

Usage:

```javascript
var arrayWildcard = new arrayWildcard();

var result = arrayWildcard.match(['anything', 'extra']);
result.matched; // => true
result.unmatched; // => ['extra']
```

arrayEllipsis
-------------

The `arrayEllipsis` represents a variable length pattern, and it's behavior
depends on how it is configured.

1. Passing no arguments to the `arrayEllipsis` will create a _catch all_
   pattern that will match anything, even no elements at all.
2. Passing any `Matchable` to the `arrayEllipsis` will cause it to
   sequentially probe each element for a match with the `Matchable`. That
   `Matchable` is called the _termination_ of the ellipsis pattern. If a
   match happens, the `arrayEllipsis` will stop, return `true` in `matched`
   and the remainings of the `Array` in `unmatched`.

Usage:

```javascript
var ellipsis = arrayEllipsis();

var result = arrayEllipsis.match(['element', 2, {}]);
result.matched; // => true
result.unmatched; // => []
```

With termination:

```javascript
var ellipsis = arrayEllipsis(typedValue('string'));

var result = ellipsis.match([2, 4, 'text', 'extra']);
result.matched; // => true
result.unmatched; // => ['extra']
```

