import { inject, observer } from 'mobx-react'
import React from 'react'

const App = ({ store }) => {
  return (
    <div>
      <pre>Cookie: {store.timestamp}</pre>
      <div>
        <button onClick={() => store.setTimestamp(+new Date())}>
          Set cookie to current timestamp
        </button>
      </div>
      <div>
        <button onClick={store.unsetTimestamp}>Remove cookie</button>
      </div>
    </div>
  )
}

export default inject('store')(observer(App))
