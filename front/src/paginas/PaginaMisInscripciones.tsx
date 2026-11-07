import { Link } from 'react-router';
import { useInscripcionesStore } from '../store/inscripcionesStore';
import { Cargando } from '../componentes/Cargando';
import { urlImagen } from '../servicios/api';

export default function PaginaMisInscripciones() {
  const { inscripciones, cargando } = useInscripcionesStore();

  if (cargando) return <Cargando />;

  return (
    <>
      <section className="pagina__encabezado">
        <h1>Mis inscripciones</h1>
        <p className="pagina__bajada">
          {inscripciones.length === 0 
            ? 'Aún no tienes inscripciones.' 
            : `${inscripciones.length} clase(s) esta semana.`}
        </p>
      </section>

      <ul className="inscripciones">
        {inscripciones.map((i) => (
          <li key={i.id} className="inscripcion">
            <img className="inscripcion__imagen" src={urlImagen(i.clase.imagen)} alt={i.clase.nombre} loading="lazy" />
            <div>
              <Link to={`/clases/${i.clase.id}`} className="inscripcion__clase">
                {i.clase.nombre}
              </Link>
              <div className="inscripcion__meta">
                {i.horario.dia} · {i.horario.horaInicio} · {i.horario.entrenador}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}