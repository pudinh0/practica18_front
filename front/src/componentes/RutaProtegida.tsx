import { Navigate, Outlet, useLocation } from "react-router";
import { useSesion } from "../sesion/SesionContext";

export function RutaProtegida() {
  const { usuario } = useSesion();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/entrar" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}