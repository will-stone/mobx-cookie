import { action, computed, makeObservable, observable } from 'mobx'

import Cookie from '../src/mobx-cookie'

export class Store {
  cookie: Cookie = new Cookie('cookie')

  constructor() {
    makeObservable(this, {
      cookie: observable,
      timestamp: computed,
      setTimestamp: action,
      unsetTimestamp: action,
    })
  }

  get timestamp(): string {
    return this.cookie.value
  }

  setTimestamp(value: string): void {
    this.cookie.set(value, { expires: new Date(Number(new Date()) + 10000) })
  }

  unsetTimestamp(): void {
    this.cookie.remove()
  }
}

export default new Store()
