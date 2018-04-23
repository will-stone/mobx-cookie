/**
 * @file Syncs a cookie's value with a MobX observable, allowing observers to
 * react when it changes.
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

    this._syncTimeout()
  }

  /**
   * Get
   * Use this to observe the value of the cookie
   */
  get() {
    return this.value
  }

  /**
   * Set
   * Set the value (and optional options) of the cookie. Also starts the
   * removal timer if options.expires is set
   * @param {*} value Cookie's value payload
   * @param {Object} options (optional) options to send to js-cookie
   */
  set = action('[MOBX-COOKIE] Set', (value, options) => {
    this._clearTimeout()
    this.value = value
    jsCookie.set(this.name, this.value, options)
    if (options && options.expires) {
      // set _expires_ cookie, so that timer can be synced on reload.
      const expires = this._expiresToDateTime(options.expires)
      jsCookie.set(this.name + '-expires', expires, {
        expires: options.expires
      })
      this._startTimeout(options.expires)
    }
  })

  /**
   * Remove
   * Remove the cookie and reset the observable and timer
   */
  remove = action('[MOBX-COOKIE] Remove', () => {
    this._clearTimeout()
    this.value = undefined
    jsCookie.remove(this.name)
    jsCookie.remove(this.name + '-expires')
  })

  /**
   * Expires To Milliseconds
   * Internal function to convert a js-cookie expires value to milliseconds.
   * @param {string|number} expires - number of days or date-time.
   * @returns {number} - milliseconds
   */
  _expiresToMs(expires) {
    if (typeof expires === 'number') {
      const duration = moment.duration(expires, 'days')
      const ms = duration.asMilliseconds()
      return moment()
        .add(ms, 'ms')
        .diff(moment())
    } else {
      return moment(expires).diff(moment())
    }
  }

  /**
   * Expires To Date Time
   * Internal function to convert a js-cookie expires value to date-time.
   * @param {string|number} expires - number of days or date-time.
   * @returns {string} - date-time.
   */
  _expiresToDateTime(expires) {
    if (typeof expires === 'number') {
      const duration = moment.duration(expires, 'days')
      const ms = duration.asMilliseconds()
      return moment()
        .add(ms, 'ms')
        .format()
    } else {
      return moment(expires).format()
    }
  }

  /**
   * Sync Timeout
   * Internal function to start timer if an _expires_ cookie exists.
   */
  _syncTimeout() {
    const expires = jsCookie.get(this.name + '-expires')
    if (expires) {
      this._startTimeout(expires)
    }
  }

  /**
   * Start Timeout
   * Internal function for creating the cookie expiry timer
   * @param {string|number} - number of days or date-time.
   */
  _startTimeout(expires) {
    const timeoutDuration = this._expiresToMs(expires)
    // start timer
    this._timeout = setTimeout(() => this.remove(), timeoutDuration)
  }

  /**
   * Clear Timeout
   * Internal function for destroying the cookie expiry timer
   */
  _clearTimeout() {
    clearTimeout(this._timeout)
    this._timeout = null
  }
}

export default MobxCookie
