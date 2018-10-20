import { action, decorate, observable, computed } from 'mobx'
import Cookie from '../src/mobx-cookie'

class Store {
  cookie = new Cookie('cookie')

  get timestamp() {
    return this.cookie.value
  }

  setTimestamp = value => {
    const currentTime = new Date()
    const Time = currentTime.setTime(currentTime.getTime() + 1000 * 10)
    this.cookie.set(value, { expires: new Date(Time) })
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
