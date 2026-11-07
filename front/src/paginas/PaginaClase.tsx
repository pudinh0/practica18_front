import { useState } from "react"; 
import { Link, useParams, useNavigate, useLocation } from "react-router"; 
import { useClase } from "../hooks/useClase";
import { MensajeError } from "../componentes/MensajeError";
import { urlImagen, mensajeDeError } from "../servicios/api";
import { Cargando } from "../componentes/Cargando";
import { useSesion } from "../sesion/SesionContext"; 
import { inscribirse } from "../servicios/gimnasio"; 
import { useInscripcionesStore } from "../store/inscripcionesStore"; 

export default function PaginaClase() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario } = useSesion();
    const { clase, cargando, error, reintentar } = useClase(Number(id));

    const { inscripciones, cargarInscripciones } = useInscripcionesStore();

    const [mensajeRespuesta, setMensajeRespuesta] = useState<{ texto: string, tipo: 'exito' | 'error' } | null>(null);
    const [inscribiendoId, setInscribiendoId] = useState<number | null>(null);

    async function manejarInscripcion(horarioId: number) {
        if (!usuario) {
            navigate('/entrar', { state: { from: location.pathname } });
            return;
        }

        setMensajeRespuesta(null);
        setInscribiendoId(horarioId);

        try {
            await inscribirse(horarioId);
            setMensajeRespuesta({ texto: '¡Inscripción exitosa!', tipo: 'exito' });
            reintentar(); 
            await cargarInscripciones(); 
        } catch (e) {
            setMensajeRespuesta({ texto: mensajeDeError(e, 'No se pudo completar la inscripción.'), tipo: 'error' });
        } finally {
            setInscribiendoId(null);
        }
    }

    if (cargando) return <Cargando />;
    if (error) return <MensajeError mensaje={error ?? "Ocurrio un error al cargar la clase"} onReintentar={reintentar} />;
    if (!clase) return <MensajeError mensaje="No se encontró la clase" onReintentar={reintentar} />;

    return (
        <>
            <Link to="/clases" className="detalle__volver">← Todas las clases</Link>
            
            <article className="detalle">
                <img className="detalle__imagen" src={urlImagen(clase.imagen)} alt={clase.nombre} loading="lazy" />
                <div className="detalle__datos">
                    <span className="etiqueta etiqueta--fuerza">{clase.categoria}</span>
                    <h1>{clase.nombre}</h1>
                    <p className="pagina__bajada">{clase.descripcion} · {clase.duracionMin} min</p>
                    
                    {mensajeRespuesta && (
                        <div className={`aviso aviso--${mensajeRespuesta.tipo === 'exito' ? 'exito' : 'error'}`}>
                            {mensajeRespuesta.texto}
                        </div>
                    )}

                    <h2>Horarios</h2>
                    <ul className="horarios">
                        {clase.horarios.map((h) => {
                            const estaInscrito = inscripciones.some(i => i.horario.id === h.id);

                            return (
                                <li key={h.id} className="horario">
                                    <div>
                                        <div className="horario__dia">{h.dia} · {h.horaInicio}</div>
                                        <div className="horario__meta">
                                            {h.entrenador} · 
                                            {h.disponibles === 0 
                                                ? <span style={{color: 'red'}}> Lleno</span>
                                                : ` ${h.disponibles} de ${h.cupoMaximo} lugares`
                                            }
                                        </div>
                                    </div>
                                    <button 
                                        className="boton boton--chico" 
                                        onClick={() => manejarInscripcion(h.id)} 
                                        disabled={h.disponibles === 0 || inscribiendoId === h.id || estaInscrito} 
                                    >
                                        {estaInscrito ? 'Inscrito' : (inscribiendoId === h.id ? 'Cargando...' : 'Inscribirme')}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </article>
        </>
    )
}