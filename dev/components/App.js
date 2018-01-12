import { inject, observer } from 'mobx-react'
import React from 'react'

import moment from 'moment'

const App = ({ store }) => {
  console.log(store.cookie)
  return (
    <div>
      <div>Cookie: {store.cookie}</div>
      <div>
        <button onClick={() => store.setCookie(moment().format('x'))}>
          change cookie to current timestamp
        </button>
      </div>
    </div>
  )
}

export default inject('store')(observer(App))
