var app = undefined

var Demo = function () {
  this.form = new Form(
    document.querySelector('[id="form"]'),
    this
  )

  this.output = new Output(
    document.querySelector('[id="output"]'),
    this
  )

  this.addDemos()
}

Demo.prototype = Object.create(Mediador.prototype)

Demo.prototype.addDemos = function () {
  examples.reverse().forEach(function (example) {
    this.emit('entry.post', example)
  }.bind(this))
}

window.addEventListener('DOMContentLoaded', function () {
    app = new Demo
})
