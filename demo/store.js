import { action, decorate, observable, computed } from 'mobx'
import Cookie from '../src/mobx-cookie'

class Store {
  cookie = new Cookie('cookie')

  get timestamp() {
    return this.cookie.value
  }

  setTimestamp = value => {
    this.cookie.set(value, { expires: new Date(+new Date() + 10000) })
  }

  unsetTimestamp = () => {
    this.cookie.remove()
  }
}

decorate(Store, {
  cookie: observable,
  timestamp: computed,
  setTimestamp: action,
  unsetTimestamp: action,
})

export default new Store()
