/* eslint-disable @typescript-eslint/no-invalid-this -- this is okay in class properties here */
/* eslint-disable no-underscore-dangle -- using underscores to denote internal properties */

/**
 * @file Syncs a cookie's value with a MobX observable, allowing observers to
 * react when it changes.
 * @author Will Stone
 * @license MIT
 */

// A simple, lightweight JavaScript API for handling browser cookies
import * as jsCookie from 'js-cookie'
// Simple, scalable state management
import { action, decorate, extendObservable } from 'mobx'

const DAY_IN_MS = 86400000

class MobxCookie {
  value?: string

  _name: string

  _timeout?: NodeJS.Timeout

  constructor(name: string) {
    // name of set cookie
    this._name = name

    extendObservable(this, {
      // observable to keep in-sync with cookie value
      value: jsCookie.get(name),
    })

    this._syncTimeout()
  }

  /**
   * [DEPRECATED] - Observe the value directly, e.g. store.cookie.value
   * Get
   * Use this to observe the value of the cookie
   */
  get = (): string | undefined => {
    // eslint-disable-next-line no-console
    console.warn(
      `[MOBX-COOKIE] The 'get' method has been deprecated.
      Observe the value directly, e.g. store.cookie.value`,
    )
    return this.value
  }

  /**
   * Set
   * Set the value (and optional options) of the cookie. Also starts the
   * removal timer if options.expires is set
   */
  set = (value: string, options: jsCookie.CookieAttributes = {}): void => {
    this._clearTimeout()
    this.value = value
    jsCookie.set(this._name, this.value, options)
    if (options.expires) {
      // set _expires_ cookie, so that timer can be synced on reload.
      const expires = this._expiresToDateTime(options.expires)
      jsCookie.set(`${this._name}-expires`, expires, {
        expires: options.expires,
      })
      this._startTimeout(options.expires)
    }
  }

  /**
   * Remove
   * Remove the cookie and reset the observable and timer
   */
  remove = (): void => {
    this._clearTimeout()
    this.value = undefined
    jsCookie.remove(this._name)
    jsCookie.remove(`${this._name}-expires`)
  }

  /**
   * Expires To Milliseconds
   * Internal function to convert a js-cookie expires value to milliseconds.
   */
  _expiresToMs = (expires: number | Date): number => {
    if (typeof expires === 'number') {
      return expires * DAY_IN_MS
    }

    const nowInMs = Number(new Date())
    return Number(expires) - nowInMs
  }

  /**
   * Expires To Date Time
   * Internal function to convert a js-cookie expires value to string date-time.
   */
  _expiresToDateTime = (expires: number | Date): string | Date => {
    if (typeof expires === 'number') {
      return new Date(Number(new Date()) + expires * DAY_IN_MS).toString()
    }

    return expires
  }

  /**
   * Sync Timeout
   * Internal function to start timer if an _expires_ cookie exists.
   */
  _syncTimeout = (): void => {
    const expires = jsCookie.get(`${this._name}-expires`)
    if (expires) {
      this._startTimeout(new Date(expires))
    }
  }

  /**
   * Start Timeout
   * Internal function for creating the cookie expiry timer
   */
  _startTimeout = (expires: number | Date): void => {
    const timeoutDuration = this._expiresToMs(expires)
    // start timer
    this._timeout = setTimeout(this.remove, timeoutDuration)
  }

  /**
   * Clear Timeout
   * Internal function for destroying the cookie expiry timer
   */
  _clearTimeout = (): void => {
    if (this._timeout) {
      clearTimeout(this._timeout)
    }

    this._timeout = undefined
  }
}

decorate(MobxCookie, {
  set: action,
  remove: action,
})

export default MobxCookie
