/**
 * @file Syncs a cookie's value with a MobX observable, allowing observers to
 * react to its changes.
 * @author Will Stone
 * @license MIT
 */

// A simple, lightweight JavaScript API for handling browser cookies
import jsCookie from 'js-cookie'

// Simple, scalable state management
import { action, extendObservable } from 'mobx'

// Parse, validate, manipulate, and display dates and times in JavaScript
import moment from 'moment'

class MobxCookie {
  /**
   * @param {*} name cookie's name
   * @param {*} options (optional) options to send to js-cookie
   */
  constructor(name, options) {
    this.name = name // name of set cookie
    this.options = options // options to send to js-cookie
    this._timeout = null // internal timer

    extendObservable(this, {
      value: jsCookie.get(name) // observable to keep in-sync with cookie value
    })
  }

  /**
   * Get
   * use this to observe the value of the cookie
   */
  get() {
    return this.value
  }

  /**
   * Set
   * set the value (and optional options) of the cookie. Also starts the
   * removal timer if options.expires is set
   * @param {*} value Cookie's value payload
   * @param {Object} options (optional) options to send to js-cookie
   */
  set = action('[MOBX-COOKIE] Set', (value, options) => {
    this._clearTimeout()
    this.value = value
    this.options = { ...options }
    jsCookie.set(this.name, this.value, this.options)
    if (this.options.expires) {
      this._startTimeout()
    }
  })

  /**
   * Remove
   * remove the cookie and reset the observable and timer
   */
  remove = action('[MOBX-COOKIE] Remove', () => {
    this._clearTimeout()
    this.value = undefined
    jsCookie.remove(this.name)
  })

  /**
   * Start Timeout
   * internal function for creating the cookie expiry timer
   */
  _startTimeout() {
    let timeoutDuration = 0
    if (typeof this.options.expires === 'number') {
      timeoutDuration = moment()
        .add(this.options.expires, 'days')
        .diff(moment())
    } else {
      timeoutDuration = moment(this.options.expires).diff(moment())
    }
    this._timeout = setTimeout(() => this.remove(), timeoutDuration)
  }

  /**
   * Clear Timeout
   * internal function for destroying the cookie expiry timer
   */
  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }
}

export default MobxCookie
