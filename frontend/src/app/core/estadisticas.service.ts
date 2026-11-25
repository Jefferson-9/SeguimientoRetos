
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs';

import { SeguimientoService } from './seguimiento.service';
import { Estadisticas, calcularEstadisticas } from './estadisticas';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {

  private readonly seguimiento = inject(SeguimientoService);

  // Reto seleccionado: null representa todos los retos.
  private readonly retoSeleccionado =
    new BehaviorSubject<number | null>(null);

  readonly retoSeleccionado$ = this.retoSeleccionado
    .asObservable()
    .pipe(distinctUntilChanged());

  // Datos disponibles para el selector de retos.
  readonly retos$ = this.seguimiento.retos$;

  readonly error$ = this.seguimiento.error$;

  // Recalcula las estadísticas cuando cambian los datos o el filtro.
  readonly estadisticas$: Observable<Estadisticas> = combineLatest([
    this.seguimiento.retos$,
    this.seguimiento.semanas$,
    this.retoSeleccionado$,
  ]).pipe(
    map(([retos, semanas, retoId]) =>
      calcularEstadisticas(retos, semanas, retoId),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  seleccionarReto(retoId: number | null): void {
    this.retoSeleccionado.next(retoId);
  }

  recargar(): void {
    this.seguimiento.recargar();
  }
}
