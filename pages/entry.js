'use strict'

var Entry = function (options) {
  this.options = options

  this
    .resolve()
    .render()
}

Entry.prototype.resolve = function () {
  this.objectPattern = OP.parse(this.options.pattern)
  this.targetObject = eval('(' + this.options.target + ')')
  this.result = this.objectPattern.match(this.targetObject)

  return this
}

Entry.prototype.render = function () {
  this.el = document.createElement('article')
  this.el.className = 'entry ' + (this.result ? 'is-success' : 'is-fail')

  this.p = {
    pattern: document.createElement('p'),
    target: document.createElement('p'),
    action: document.createElement('p')
  }

  this.p.pattern.className = 'entry__input'
  this.p.target.className = 'entry__input'
  this.p.action.className = 'entry__action'

  this.p.pattern.textContent = this.options.pattern
  this.p.target.textContent = this.options.target
  this.p.action.textContent = '' + this.result

  this.el.appendChild(this.p.pattern)
  this.el.appendChild(this.p.target)
  this.el.appendChild(this.p.action)

  return this
}

Entry.prototype.show = function () {
  this.el.className += " is-visible"
  this.el.scrollIntoView()
}
