
import { Reto } from './modelos';
import { SemanaEvaluada } from './semaforo';

// Información necesaria para el gráfico semanal
export interface ProgresoSemanal {
  semana: number;
  promedio: number | null;
}

// Información que mostrará el dashboard
export interface Estadisticas {
  totalRetos: number;
  totalSemanas: number;
  semanasCumplidas: number;
  semanasIncompletas: number;
  semanasNoCumplidas: number;
  semanasEnCurso: number;
  semanasPendientes: number;
  semanasEnRiesgo: number;
  promedioCumplimiento: number | null;
  progresoSemanal: ProgresoSemanal[];
}

// Calcula el promedio de avance de un conjunto de semanas.
function calcularPromedio(
  semanas: SemanaEvaluada[],
): number | null {
  if (semanas.length === 0) {
    return null;
  }

  const suma = semanas.reduce(
    (total, semana) => total + semana.porcentaje,
    0,
  );

  return Math.round(suma / semanas.length);
}

// Calcula las estadísticas generales o de un reto específico
export function calcularEstadisticas(
  retos: Reto[],
  semanas: SemanaEvaluada[],
  retoId: number | null = null,
): Estadisticas {

  const retosFiltrados = retoId === null
    ? retos
    : retos.filter((reto) => reto.id === retoId);

  const ids = new Set(retosFiltrados.map((reto) => reto.id));

  const semanasFiltradas = semanas.filter(
    (semana) => ids.has(semana.reto),
  );

  // Las semanas futuras no deben afectar el promedio
  const semanasIniciadas = semanasFiltradas.filter(
    (semana) => semana.semaforo !== 'PENDIENTE',
  );

  // Evolución del progreso desde la semana 7 hasta la 15
  const progresoSemanal = Array.from(
    { length: 9 },
    (_, indice) => {
      const numeroSemana = indice + 7;

      const tareas = semanasIniciadas.filter(
        (semana) => semana.semana === numeroSemana,
      );

      return {
        semana: numeroSemana,
        promedio: calcularPromedio(tareas),
      };
    },
  );

  return {
    totalRetos: retosFiltrados.length,
    totalSemanas: semanasFiltradas.length,

    semanasCumplidas: semanasFiltradas.filter(
      (s) => s.semaforo === 'VERDE',
    ).length,

    semanasIncompletas: semanasFiltradas.filter(
      (s) => s.semaforo === 'AMARILLO',
    ).length,

    semanasNoCumplidas: semanasFiltradas.filter(
      (s) => s.semaforo === 'ROJO',
    ).length,

    semanasEnCurso: semanasFiltradas.filter(
      (s) => s.semaforo === 'ABIERTA',
    ).length,

    semanasPendientes: semanasFiltradas.filter(
      (s) => s.semaforo === 'PENDIENTE',
    ).length,

    semanasEnRiesgo: semanasFiltradas.filter(
      (s) => s.enRiesgo,
    ).length,

    promedioCumplimiento: calcularPromedio(semanasIniciadas),

    progresoSemanal,
  };
}
