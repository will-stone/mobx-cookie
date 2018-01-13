import { inject, observer } from 'mobx-react'
import React from 'react'

import moment from 'moment'

const App = ({ store }) => {
  return (
    <div>
      <pre>Cookie: {store.cookie.get()}</pre>
      <div>
        <button onClick={() => store.setCookie(moment().format('x'))}>
          Set cookie to current timestamp
        </button>
      </div>
      <div>
        <button onClick={() => store.removeCookie()}>Remove cookie</button>
      </div>
    </div>
  )
}

export default inject('store')(observer(App))
