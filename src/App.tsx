
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'

import barberTheme from './theme'
import AppRoutes from './routes'

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider theme={barberTheme}>
       <Router>
        <AppRoutes />  {/* Renderiza as rotas aqui */}
      </Router>
    </ChakraProvider>
  )
}

export default App
