import './App.css'
import { BrowserRouter as Router} from 'react-router-dom'
import { getApps } from './utils/helper'

// Resolved once at module load - the subdomain (and therefore which app to
// render) doesn't change during a session, so this must live outside the
// component to avoid remounting it (and losing all state) on every render.
const CurrentApp = getApps();

function App() {
  return (
     <Router>
      <CurrentApp />
     </Router>
  )
}

export default App
