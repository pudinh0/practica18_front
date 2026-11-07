import { create } from 'zustand';
import type { Inscripcion } from '../tipos';
import { traerMisInscripciones } from '../servicios/gimnasio';

interface InscripcionesState {
  inscripciones: Inscripcion[];
  cargando: boolean;
  cargarInscripciones: () => Promise<void>;
  vaciarInscripciones: () => void;
}

export const useInscripcionesStore = create<InscripcionesState>((set) => ({
  inscripciones: [],
  cargando: false,
  cargarInscripciones: async () => {
    set({ cargando: true });
    try {
      const lista = await traerMisInscripciones();
      set({ inscripciones: lista, cargando: false });
    } catch (error) {
      console.error("Error al cargar inscripciones", error);
      set({ cargando: false });
    }
  },
  vaciarInscripciones: () => set({ inscripciones: [] }),
}));