import { inject, observer } from 'mobx-react'
import React, { useCallback } from 'react'

import { Store } from '../store'

interface AppProps {
  store?: Store
}

const App: React.SFC<AppProps> = ({ store }) => {
  const handleSetTimestamp = useCallback(() => {
    store?.setTimestamp(String(Date.now()))
  }, [store])

  const handleRemoveCookie = useCallback(() => store?.unsetTimestamp(), [store])

  return (
    <div>
      <pre>Cookie: {store?.timestamp}</pre>

      <div>
        <button onClick={handleSetTimestamp} type="button">
          Set cookie to current timestamp
        </button>
      </div>

      <div>
        <button onClick={handleRemoveCookie} type="button">
          Remove cookie
        </button>
      </div>
    </div>
  )
}

export default inject('store')(observer(App))
