'use strict'

// ==========================================================================
//  PUBLIC
// ==========================================================================
var Form = function (el, app) {
  this.el = el
  this.app = app

  this.render()
}


Form.prototype.render = function () {
  this.input = {
    pattern: this.el.querySelector('[id="input.match.pattern"]'),
    target: this.el.querySelector('[id="input.match.target"]')
  }

  this.form = this.el.querySelector('[id="form.match"]')

  this.bindUIEvents()

  setTimeout( this.updateSize.bind(this), 0)
}


Form.prototype.submit = function () {
  this.app.emit('entry.post', [
    this.input.pattern.value.trim(),
    this.input.target.value.trim()
  ])
}


Form.prototype.updateSize = function () {
  this.input.target.style.height =
    ((this.input.target.value.split("\n").length + 2) * 1.2) + 'rem';

  this.input.pattern.style.height =
    ((this.input.pattern.value.split("\n").length + 2) * 1.2) + 'rem';
}



// ==========================================================================
//  EVENT HANDLERS
// ==========================================================================
Form.prototype.onSubmit = function (e) {
  this.submit()
  e.preventDefault()
}


Form.prototype.onKeyDown = function (e) {
  if (e.keyCode === 13 && e.ctrlKey) {
    this.submit()
    e.preventDefault()
  }

  else setTimeout( this.updateSize.bind(this), 0)
}



// ==========================================================================
//  HELPERS
// ==========================================================================
Form.prototype.bindUIEvents = function () {
  this.form.addEventListener(  'submit', this.onSubmit.bind(this) )
  this.input.pattern.addEventListener(  'keydown', this.onKeyDown.bind(this) )
  this.input.target.addEventListener(   'keydown', this.onKeyDown.bind(this) )
}
