import {
  action, //autorun,
  extendObservable
} from 'mobx'

import Cookie from '../src/mobx-cookie'

class Store {
  constructor() {
    extendObservable(this, {
      cookie: new Cookie('cookie')
    })

    // autorun('Log cookie', () => {
    //   console.log(this.cookie.get())
    // })
  }

  setCookie = action('Set cookie', value => {
    this.cookie.set(value, { expires: 0.00069445 })
  })

  removeCookie = action('Remove cookie', value => {
    this.cookie.remove()
  })
}

export default new Store()
