var example = require("washington")
var OP      = require("../object-pattern")



example("toJSON: OP > {}", function () {
  return new OP.ObjectPattern()
    .toJSON() instanceof Object
})



example("toJSON: 'a:b' > {a:'b'}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.ExactProperty('a', 'b')
    )
    .toJSON()['a'],
    'b'
  )
})



example("toJSON: '*:b' > {'*':'b'}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.WildcardProperty('b')
    )
    .toJSON()['*'],
    'b'
  )
})



example("toJSON: '!*:b' > {'!*':'b'}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.Negator(
        new OP.WildcardProperty('b')
      )
    )
    .toJSON()['!*'],
    'b'
  )
})



example("toJSON: 'a:(b:c)' > {'a':{'b':'c'}}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.ExactProperty(
        'a',
        new OP.ObjectPattern(
          new OP.ExactProperty('b', 'c')
        )
      )
    )
    .toJSON().a.b,
    'c'
  )
})



example("toJSON: '*:(b:c)' > {'*':{'b':'c'}}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.WildcardProperty(
        new OP.ObjectPattern(
          new OP.ExactProperty('b', 'c')
        )
      )
    )
    .toJSON()['*'].b,
    'c'
  )
})



example("toJSON: '!*:(b:c)' > {'!*':{'b':'c'}}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.Negator(
        new OP.WildcardProperty(
          new OP.ObjectPattern(
            new OP.ExactProperty('b', 'c')
          )
        )
      )
    )
    .toJSON()['!*'].b,
    'c'
  )
})



example("toJSON: '!a:(b:c)' > {'!a':{'b':'c'}}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.Negator(
        new OP.ExactProperty(
          'a',
          new OP.ObjectPattern(
            new OP.ExactProperty('b', 'c')
          )
        )
      )
    )
    .toJSON()['!a'].b,
    'c'
  )
})



example("toJSON: '*:*' > {'*':'*'}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.WildcardProperty(
        new OP.WildcardValue()
      )
    )
    .toJSON()['*'],
    '*'
  )
})



example("toJSON: 'type:<number>' > {type:'<number>'}", function (done) {
  done(
    new OP.ObjectPattern(
      new OP.ExactProperty(
        'type',
        new OP.TypedValue('number')
      )
    )
    .toJSON().type,
    '<number>'
  )
})



example("toJSON: /a/b > ['a','b']", function (check) {
  check(
    new OP.ArrayPattern(
      'a', 'b'
    ).toJSON()[0], 'a'
  )
})



example("toJSON: c:/a/b > {c:['a','b']}", function (check) {
  check(
    new OP.ObjectPattern(
      new OP.ExactProperty(
        'c',
        new OP.ArrayPattern(
          'a', 'b'
        )
      )
    ).toJSON().c[1], 'b'
  )
})



example("toJSON: c:/a/(g:1) > {c:['a',{'g':1}]}", function (check) {
  check(
    new OP.ObjectPattern(
      new OP.ExactProperty(
        'c',
        new OP.ArrayPattern(
          'a',
          new OP.ObjectPattern(
            new OP.ExactProperty(
              'g', 1
            )
          )
        )
      )
    ).toJSON().c[1].g, 1
  )
})



example("toJSON: c:/a/**/(g:1) > {c:['a','**',{'g':1}]}", function (check) {
  check(
    new OP.ObjectPattern(
      new OP.ExactProperty(
        'c',
        new OP.ArrayPattern(
          'a',
          new OP.ArrayEllipsis(
            new OP.ObjectPattern(
              new OP.ExactProperty(
                'g', 1
              )
            )
          )
        )
      )
    ).toJSON().c[1], '**'
  )
})



example("toJSON: c:/a/**/(g:1) > {c:['a','**',{'g':1}]}", function (check) {
  check(
    new OP.ObjectPattern(
      new OP.ExactProperty(
        'c',
        new OP.ArrayPattern(
          'a',
          new OP.ArrayEllipsis(
            new OP.ObjectPattern(
              new OP.ExactProperty(
                'g', 1
              )
            )
          )
        )
      )
    ).toJSON().c[2].g, 1
  )
})
