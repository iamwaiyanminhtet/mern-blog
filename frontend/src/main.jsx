import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "../node_modules/flowbite/dist/flowbite.js"

import { persistor, store } from './redux/store.js'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import ToggleTheme from './components/ToggleTheme.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ToggleTheme>
          <App />
        </ToggleTheme>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
