<img src="logo/mobx-cookie2.png" alt="logo" height="120" width="120" align="right" />

# mobx-cookie

Synchronises a cookie's value with a MobX observable, allowing observers to
react to its changes.

# Install

```bash
npm install mobx-cookie # npm v5+
# or
yarn add mobx-cookie
```

# Example

```js
import { action, computed, makeObservable, observable } from 'mobx'
import Cookie from 'mobx-cookie'

class Store {
  cookie = new Cookie('thing')

  constructor() {
    makeObservable(this, {
      cookie: observable,
      timestamp: computed,
      setTimestamp: action,
      unsetTimestamp: action,
    })
  }

  get thing() {
    return this.cookie.value
  }

  setThing = (value) => {
    this.cookie.set(value, { expires: 2 }) // 2 day expiry
  }

  unsetThing = () => {
    this.cookie.remove()
  }
}

const store = new Store()

// console: undefined

store.setThing('testing')

// console: "testing"

store.unsetThing()

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
new Cookie(name)
```

e.g.

```js
@observable cookie = new Cookie('name of cookie in browser')
// or
cookie = new Cookie('name of cookie in browser')
// and decorate
decorate(Store, {
  cookie: observable,
})
```

The observable now has the following methods:

## `value`

Retrieve the value of the cookie stored in this observable

```js
this.cookie.value // when cookie is updated, this will update too.
```

## `set(value[, options])`

Set the value assigned to the observed cookie

```js
this.cookie.set('value')
```

mobx-cookie is essentially a wrapper around the
[js-cookie](https://github.com/js-cookie/js-cookie) package. Any options set as
the second argument (as an object) will be passed to js-cookie.

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

MIT. See the
[LICENSE](https://github.com/will-stone/mobx-cookie/blob/master/LICENSE) file
for more information.

# Credits

Thanks go to the creators of the dependency,
[js-cookie](https://github.com/js-cookie/js-cookie), and of course to
[Michel Weststrate](https://github.com/mweststrate) for
[MobX](https://mobx.js.org/).

The logo is comprised of MobX's official logo's background by
[osenvosem](https://github.com/osenvosem) and a cookie icon from
[icons8](https://icons8.com).
