import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Edicion from './pages/Edicion';
import Consulta from './pages/Consulta';
import Configuracion from './pages/Configuracion';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA: El Login no necesita protección */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PRIVADAS: Todo esto está protegido por el Guardia */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Edicion />} />
          <Route path="consulta" element={<Consulta />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;