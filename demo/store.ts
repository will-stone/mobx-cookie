import { makeAutoObservable } from 'mobx'

import Cookie from '../src/mobx-cookie'

export class Store {
  cookie: Cookie = new Cookie('cookie')

  constructor() {
    makeAutoObservable(this)
  }

  get timestamp(): string | undefined {
    return this.cookie.value
  }

  setTimestamp(value: string): void {
    this.cookie.set(value, { expires: new Date(Date.now() + 5000) })
  }

  unsetTimestamp(): void {
    this.cookie.remove()
  }
}

export default new Store()
