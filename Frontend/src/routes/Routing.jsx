import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PaginaPrincipal from "../pages/PaginaPrincipal";
import Panel from "../pages/Panel";
import PanelDomicilio from "../pages/PanelDomicilio";
import Ingreso from "../pages/Ingreso";
import ProtectedRoute from "../components/ProtectedRoute";
import OlvMiContraseniaPagina from "../pages/OlvMiContraseniaPagina";
import ResetearContraseniaPagina from "../pages/ResetearContraseniaPagina";

const Routing = () => {
    return (
        <Router basename="/test">
            <Routes>
                <Route path="/panel" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Admin', 'Moderador']}>
                        <Panel />
                    </ProtectedRoute>
                } />
                <Route path="/panel/reservas-domicilio" element={
                    <ProtectedRoute allowedRoles={['Administrador', 'Admin', 'Moderador']}>
                        <PanelDomicilio />
                    </ProtectedRoute>
                } />
                <Route path="/ingreso" element={<Ingreso />} />
                <Route path="/" element={<PaginaPrincipal />} />
                <Route path="/forgot-password" element={<OlvMiContraseniaPagina />} />
                <Route path="/reset-password" element={<ResetearContraseniaPagina />} />
            </Routes>
        </Router>
    )
}

export default Routing;