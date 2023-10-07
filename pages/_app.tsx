import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/system'
import { lightTheme } from '../themes'
import { UiProvider } from '../context';
import { store } from '../components/store'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <UiProvider>
        <ThemeProvider theme={lightTheme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </UiProvider>
    </Provider>


  )
}
