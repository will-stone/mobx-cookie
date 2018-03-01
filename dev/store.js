import { action, extendObservable } from 'mobx'

import Cookie from '../lib/mobx-cookie'

class Store {
  constructor() {
    extendObservable(this, {
      cookie: new Cookie('cookie')
    })
  }

  setCookie = action('Set cookie', value => {
    const currentTime = new Date()
    const Time = currentTime.setTime(currentTime.getTime() + 1000 * 10)
    this.cookie.set(value, { expires: new Date(Time) })
  })

  removeCookie = action('Remove cookie', value => {
    this.cookie.remove()
  })
}

export default new Store()
