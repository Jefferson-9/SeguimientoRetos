
import { describe, it, expect } from 'vitest';
import { Reto, TareaSemanal } from './modelos';
import { evaluarSemana } from './semaforo';
import { calcularEstadisticas } from './estadisticas';

// Fecha fija para que las pruebas no dependan del día de ejecución
const HOY = '2026-11-28';

// Genera un reto de prueba
function crearReto(id: number): Reto {
  return {
    id,
    titulo: `Reto ${id}`,
    descripcion: 'Reto de prueba',
    fecha_inicio: '2026-11-16',
    fecha_fin: null,
    estado: 'EN_CURSO',
    total_avances: 0,
    creado: HOY,
    actualizado: HOY,
  };
}

// Genera una semana de prueba
function crearSemana(
  id: number,
  reto: number,
  semana: number,
  porcentaje: number,
  inicio: string,
  fin: string,
) {
  const tarea: TareaSemanal = {
    id,
    reto,
    reto_titulo: `Reto ${reto}`,
    semana,
    fecha_inicio: inicio,
    fecha_fin: fin,
    descripcion: 'Semana de prueba',
    porcentaje,
    actualizado: HOY,
  };

  return evaluarSemana(tarea, HOY);
}

// Datos ficticios para las pruebas
const retos = [
  crearReto(1),
  crearReto(2),
  crearReto(3),
];

const semanas = [
  crearSemana(1, 1, 7, 100, '2026-11-16', '2026-11-22'),
  crearSemana(2, 2, 7, 50, '2026-11-16', '2026-11-22'),
  crearSemana(3, 3, 7, 5, '2026-11-16', '2026-11-22'),
  crearSemana(4, 1, 8, 5, '2026-11-23', '2026-11-29'),
  crearSemana(5, 1, 9, 0, '2026-11-30', '2026-12-06'),
];

describe('Dashboard de estadísticas', () => {

  it('cuenta correctamente los retos y estados semanales', () => {
    const resultado = calcularEstadisticas(retos, semanas);

    expect(resultado.totalRetos).toBe(3);
    expect(resultado.totalSemanas).toBe(5);
    expect(resultado.semanasCumplidas).toBe(1);
    expect(resultado.semanasIncompletas).toBe(1);
    expect(resultado.semanasNoCumplidas).toBe(1);
    expect(resultado.semanasEnCurso).toBe(1);
    expect(resultado.semanasPendientes).toBe(1);
  });

  it('calcula el promedio sin incluir semanas futuras', () => {
    const resultado = calcularEstadisticas(retos, semanas);

    expect(resultado.promedioCumplimiento).toBe(40);
  });

  it('detecta las semanas en riesgo', () => {
    const resultado = calcularEstadisticas(retos, semanas);

    expect(resultado.semanasEnRiesgo).toBe(1);
  });

  it('filtra las estadísticas por reto', () => {
    const resultado = calcularEstadisticas(retos, semanas, 1);

    expect(resultado.totalRetos).toBe(1);
    expect(resultado.totalSemanas).toBe(3);
    expect(resultado.promedioCumplimiento).toBe(53);
  });

  it('calcula la evolución de las semanas 7 a 15', () => {
    const resultado = calcularEstadisticas(retos, semanas);

    expect(resultado.progresoSemanal.length).toBe(9);

    expect(resultado.progresoSemanal[0]).toEqual({
      semana: 7,
      promedio: 52,
    });

    expect(resultado.progresoSemanal[1]).toEqual({
      semana: 8,
      promedio: 5,
    });

    expect(resultado.progresoSemanal[2]).toEqual({
      semana: 9,
      promedio: null,
    });
  });

  it('maneja correctamente la ausencia de datos', () => {
    const resultado = calcularEstadisticas([], []);

    expect(resultado.totalRetos).toBe(0);
    expect(resultado.totalSemanas).toBe(0);
    expect(resultado.promedioCumplimiento).toBeNull();
  });

  it('diferencia un avance real de 0% de la ausencia de datos', () => {
    const semana = crearSemana(
      6, 1, 8, 0, '2026-11-23', '2026-11-29',
    );

    const resultado = calcularEstadisticas(
      [crearReto(1)],
      [semana],
    );

    expect(resultado.promedioCumplimiento).toBe(0);
  });

});
