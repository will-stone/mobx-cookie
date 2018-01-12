# mobx-cookie

Syncs a cookie's value with a MobX observable, allowing observers to react to its changes

# Install

```bash
yarn add mobx-cookie
# or
npm install mobx-cookie # npm v5+
```

# Example

```js
import { action, autorun, extendObservable } from 'mobx'
import Cookie from 'mobx-cookie'

class Store {
  constructor() {
    extendObservable(this, {
      cookieName: new Cookie('cookieName')
    })

    autorun('Log cookie', () => {
      console.log(this.cookieName.get())
    })
  }

  setCookie = action('Set cookie', value => {
    this.cookieName.set(value, { expires: 2 }) // 2 day expiry
  })

  removeCookie = action('Remove cookie', value => {
    this.cookieName.remove()
  })
}

export default new Store()
```
