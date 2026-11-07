
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { mensajeDeError } from '../servicios/api.ts';
import { useSesion } from '../sesion/SesionContext.tsx';

export default function PaginaRegistro() {
  const location = useLocation();
  const destino = location.state?.from || "/clases"; 

  const { registrar } = useSesion();
  const navegar = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await registrar(nombre, correo, password); 
      navegar(destino, { replace: true }); 
    } catch (error) {
      setError(mensajeDeError(error, "No se pudo crear la cuenta"));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h1>Crear cuenta</h1>
      {error && <p className="aviso aviso--error">{error}</p>}
      <label className="campo">
        <span className="campo__etiqueta">Nombre</span>
        <input className="campo__control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label className="campo">
        <span className="campo__etiqueta">Correo</span>
        <input className="campo__control" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </label>
      <label className="campo">
        <span className="campo__etiqueta">Contraseña (8 caracteres o más)</span>
        <input className="campo__control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button className="boton boton--ancho" type="submit" disabled={enviando}>
        {enviando ? 'Creando…' : 'Crear cuenta'}
      </button>
      <p className="formulario__pie">¿Ya tienes cuenta? <Link to="/entrar">Entra</Link></p>
    </form>
  );
}
