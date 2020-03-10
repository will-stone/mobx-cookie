import { Provider } from 'mobx-react'
import * as React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
)
