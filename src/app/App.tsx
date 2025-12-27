import { AppProviders } from './App.providers.tsx'
import { AppRouter } from './App.router.tsx'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
