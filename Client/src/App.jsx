import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './Routes/routes.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;