// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./Routes/routes.jsx";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
                index={route.index} // Mantenemos el soporte para index si está presente
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;