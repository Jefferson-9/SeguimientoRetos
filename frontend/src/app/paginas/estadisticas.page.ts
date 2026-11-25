
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';

import { EstadisticasService } from '../core/estadisticas.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,

  imports: [
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonSelect,
    IonSelectOption,
  ],

  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/"></ion-back-button>
        </ion-buttons>

        <ion-title>Estadísticas</ion-title>

        <ion-buttons slot="end">
          <ion-button (click)="recargar()">
            Actualizar
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div class="dashboard">

        <h1>Rendimiento de retos</h1>

        <p class="subtitulo">
          Consulta tu progreso y cumplimiento semanal.
        </p>

        <!-- Selector de retos -->
        <section class="panel">
          <ion-select
            label="Seleccionar reto"
            labelPlacement="stacked"
            interface="popover"
            [value]="(retoSeleccionado$ | async) ?? 'todos'"
            (ionChange)="seleccionarReto($event.detail.value)"
          >
            <ion-select-option value="todos">
              Todos los retos
            </ion-select-option>

            @for (reto of (retos$ | async) ?? []; track reto.id) {
              <ion-select-option [value]="reto.id">
                {{ reto.titulo }}
              </ion-select-option>
            }
          </ion-select>
        </section>

        @if (error$ | async; as error) {
          <section class="panel error">
            {{ error }}
          </section>
        } @else if (estadisticas$ | async; as datos) {

          <!-- Indicadores principales -->
          <div class="indicadores">

            <article class="tarjeta">
              <span>Total de retos</span>
              <strong class="azul">
                {{ datos.totalRetos }}
              </strong>
            </article>

            <article class="tarjeta">
              <span>Avance promedio</span>
              <strong class="azul">
                {{
                  datos.promedioCumplimiento === null
                    ? 'Sin datos'
                    : datos.promedioCumplimiento + '%'
                }}
              </strong>
            </article>

            <article class="tarjeta">
              <span>Semanas cumplidas</span>
              <strong class="verde">
                {{ datos.semanasCumplidas }}
              </strong>
            </article>

            <article class="tarjeta">
              <span>Semanas en riesgo</span>
              <strong class="rojo">
                {{ datos.semanasEnRiesgo }}
              </strong>
            </article>

          </div>

          <!-- Distribución de semanas -->
          <section class="panel">
            <h2>Estado de las semanas</h2>

            <p class="subtitulo">
              Total: {{ datos.totalSemanas }} semanas
            </p>

            <div class="estado">
              <span><i class="punto fondo-verde"></i> Cumplidas</span>
              <strong>{{ datos.semanasCumplidas }}</strong>
            </div>

            <div class="estado">
              <span><i class="punto fondo-amarillo"></i> Incompletas</span>
              <strong>{{ datos.semanasIncompletas }}</strong>
            </div>

            <div class="estado">
              <span><i class="punto fondo-rojo"></i> No cumplidas</span>
              <strong>{{ datos.semanasNoCumplidas }}</strong>
            </div>

            <div class="estado">
              <span><i class="punto fondo-azul"></i> En curso</span>
              <strong>{{ datos.semanasEnCurso }}</strong>
            </div>

            <div class="estado">
              <span><i class="punto fondo-gris"></i> Por iniciar</span>
              <strong>{{ datos.semanasPendientes }}</strong>
            </div>

          </section>

          <!-- Gráfico de progreso semanal -->
          <section class="panel">

            <h2>Evolución semanal</h2>

            <p class="subtitulo">
              Porcentaje promedio de avance por semana.
            </p>

            @for (progreso of datos.progresoSemanal; track progreso.semana) {

              <div class="fila-grafico">

                <span class="semana">
                  Semana {{ progreso.semana }}
                </span>

                <div class="barra-fondo">
                  <div
                    class="barra-progreso"
                    [style.width.%]="progreso.promedio ?? 0"
                  ></div>
                </div>

                <span class="porcentaje">
                  {{
                    progreso.promedio === null
                      ? 'Sin datos'
                      : progreso.promedio + '%'
                  }}
                </span>

              </div>

            }

          </section>

          @if (datos.totalRetos === 0) {
            <section class="panel">
              Todavía no hay retos para mostrar.
            </section>
          }

          <p class="nota">
            El promedio excluye las semanas que todavía no comienzan.
            Las estadísticas se actualizan mediante RxJS.
          </p>

        } @else {
          <p>Cargando estadísticas...</p>
        }

      </div>

    </ion-content>
  `,

  styles: [`
    ion-content {
      --background: var(--ion-color-light, #f4f5f8);
    }

    .dashboard {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 8px 0;
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 12px;
    }

    .subtitulo {
      font-size: 14px;
      color: var(--ion-color-medium-shade, #667085);
      margin-bottom: 18px;
    }

    .panel, .tarjeta {
      background: var(--ion-background-color, #ffffff);
      border-radius: 14px;
      padding: 18px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    }

    .panel {
      margin-bottom: 18px;
    }

    .indicadores {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 18px;
    }

    .tarjeta {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tarjeta span {
      font-size: 13px;
      color: var(--ion-color-medium-shade, #667085);
    }

    .tarjeta strong {
      font-size: 26px;
    }

    .azul { color: #0054e9; }
    .verde { color: #16a34a; }
    .rojo { color: #dc2626; }

    .estado {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      font-size: 14px;
    }

    .estado span {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .punto {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    .fondo-verde { background: #22c55e; }
    .fondo-amarillo { background: #eab308; }
    .fondo-rojo { background: #ef4444; }
    .fondo-azul { background: #3880ff; }
    .fondo-gris { background: #9ca3af; }

    .fila-grafico {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 15px 0;
    }

    .semana {
      width: 72px;
      flex-shrink: 0;
      font-size: 12px;
    }

    .barra-fondo {
      flex: 1;
      height: 14px;
      background: #e5e7eb;
      border-radius: 5px;
      overflow: hidden;
    }

    .barra-progreso {
      height: 100%;
      background: #3880ff;
      border-radius: 5px;
      transition: width 0.3s ease;
    }

    .porcentaje {
      width: 60px;
      flex-shrink: 0;
      font-size: 12px;
      text-align: right;
    }

    .nota {
      text-align: center;
      font-size: 12px;
      color: var(--ion-color-medium-shade, #667085);
    }

    .error {
      color: var(--ion-color-danger);
    }

    @media (min-width: 768px) {
      .indicadores {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  `],
})
export class EstadisticasPage {

  private readonly servicio = inject(EstadisticasService);

  readonly estadisticas$ = this.servicio.estadisticas$;
  readonly retos$ = this.servicio.retos$;
  readonly retoSeleccionado$ = this.servicio.retoSeleccionado$;
  readonly error$ = this.servicio.error$;

  seleccionarReto(valor: string | number): void {
    this.servicio.seleccionarReto(
      valor === 'todos' ? null : Number(valor),
    );
  }

  recargar(): void {
    this.servicio.recargar();
  }

  ionViewWillEnter(): void {
    this.recargar();
  }
}
