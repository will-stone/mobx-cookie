import { action, computed, extendObservable } from 'mobx'

import Cookie from '../lib/mobx-cookie'

class Store {
  constructor() {
    extendObservable(this, {
      test: new Cookie('test'),
      cookie: computed(() => this.test.get())
    })
  }

  setCookie = action(value => {
    this.test.set(value)
  })
}

export default new Store()
