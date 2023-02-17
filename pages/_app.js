import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from 'react-redux'
import store from '../redux/Store'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
