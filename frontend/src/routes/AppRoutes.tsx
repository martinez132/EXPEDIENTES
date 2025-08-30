import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Expedientes from '../pages/Expedientes';
import ExpedienteDetalle from '../pages/ExpedienteDetalle';
import ExpedienteForm from '../pages/ExpedienteForm';
import RevisarExpedientes from '../pages/RevisarExpedientes';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import Navbar from '../components/Navbar';

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>

        <Route path="/expedientes" element={<PrivateRoute><Expedientes/></PrivateRoute>} />
        <Route path="/expedientes/nuevo" element={<PrivateRoute><ExpedienteForm/></PrivateRoute>} />
        <Route path="/expedientes/:id" element={<PrivateRoute><ExpedienteDetalle/></PrivateRoute>} />
        <Route path="/expedientes/:id/editar" element={<PrivateRoute><ExpedienteForm/></PrivateRoute>} />

        <Route path="/revisar" element={
          <PrivateRoute>
            <RoleRoute role="coordinador">
              <RevisarExpedientes/>
            </RoleRoute>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
