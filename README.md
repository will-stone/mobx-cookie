# mobx-cookie
Syncs a cookie's value with a MobX observable, allowing observers to react to its changes

# Example

```js
import { action, computed, extendObservable } from 'mobx'
import Cookie from 'mobx-cookie' // not currently published to NPM, download locally

class Store {
  constructor() {
    extendObservable(this, {
      cookieName: new Cookie('cookieName'),
    })
  }
  
  logCookie = action('Log cookie', () => {
    console.log(this.cookieName.get())
  })
  
  setCookie = action('Set cookie', value => {
    this.cookieName.set(value, {expires: 2}) // 2 day expiry
  })
  
  removeCookie = action('Remove cookie', value => {
    this.cookieName.remove()
  })
}

export default new Store()
```
