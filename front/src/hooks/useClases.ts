
import { useEffect, useState } from 'react';

import type { Clase } from '../tipos.ts';
import { traerClases } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';

export function useClases() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0); 

  useEffect(() => {
    let vigente = true; 
    
    traerClases()
      .then((lista) => { if (vigente) setClases(lista); })
      .catch((e) => { if (vigente) setError(mensajeDeError(e, 'No se pudo conectar con el gimnasio.')); })
      .finally(() => { if (vigente) setCargando(false); });
      
    return () => { vigente = false; }; 
  }, [intento]); 

  function reintentar() {
    setCargando(true);
    setError(null);
    setIntento((n) => n + 1);
  }

  return { clases, cargando, error, reintentar };
}
