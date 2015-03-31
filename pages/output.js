'use strict'

var Output = function (el, app) {
  this.el = el
  this.app = app

  this.bindEvents()
}

Output.prototype.bindEvents = function () {
  this.app.on('entry.post', this.onPost, this )
}

Output.prototype.onPost = function (pattern, target) {
  var entry = new Entry({
    pattern: pattern,
    target: target,
    app: this.app
  })

  this.entries = this.entries || []

  if (this.entries.length > 0)
    this.el.insertBefore(
      entry.el, this.entries[this.entries.length - 1].el )

  else
    this.el.appendChild(entry.el)

  setTimeout( entry.show.bind(entry), 100)

  this.entries.push(entry)
}
