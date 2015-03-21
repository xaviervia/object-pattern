var parse   = require("./object-pattern").parse
var example = require("washington")


example("@match: method:GET,resource:/users/*", function () {
  return parse(
    "method:GET,resource:/users/*"
  )

  .match(
    {
      method: "GET",
      resource: ["users", "linus"]
    }
  ) === true
})


example("@not-match: method:GET,resource:/users/*", function () {
  return parse(
    "method:GET,resource:/users/*"
  )

  .match(
    {
      method: "POST",
      resource: ["users", "linus"]
    }
  ) === false
})


example("@match: /**/linus", function () {
  return parse(
    "/**/linus"
  )

  .match(
    ["articles", 1523, "editors", "linus"]
  ) === true
})


example("@not-match: /**/linus", function () {
  return parse(
    "/**/linus"
  )

  .match(
    ["articles", 1523, "editors", "lina"]
  ) === false
})


example("@match: value:true", function () {
  return parse(
    "value:true"
  )

  .match(
    {
      value: true,
      irrelevant: "property"
    }
  ) === true
})


example("@not-match: !value:true", function () {
  return parse(
    "!value:true"
  )

  .match(
    {
      value: true,
      irrelevant: "property"
    }
  ) === false
})


example("@match: !value:true", function () {
  return parse(
    "!value:true"
  )

  .match(
    {
      value: false,
      irrelevant: "property"
    }
  ) === true
})


example("@match: numeric:<number>", function () {
  return parse(
    "numeric:<number>"
  )

  .match(
    {
      numeric: 14,
      irrelevant: "property"
    }
  ) === true
})


example("@not-match: numeric:<number>", function () {
  return parse(
    "numeric:<number>"
  )

  .match(
    {
      numeric: "14",
      irrelevant: "property"
    }
  ) === false
})


example("@match: numeric:'<number>'", function () {
  return parse(
    "numeric:'<number>'"
  )

  .match(
    {
      numeric: "<number>",
      irrelevant: "property"
    }
  ) === true
})


example("@match: endpoint:(method:GET,resource:/**)", function () {
  return parse(
    "endpoint:(method:GET,resource:/**)"
  )

  .match(
    {
      endpoint: {
        method: "GET",
        resource: ["23"]
      }
    }
  ) === true
})


example("@match: endpoint:(method:GET,resource:/**/3)", function () {
  return parse(
    "endpoint:(method:GET,resource:/**/3)"
  )

  .match(
    {
      endpoint: {
        method: "GET",
        resource: ["23", 3]
      }
    }
  ) === true
})
