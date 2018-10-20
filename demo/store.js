import { action, decorate, observable } from 'mobx'
import Cookie from '../src/mobx-cookie'

class Store {
  cookie = new Cookie('cookie')

  setCookie = value => {
    const currentTime = new Date()
    const Time = currentTime.setTime(currentTime.getTime() + 1000 * 10)
    this.cookie.set(value, { expires: new Date(Time) })
  }

  removeCookie = () => {
    this.cookie.remove()
  }
}

decorate(Store, {
  cookie: observable,
  setCookie: action,
  removeCookie: action,
})

export default new Store()
