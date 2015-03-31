// Mediador
// ========
//
// [ ![Codeship Status for xaviervia/mediador](https://codeship.io/projects/1b988be0-ebb2-0131-3c3b-4ebb653f9bc0/status)](https://codeship.io/projects/26547)
//
// Event venue built as a mixin.
//
// Installation
// ------------
//
// ```
// npm install mediador --save
// ```
//
// ### Browser and RequireJS
//
// Mediador is also available for the browser and
// [RequireJS](http://requirejs.org/). You can install it with `bower`.
//
// ```
// bower install mediador --save
// ```
//
// Usage
// -----
//
// ### Instance
//
// `emit` maps each element in the second argument array as an argument to
// send to the listener function.
//
// ```javascript
// var Mediador = require("mediador")
//
// var mediador = new Mediador
//
// mediador.on("event", function (text) {
//   console.log("event emitted with arg: " + text)
// })
//
// mediador.emit("event", ["hello"])
// ```
//
// ### Mixin: Inheriting on/emit
//
// ```javascript
// var Mediador = require("mediador")
//
// var YourClass = function () {}
// YourClass.prototype.on      = Mediador.prototype.on
// YourClass.prototype.emit = Mediador.prototype.emit
//
// var yourInstance = new YourClass()
//
// yourInstance.on("event", function (you) {
//   console.log(you + " already firing events!")
// })
//
// yourInstance.emit("event", ["Me"])
// ```
//
// The simplest way to use Mediador is to make instances, but it is not the
// recommended way.
//
// Mediador is a [**mixin**](https://en.wikipedia.org/wiki/Mixin). The idea is
// that you can add its methods to the prototypes or objects that you want to
// amplify with events, without having to make them inherit directly from
// Mediador.
//
// The events are stored in the `listeners` property within the emitter
// object, in this case `yourInstance`.
//
// Bear this in mind so to not accidentally override the property.
//
// You can find these examples in the [`examples`](examples) folder in this
// repo. You can run them without installing `mediador` by running `npm link`
// on the repo folder (may require `sudo`).
//
// ### Off with the listener
//
// ```javascript
// var Mediador = require("mediador")
//
// var YourClass = function () {}
// YourClass.prototype.on      = Mediador.prototype.on
// YourClass.prototype.off     = Mediador.prototype.off
// YourClass.prototype.emit = Mediador.prototype.emit
//
// var yourInstance = new YourClass()
// var listener     = function (you) {
//   console.log(you + " already firing events!")
// }
//
// yourInstance.on("event", listener)
//
// yourInstance.emit("event", ["Me"])
//
// yourInstance.off("event", listener)
//
// // Will do nothing
// yourInstance.emit("event", ["Nothing"])
// ```
//
// ### You can add the methods directly in an object
//
// ```javascript
// var Mediador     = require("mediador")
// var emitter      = {}
//
// emitter.on       = Mediator.prototype.on
// emitter.emit  = Mediator.prototype.emit
//
// emitter.on("event", function (text) {
//   console.log(text)
// })
//
// emitter.emit("event", ["Hello World"])
// ```
//
// ### The emitter is sent as argument
//
// The event emitter is always sent to the listener functions
// as the last argument.
//
// This is crucial, because otherwise in the contexts of many listeners there
// would be no available references to the emitter–the emitter would be
// unreachable. The emitter is needed for listeners to be able to emit
// further events in it–in fact, that might be the only way for a listener to
// pass information forward.
//
// > Another strategy to make the emitter available for the listeners would be
// > to bind the listener to `this`, `this` being the emitter object. I
// > really don't like when libraries do that.
//
// ```javascript
// var Mediador = require("mediador")
//
// var YourClass = function () {}
// YourClass.prototype.on      = Mediador.prototype.on
// YourClass.prototype.off     = Mediador.prototype.off
// YourClass.prototype.emit = Mediador.prototype.emit
//
// var yourInstance = new YourClass()
//
// yourInstance.on("event", function (irrelevant, emitter) {
//   emitter.emit("completed")
// })
//
// yourInstance.on("completed", function () {
//   console.log("The 'event' was successfully emited and 'completed' too")
// })
//
// yourInstance.emit("event", ["something irrelevant"])
// ```
//
// ### It also works in bulk
//
// ```javascript
// var Mediador = require("mediador")
//
// var YourClass = function () {}
// YourClass.prototype.on      = Mediador.prototype.on
// YourClass.prototype.off     = Mediador.prototype.off
// YourClass.prototype.emit    = Mediador.prototype.emit
//
// var yourInstance = new YourClass()
//
// var subscriptionSet = {
//   event: function () {
//     console.log("Called the event")
//   }
// }
//
// yourInstance.on(subscriptionSet)
//
// yourInstance.emit("event")
//
// yourInstance.off(subscriptionSet)
// ```
//
// #### What is the `subscriptionSet`?
//
// **Mediador** introduces the concept of an `subscriptionSet`, that is just an
// object where every property method will be added as a listener in the
// emitter. For example, if the set has a `read` method, its function will
// be added as a listener for the `read` event in the emitter.
//
// This is very useful both for adding events in bulk and for removing them.
// **Mediador** provides support for both operations in the `on` and `off`
// methods.
//
// ### Why does Mediador inserts the `subscriptions` property?
//
// This is a question about namespace pollution.
//
// When you add a subscription using the `on` method, Mediador adds the
// subscription to the `subscriptions` property of the object, which will be
// _created_ if not present and used as it is if present. Mediador uses the
// `subscription` property without checking for the property's type. The
// property may well have been written by another function not related to
// Mediador. Is this OK?
//
// The thing is, there are several strategies to avoid name collision within an
// object, and most of them involve encapsulating the library specific data
// in a private data object or using some kind of namespace (such a as
// naming the property `mediator_subscriptions` or `_subscriptions`).
// I don't favor this approach because:
//
// 1. Are you really planning on using several event libraries on the same
//    object?
// 2. Will you gladly use a library that extends your object blindfolded and
//    risk name collision anyways?
// 3. Why closing the door to interacting with the properties set by the
//    library? You may very well wish to modify or query the `subscriptions` set.
//
// In other words, I consider that using lightly a library _that extends your
// objects_ is a poor design choice. **Mediador** and other libraries of
// its kind should be considered part of your design and taken for what they
// are: tested, encapsulated and standardized methods to achieve certain
// behaviors that are useful only because they save you _time_.
//
// ### Why is there no `once` method?
//
// Remember:
//
// ```javascript
// // You can name an anonymous function to call it from within
// // You can totally do this:
// mediador.on("fire", function notAnonymousAnymore() {
//   mediador.off("fire", notAnonymousAnymore)
//   console.log("The 'fire' event was called")
// })
// ```
//
// > Corollary: EventEmitter's `once` method is not required. Keep your APIs
// > simple.
//

"use strict";

(function (name, definition) {

  //! AMD
  if (typeof define === 'function')
    define(definition)

  //! Node.js
  else if (typeof module !== 'undefined' && module.exports)
    module.exports = definition()

  //! Browser
  else {
    var theModule = definition(), global = window, old = global[name];

    theModule.noConflict = function () {
      global[name] = old;
      return theModule;
    }

    global[name] = theModule
  }

})('Mediador', function () {

  var Mediador = function () {}

  // Mediador.prototype.on
  // ---------------------
  //
  // ### on( endpoint, callback [, context [, subscriptionClass ] ] )
  //
  // Creates an stores a subscription object, passing the `endpoint`, `callback`,
  // `context` and the current venue (`this`) to the subscription's constructor.
  //
  // By default Mediador uses it's own Subscription type, which takes any kind
  // of `endpoint` as argument and makes an equality comparison with the `event`
  // to decide whether to emit itself or not. The most common use case of this
  // Subscription type is to use `String`s as `endpoints` and `events`: used in
  // that way, Mediador has close compatibility with Node's `EventEmitter`.
  //
  // The Subscription type can be overriden however, by calling
  // `registerSubscription` in the Mediador instance or in the `prototype` of a
  // Mediador descendant. Once overriden, the behaviour depends on the
  // implementation of the registered type.
  //
  // If provided, the `subscriptionClass` function will be used to create the
  // instances instead of searching for one for the current object or the parent.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `String` endpoint
  // - `Function` callback
  // - _optional_ `Object` context
  // - _optional_ `Function` subscriptionClass
  //
  // #### Returns
  //
  // - `Mediador` this
  //
  // ### on( subscriptionSet )
  //
  // If `on` is called with only one argument that is an object, the argument
  // will be assumed to be a `subscriptionSet`. A `subscriptionSet` is a way to
  // create subscriptions in bulk: each property of the set that has a `Function`
  // as value will be used to create a subscription:
  //
  // - The property name will be used as the `endpoint`
  // - The `Function` will be used as the `callback`
  // - The object itself will be used as `context`
  //
  // The subscription type in usage should be capable of dealing with `String`
  // endpoints, so this feature is not useful if the `Subscription` requires
  // endpoints of a different type.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `Object` subscriptionSet
  //
  // #### Returns
  //
  // - `Mediador` this
  //
  Mediador.prototype.on = function (endpoint, callback, context, subscriptionClass) {

    //! If callback, register the subscription normally
    if (callback) {

      //! Defensively create the subscriptions array
      this.subscriptions = this.subscriptions || []

      //! If not subscriptionClass was provided,
      //! use the one for this venue
      //! or the one for the prototype of this
      //! or the default one
      subscriptionClass = subscriptionClass ||
        Mediador.getSubscriptionClassFor(this) ||
        Mediador.getSubscriptionClassFor(this.__proto__) ||
        Mediador.getSubscriptionClassFor()

      //! Create the subscription and add it to the array
      this.subscriptions.push(
        new subscriptionClass(endpoint, callback, context, this) )

    }

    //! If there is no callback, treat the first argument as subscriptionsSet
    else {

      //! For each property which is a Function, create a subscription using
      //! key as endpoint, method as callback and the set as context
      for (var key in endpoint)
        if (endpoint[key] instanceof Function)
          this.on(key, endpoint[key], endpoint)

    }

    //! Return this for chainability
    return this

  }

  // Mediador.prototype.emit
  // --------------------------
  //
  // ### emit( args )
  //
  // Notifies all the subscriptions about the emission. Each subscription may
  // decide to fire the callback or not.
  //
  // To notify the subscriptions, is fires the `notify` method of the
  // subscription passing all the `arguments` plus `this`, the venue, as the
  // last argument.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `Object` _default arguments object_
  //
  // #### Returns
  //
  // - `Mediador` this
  //
  Mediador.prototype.emit = function () {
    var index, length, args;

    //! Defensive reading of subscriptions
    if (this.subscriptions && this.subscriptions instanceof Array) {

      //! Add this to the arguments array
      args = []
      for (index = 0, length = arguments.length; index < length; index ++)
        args.push(arguments[index])
      args.push(this)

      //! Iterate the subscriptions and notify them
      for (index = 0, length = this.subscriptions.length;
        index < length; index ++)
        this.subscriptions[index].notify.apply(this.subscriptions[index], args)

    }

    //! Return this for chainability
    return this

  }

  // Mediador.prototype.off
  // ----------------------
  //
  // ### off( endpoint, callback [, context [, subscriptionClass ] ] )
  //
  // Removes the subscription that matches the provided `endpoint`, `callback`
  // and, if provided, `context` and `subscriptionClass`. By default (using the
  // default `Mediador.Subscription`) it removes the subscription which
  // `endpoint` is equal to the provided one and has the same `context` and
  // `callback`. The `endpoint` is typically a `String`, such as `"event"`, and
  // consequently the behavior will be the same as Node `EventEmitter`'s. If
  // the subscription class has been overrided, the behavior may vary.
  //
  // The `off` method relies on the subscription object's `match` method to
  // decide whether or not there is a match between the subscription and the
  // provided arguments.
  //
  // If `subscriptionClass` is provided, it checks the type of the subscription
  // and only if it matches, it passes all the other arguments to the `match`
  // function. If no `subscriptionClass` is provided, it passes all arguments
  // to `match`. The venue itself (`this`) will also be passed to the `match`
  // method, as the last argument.
  //
  // If `match` returns true, the subscription will be removed from the
  // `subcriptions` `Array`. Any amount of subscriptions may be removed.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `Object` endpoint
  // - `Function` callback
  // - _optional_ `Object` context
  // - _optional_ `Function` subscriptionClass
  //
  // #### Returns
  //
  // - `Mediador` this
  //
  // ### off( subscriptionSet )
  //
  // If `off` is called with only one argument that is an object, the argument
  // will be assumed to be a `subscriptionSet`. A `subscriptionSet` is a way to
  // manage subscriptions in bulk: each property of the set that has a `Function`
  // as value will be used by `off` to remove a subscription:
  //
  // - The property name will be used as the `endpoint`
  // - The `Function` will be used as the `callback`
  // - The object itself will be used as `context`
  //
  // The subscription type in usage should be capable of dealing with `String`
  // endpoints, so this feature is not useful if the `Subscription` requires
  // endpoints of a different type.
  //
  // Chainable.
  //
  // #### Arguments
  //
  // - `Object` subscriptionSet
  //
  // #### Returns
  //
  // - `Mediador` this
  //
  Mediador.prototype.off = function (endpoint, callback, context, subscriptionClass) {

    //! If there is a callback, proceed normally
    if (callback) {

      //! Iterate the subscriptions
      var index = 0
      var length = this.subscriptions.length
      var keep = []
      while (index < length) {

        //! If there is a subscriptionClass arguments and the current subscription
        //! is of not of that type, add to keep directly
        if (subscriptionClass && !(this.subscriptions[index] instanceof subscriptionClass))
            keep.push(this.subscriptions[index])

        //! Try to match the arguments to the current subscription, add to the keep
        //! Array if it doesn't match
        else
          if (!this.subscriptions[index].match(endpoint, callback, context, this))
            keep.push(this.subscriptions[index])

        index ++

      }

      //! Replace the subscriptions array with the filtered one
      this.subscriptions = keep

    }

    //! Otherwise, treat the first argument as a subscriptions set
    else {

      //! For each method of the subscriptions set, try to remove it
      for (var key in endpoint)
        if (endpoint[key])
          this.off(key, endpoint[key], endpoint)

    }

    //! Chainability
    return this

    //!
    //! //!! If there is no callback assumed to be an eventHash
    //! if (!callback) {
    //!
    //!   //!! For each key in the hash
    //!   for (var key in event)
    //!
    //!     //!! If the property named with the key is a function
    //!     if (event[key] instanceof Function)
    //!
    //!       //!! ...remove the function from the listeners' list of the event
    //!       //!! named after the key
    //!       this.off(key, event[key])
    //!
    //! }
    //!
    //! //!! If there is a callback this is removing a single event listener
    //! else
    //!
    //!   //!! Check that everything is in place.
    //!   if (this.listeners && this.listeners instanceof Object &&
    //!       this.listeners[event] instanceof Array &&
    //!       this.listeners[event].length > 0) {
    //!
    //!       //!! Filter out the callback in an extremely painful way due to IE 8-
    //!       var iterator  = 0
    //!       var index     = null
    //!       var max       = this.listeners[event].length
    //!
    //!       while (index === null && iterator < max) {
    //!
    //!         if (this.listeners[event][iterator].callback === callback)
    //!           index = iterator
    //!
    //!         iterator ++
    //!       }
    //!
    //!       //!! Maybe the callback wasn't there in the first place
    //!       if (index !== null)
    //!
    //!         //!! If the callback was found, remove it.
    //!         this.listeners[event].splice(index, 1)
    //!
    //!   }
    //!
    //! //!! Returns this for chainability
    //! return this

  }



  // Mediador.prototype.registerSubscription
  // ---------------------------------------
  //
  // ### registerSubscription( subscriptionClass )
  //
  // Registers the given subscription class as the one to be used with this
  // object. Chainable
  //
  // #### Arguments
  //
  // - `Function` subscriptionClass
  //
  // #### Returns
  //
  // - `Mediador` this
  //
  Mediador.prototype.registerSubscription = function (subscriptionClass) {

    //! Pass the arguments to Mediador
    Mediador.registerSubscriptionClassFor(this, subscriptionClass)

    //! Chainability
    return this

  }



  // Mediador.getSubscriptionClassFor
  // --------------------------------
  //
  // ### getSubscriptionClassFor( target )
  //
  // Returns the subscription class (`Function`) to be instantiated for the
  // provided `target`.
  //
  // #### Arguments
  //
  // - `Object` target
  //
  // #### Returns
  //
  // - `Function` function
  //
  Mediador.getSubscriptionClassFor = function (target) {
    var i        = 0

    //! Be defensive about the length of an Array that may not exist
    var length   = Mediador.subscriptionClasses instanceof Array ?
      Mediador.subscriptionClasses.length : 0

    //! Iterate the subscriptionClasses
    while (i < length) {
      if (Mediador.subscriptionClasses[i].target === target)
        return Mediador.subscriptionClasses[i].subscriptionClass

      i ++
    }

  }

  // Mediador.registerSubscriptionClassFor
  // -------------------------------------
  //
  // ### registerSubscriptionClassFor( target, subscriptionClass )
  //
  // Registers the passed `subscriptionClass` as to be used for the `target`.
  //
  // If the `target` is `null`, it overrides the default.
  //
  // #### Arguments
  //
  // - `Object` target
  // - `Function` subscriptionClass
  //
  Mediador.registerSubscriptionClassFor = function (target, subscriptionClass) {

    //! Prepare a record with the target and the class
    var record  = { target: target, subscriptionClass: subscriptionClass }
    var i       = 0
    var length  = undefined
    var found   = false

    //! Make sure that the subscriptionClasses property exists
    Mediador.subscriptionClasses = Mediador.subscriptionClasses || []

    //! Cache the length
    length = Mediador.subscriptionClasses.length

    //! Iterate the classes. Break if found
    while (i < length && !found) {

      //! If the target already has a class assigned, overwrite
      if (Mediador.subscriptionClasses[i].target === target) {
        Mediador.subscriptionClasses[i].subscriptionClass = subscriptionClass
        found = true
      }

      i ++
    }

    //! If the target is new, add record
    if (!found)
      Mediador.subscriptionClasses.push(record)
  }


  // Mediador.createSubscriptionFor
  // ------------------------------
  //
  // ### createSubscriptionFor( target, endpoint, callback, context )
  //
  // Creates and returns a subscription from the class corresponding to the
  // `target`, forwarding the `endpoint`, `callback` and `context` to the
  // constructor.
  //
  // #### Arguments
  //
  // - `Object` target
  // - `Object` endpoint
  // - `Function` callback
  // - `Object` object
  //
  // #### Returns
  //
  // - `Object` subscription
  //
  Mediador.createSubscriptionFor = function (target, endpoint, callback, context) {
    return new (Mediador.getSubscriptionClassFor(target))(
      endpoint, callback, context)
  }




  // Mediador.Subscription
  // ---------------------
  //
  // **Mediador.Subscription** is the default subscription object for Mediador.
  // Mediador con be configured to use different subcription objects as long
  // as they expose the same interface:
  //
  // - `new <subscription>(endpoint, callback, context)`:
  //   - the `endpoint` is the object that represents the type of events to
  //     which this subscription is bound. In the default subscription the
  //     `endpoint` is always of type `String`, but it can be anything in other
  //     implementations.
  //   - the `callback` is a `Function` that will be executed then the
  //     subscription is invoked.
  //   - the `context` is an object that will be used as `this` when running the
  //     `callback`.
  Mediador.Subscription = function (endpoint, callback, context) {
    this.endpoint = endpoint
    this.callback = callback
    this.context  = context
  }


  // - `.notify(event [, arguments [, venue] ]) : Boolean`:
  //   - the subscription object should contain a method called `notify` that
  //     receives an `event` of the appropiate type as the first argument
  //     (type `String` in the default Subscription) and an `Array` of arguments
  //     as the second argument. The Subscription object is responsible of
  //     matching the event to it's own endpoint to find out whether it should
  //     invoke the callback or not. The notify event should return a Boolean
  //     with the result of the matching: `true` if the callback was fired,
  //     `false` if not.
  //     The `venue` is an optional argument that in the default Subscription
  //     object is forwarded as the last argument to the callback.
  Mediador.Subscription.prototype.notify = function (event, args, venue) {
    if (this.endpoint !== event) return false

    this.callback
      .apply(
        this.context,
        (Object.prototype.toString.call(args) === '[object Array]' ? args : [])
          .concat([arguments[arguments.length - 1]]))

    return true
  }

  // - `.match(event, callback) : Boolean`:
  //   - the subscription object should also contain a method called `match` that
  //     returns whether or not the subscription matches the `event`/`callback`
  //     pair sent. It returns a Boolean. This method is used by the venue to
  //     be able to detach subscriptions while delegating the matching procedure
  //     to the subscription object.
  Mediador.Subscription.prototype.match = function (event, callback) {
    return this.endpoint === event &&
      this.callback === callback
  }

  //! Set Subscription as the default subscriptionClass
  Mediador.registerSubscriptionClassFor(undefined, Mediador.Subscription)

  //! Return Mediador
  return Mediador

})
// Testing
// -------
//
// Then clone the repo and run:
//
// ```
// > npm install
// > make test
// ```
//
// License
// -------
//
// Copyright 2014 Xavier Via
//
// ISC license.
//
// See [LICENSE](LICENSE) attached.
