'use strict'

var examples = [
  [ 'property:"value"',
    '{ property: "value" }' ],

  [ 'property:"value"',
    '// Extra properties do not affect the result\n\
{\n  property: "value",\n\
  something: ["extra", { and: "complex" } ]\n}' ],

  [ 'property:*',
    '// Wildcards match anything\n{ property: 12 }' ],

  [ '*:value',
    '// Wildcards can be used in properties\n{ anything: "value" }' ],

  [ '!property:value',
    '// It is possible to negate results\n{ property: "value" }' ],

  [ 'property:<number>',
    '// JSON types can be enforced\n{ property: -7.20 }' ],

  [ '/user/<number>',
    '// Array patterns are built with a path-like syntax\n\
["user", 50]' ],

  [ 'method:GET,path:/articles/*',
    '// Array patterns can be embedded in objects\n\
{\n  method: "GET",\n  path: ["articles", "rest-is-wonderful"]\n\
}' ],

  [ '/**/saturn',
    '// Multiple elements can be matched with ellipsis\n\
["planets", 6, "many-moons", "saturn"]'],

  [ '/**/saturn',
    '// Ellipsis match zero elements as well\n\
["saturn"]'],

  [ '/**/saturn/**/moons',
    '// Ellipsis are non-greedy\n\
["saturn", 62, "moons", "saturn", 62, "moons"]'],

  [ 'userAgent:(os:"linux",browser:"firefox")',
    '// Object structures can be nested\n\
{\n  userAgent: {\n\
    os: "linux",\n    browser: "firefox",\n    device: "tablet"\n  }\n}'],

  [ '/[/users/*]/[/articles/*]',
    '// Array structures can be nested too\n\
[\n  ["users", 60],\n  ["articles", 70]\n]'],
]
