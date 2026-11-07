import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Sesion, Usuario } from "../tipos";
import * as servicio from "../servicios/sesion";
import { useInscripcionesStore } from "../store/inscripcionesStore";

interface valorSesion {
    usuario: Usuario | null;
    entrar: (correo: string, password: string) => Promise<void>;
    registrar: (nombre: string, correo: string, password: string) => Promise<void>;
    salir: () => void;
}

const SesionContext = createContext<valorSesion | null>(null);

function leerUsuario(): Usuario | null {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? (JSON.parse(usuarioGuardado) as Usuario) : null;
}

export function ProveedorSesion({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(leerUsuario);

    const cargarInscripciones = useInscripcionesStore((s) => s.cargarInscripciones);
    const vaciarInscripciones = useInscripcionesStore((s) => s.vaciarInscripciones);

    useEffect(() => {
        if (usuario) {
            cargarInscripciones();
        }

        function manejarSesionExpirada() {
            salir(); 
        }

        window.addEventListener('sesion-expirada', manejarSesionExpirada);
        return () => window.removeEventListener('sesion-expirada', manejarSesionExpirada);
    }, []); 

    function guardar(sesion: Sesion) {
        localStorage.setItem("token", sesion.token);
        localStorage.setItem("usuario", JSON.stringify(sesion.usuario));
        setUsuario(sesion.usuario);
    }

    async function entrar(correo: string, password: string) {
        guardar(await servicio.entrar(correo, password));
        await cargarInscripciones(); 
    }

    async function registrar(nombre: string, correo: string, password: string) {
        guardar(await servicio.registrar(nombre, correo, password));
        await cargarInscripciones();
    } 

    function salir() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuario(null);
        vaciarInscripciones();
    }

    return (
        <SesionContext value={{ usuario, entrar, registrar, salir }}>
            {children}
        </SesionContext>
    );
} 

export function useSesion() {
    const valor = useContext(SesionContext);
    if (!valor) {
        throw new Error("useSesion() Tiene que usarse dentro del componente principal (ProveedorSesion)");
    }
    return valor;
}
