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
import { action, extendObservable, makeObservable } from 'mobx'

const DAY_IN_MS = 86_400_000

/**
 * Expires To Milliseconds
 * Internal function to convert a js-cookie expires value to milliseconds.
 */
const expiresToMs = (expires: Date | number): number => {
  if (typeof expires === 'number') {
    return expires * DAY_IN_MS
  }

  const nowInMs = Date.now()
  return Number(expires) - nowInMs
}

/**
 * Expires To Date Time
 * Internal function to convert a js-cookie expires value to string date-time.
 */
const expiresToDateTime = (expires: Date | number): Date | string => {
  if (typeof expires === 'number') {
    return new Date(Date.now() + expires * DAY_IN_MS).toString()
  }

  return expires
}

class MobxCookie {
  value?: string = undefined

  _name: string

  _timeout?: NodeJS.Timeout = undefined

  constructor(name: string) {
    // name of set cookie
    this._name = name

    extendObservable(this, {
      // observable to keep in-sync with cookie value
      value: jsCookie.get(name),
    })

    // Sync Timeout
    // Start timer if an _expires_ cookie exists.
    const expires = jsCookie.get(`${this._name}-expires`)
    if (expires) {
      this._timeout = setTimeout(() => {
        this.remove()
      }, expiresToMs(new Date(expires)))
    }

    makeObservable(this, {
      set: action,
      remove: action,
    })
  }

  /**
   * Set
   * Set the value (and optional options) of the cookie. Also starts the
   * removal timer if options.expires is set
   */
  set(value: string, options: jsCookie.CookieAttributes = {}): void {
    if (this._timeout) {
      clearTimeout(this._timeout)
    }

    this._timeout = undefined
    this.value = value
    jsCookie.set(this._name, this.value, options)
    if (options.expires) {
      // set _expires_ cookie, so that timer can be synced on reload.
      const expires = expiresToDateTime(options.expires)
      jsCookie.set(`${this._name}-expires`, expires, {
        expires: options.expires,
      })
      this._timeout = setTimeout(() => {
        this.remove()
      }, expiresToMs(options.expires))
    }
  }

  /**
   * Remove
   * Remove the cookie and reset the observable and timer
   */
  remove(): void {
    if (this._timeout) {
      clearTimeout(this._timeout)
    }

    this._timeout = undefined
    this.value = undefined
    jsCookie.remove(this._name)
    jsCookie.remove(`${this._name}-expires`)
  }
}

export default MobxCookie
