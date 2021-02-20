import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'

import type { Store } from './store'

interface AppProps {
  store: Store
}

const App: React.FC<AppProps> = observer(({ store }) => {
  const handleSetTimestamp = useCallback(() => {
    store.setTimestamp(String(Date.now()))
  }, [store])

  const handleRemoveCookie = useCallback(() => store.unsetTimestamp(), [store])

  return (
    <div>
      <pre>Cookie: {store.timestamp}</pre>

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
})

export default App
