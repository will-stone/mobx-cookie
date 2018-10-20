<img src="logo/mobx-cookie2.png" alt="logo" height="120" width="120" align="right" />

# mobx-cookie

Synchronises a cookie's value with a MobX observable, allowing observers to react to its changes.

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
      cookieName: new Cookie('name of cookie')
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

const store = new Store()

// console: undefined

store.setCookie('testing')

// console: "testing"

store.removeCookie()

// console: undefined
```

# Usage

## Import package

```js
import Cookie from 'mobx-cookie'
```

## Instantiate Cookie class

Initialise and set the key name of the cookie

```js
new Cookie(name[, options]) // see set() method for options
```

e.g.

```js
@observable cookie = new Cookie('name of cookie in browser')
// or
constructor() {
  extendObservable(this, {
    cookie: new Cookie('name of cookie in browser')
  })
}
```

The observable now has the following methods:

## `get()`

Retrieve the value of the cookie stored in this observable

```js
this.cookie.get() // when cookie is updated, this will update too.
```

## `set(value[, options])`

Set the value assigned to the observed cookie

```js
this.cookie.set('value')
```

mobx-cookie is essentially a wrapper around the [js-cookie](https://github.com/js-cookie/js-cookie) package. Any options set as the second argument (as an object) will be passed to js-cookie.

e.g.

```js
this.cookie.set('value', { expires: 2 }) // sets cookie to expire in two days.
```

## `remove()`

Removes the cookie from the browser and sets the observable to `undefined`

```js
this.cookie.remove()
```

# License

MIT. See the [LICENSE](https://github.com/will-stone/mobx-cookie/blob/master/LICENSE) file for more information.

# Credits

Thanks go to the creators of the two dependecies, [js-cookie](https://github.com/js-cookie/js-cookie), and of course to [Michel Weststrate](https://github.com/mweststrate) for [MobX](https://mobx.js.org/).

The logo is comprised of MobX's official logo's background by [osenvosem](https://github.com/osenvosem) and a cookie icon from [icons8](https://icons8.com).
