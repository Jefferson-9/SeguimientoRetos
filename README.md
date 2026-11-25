# Seguimiento de Retos

Aplicación web y móvil para la gestión de retos personales, el registro de avances y el seguimiento del cumplimiento de tareas semanales.

**Funcionalidad adicional:** Dashboard reactivo de estadísticas de rendimiento.

## 1. Descripción y objetivos

La aplicación integra un backend Django con MySQL, una interfaz web Angular e Ionic y una aplicación Android mediante Capacitor. Permite consultar y crear retos, registrar avances, evaluar el cumplimiento semanal y visualizar alertas de incumplimiento y riesgo.

El objetivo general es facilitar el seguimiento de objetivos personales mediante información organizada, indicadores de progreso y herramientas de visualización. Como ampliación de la práctica base, se implementó una pantalla de estadísticas para analizar los retos de manera general e individual.

## 2. Tecnologías y arquitectura

| Tecnología | Responsabilidad |
|---|---|
| Python y Django | Lógica del servidor y modelos de datos. |
| Django REST Framework | Exposición de la API REST. |
| MySQL | Persistencia de los datos. |
| Angular, Ionic y TypeScript | Interfaz web y móvil. |
| RxJS | Gestión de flujos reactivos. |
| Capacitor y Android Studio | Integración, compilación y ejecución en Android. |
| Swagger / OpenAPI | Documentación y comprobación de la API. |
| Vitest | Pruebas unitarias del frontend. |
| Git | Control de versiones. |

La arquitectura cliente-servidor separa la interfaz, la lógica del backend y la persistencia de los datos.

```text
Angular + Ionic (web) / Capacitor (Android)
                   |
                API REST
                   |
           Django REST Framework
                   |
                 MySQL
```

### 2.1. Estructura del repositorio

```text
SeguimientoRetos/
├── backend/
│   ├── config/
│   ├── retos/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── android/
│   ├── src/app/
│   │   ├── core/
│   │   ├── paginas/
│   │   └── app.routes.ts
│   ├── angular.json
│   ├── capacitor.config.ts
│   └── package.json
├── documentacion/
│   ├── 02-instalacion-windows.md
│   ├── 03-backend-paso-a-paso.md
│   ├── 04-frontend-paso-a-paso.md
│   └── evidencias/
├── .gitignore
└── README.md
```

## 3. Funcionalidad propia: dashboard reactivo de estadísticas

### 3.1. Propósito y justificación

La aplicación base permite consultar el progreso de cada reto de forma individual. El dashboard complementa esta funcionalidad al presentar una visión consolidada de los retos y sus tareas semanales, facilitando la identificación de dificultades y la interpretación de los resultados sin tener que abrir cada reto por separado.

### 3.2. Características

- Indicadores de total de retos, avance promedio, semanas cumplidas y semanas en riesgo.
- Distribución de las tareas semanales en cinco estados: cumplidas, incompletas, no cumplidas, en curso y por iniciar.
- Gráfico de barras horizontales de evolución semanal (semanas 7 a 15).
- Selector de estadísticas generales o de un reto individual.
- Actualización de los indicadores a partir de los datos disponibles y opción de actualizar la consulta.
- Distinción entre un avance del 0 % y una semana sin datos evaluables.
- Diseño adaptable a navegadores web y al emulador Android.

### 3.3. Reglas de cálculo

El avance promedio se obtiene a partir de los porcentajes de las tareas semanales que ya han comenzado. Las semanas futuras no se incluyen en el promedio y el resultado mostrado se redondea al entero más cercano. El promedio general considera las tareas semanales incluidas, no el promedio simple de los promedios individuales de cada reto.

Ejemplo para Leer 10 libros: (20 + 80) / 2 = 50 %.

Ejemplo consolidado: (20 + 80 + 40) / 3 = 46,67 %, mostrado como 47 %.

### 3.4. Integración técnica

La funcionalidad reutiliza los servicios de seguimiento y la API REST existente. La lógica estadística, los flujos reactivos y la interfaz se organizan en archivos separados para facilitar las pruebas y el mantenimiento. RxJS permite combinar y transformar la información de los retos, las tareas semanales y el filtro seleccionado.

Los endpoints principales son `GET /api/retos/` y `GET /api/tareas/`. No se requirieron nuevos modelos, tablas ni endpoints del backend para incorporar el dashboard.

### 3.5. Archivos creados y modificados

Las rutas siguientes son relativas a `frontend/src/app/`.

| Archivo | Estado | Responsabilidad |
|---|---|---|
| `core/estadisticas.ts` | Nuevo | Lógica de los cálculos estadísticos. |
| `core/estadisticas.spec.ts` | Nuevo | Pruebas unitarias de estadísticas. |
| `core/estadisticas.service.ts` | Nuevo | Gestión de los flujos reactivos del dashboard. |
| `paginas/estadisticas.page.ts` | Nuevo | Interfaz, indicadores, filtro y gráficos. |
| `app.routes.ts` | Modificado | Incorporación de la ruta `/estadisticas`. |
| `core/retos-api.service.ts` | Modificado | Recuperación de retos paginados. |
| `paginas/retos-lista.page.ts` | Modificado | Acceso a estadísticas desde el listado de retos. |

## 4. Ejecución del proyecto

### 4.1. Backend

Configurar MySQL y crear `backend/.env` a partir de `.env.example`, de acuerdo con las guías de instalación. Desde el directorio `backend`, ejecutar en PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Si el entorno ya está instalado, basta con activar el entorno virtual y ejecutar el servidor, manteniendo MySQL activo.

- API REST: `http://127.0.0.1:8000/api/`
- Administración: `http://127.0.0.1:8000/admin/`
- Swagger: `http://127.0.0.1:8000/api/docs/`

### 4.2. Frontend web

Desde `frontend`, ejecutar:

```powershell
npm.cmd ci
ionic.cmd serve --project=frontend --port=8100
```

La aplicación se encuentra en `http://localhost:8100/` y el dashboard en `http://localhost:8100/estadisticas`.

### 4.3. Aplicación Android

Desde `frontend`, ejecutar:

```powershell
npm.cmd run build
npx.cmd cap sync android
npx.cmd cap open android
```

Seleccionar un emulador en Android Studio y ejecutar la aplicación. El backend debe permanecer activo; el emulador accede al servidor local mediante `10.0.2.2:8000`.

## 5. Evidencias de la práctica base

Las figuras se identifican con el número de la captura original para facilitar su localización en el repositorio. Se agrupan por componente, no por orden de adquisición.

### 5.1. Instalación y configuración del entorno

#### Figura 1. Ejecución inicial en el emulador Android

Se verificó la instalación y apertura de la aplicación inicial desde Android Studio. El mensaje de preparación del entorno y el aviso de instalación exitosa comprueban la integración inicial de Angular, Ionic y Capacitor.

![Ejecución inicial en el emulador Android](documentacion/evidencias/Captura%201.png)

*Figura 1. Ejecución inicial en el emulador Android. Fuente: captura propia del entorno de desarrollo.*

#### Figura 2. Verificación de Java y ADB

Se comprobó la disponibilidad de Java 21, Android Debug Bridge y el reconocimiento del emulador mediante `adb devices`.

![Verificación de Java y ADB](documentacion/evidencias/Captura%202.png)

*Figura 2. Verificación de Java y ADB. Fuente: captura propia del entorno de desarrollo.*

#### Figura 3. Compilación inicial y generación de la APK

Gradle finalizó con el mensaje `BUILD SUCCESSFUL`. También se verificó la existencia de `app-debug.apk`. Esta captura corresponde a la compilación inicial, anterior al dashboard.

![Compilación inicial y generación de la APK](documentacion/evidencias/Captura%203.png)

*Figura 3. Compilación inicial y generación de la APK. Fuente: captura propia del entorno de desarrollo.*

#### Figura 4. Configuración del repositorio Git

Se preparó el archivo `.gitignore` para excluir archivos privados, dependencias y resultados de compilación. La terminal muestra el registro de los commits iniciales y del archivo de dependencias del backend.

![Configuración del repositorio Git](documentacion/evidencias/Captura%204.png)

*Figura 4. Configuración del repositorio Git. Fuente: captura propia del entorno de desarrollo.*

### 5.2. Backend, MySQL y API REST

#### Figura 5. Verificación de las tablas en MySQL

Se ejecutaron consultas `SHOW TABLES` y `DESCRIBE retos_reto` para comprobar la creación de las tablas y la estructura del modelo de retos en MySQL.

![Verificación de las tablas en MySQL](documentacion/evidencias/Captura%205.png)

*Figura 5. Verificación de las tablas en MySQL. Fuente: captura propia del entorno de desarrollo.*

#### Figura 6. Acceso inicial al administrador de Django

Se comprobó el acceso al panel administrativo y la disponibilidad de los módulos de usuarios y grupos.

![Acceso inicial al administrador de Django](documentacion/evidencias/Captura%206.png)

*Figura 6. Acceso inicial al administrador de Django. Fuente: captura propia del entorno de desarrollo.*

#### Figura 7. Registro de los modelos Reto y Avance

El administrador de Django presenta los modelos Reto y Avance, incorporados para gestionar los registros de la aplicación.

![Registro de los modelos Reto y Avance](documentacion/evidencias/Captura%207.png)

*Figura 7. Registro de los modelos Reto y Avance. Fuente: captura propia del entorno de desarrollo.*

#### Figura 8. Documentación de la API REST con Swagger

Se visualizó la documentación de las operaciones disponibles para retos y avances, incluyendo los métodos de consulta, creación, actualización y eliminación.

![Documentación de la API REST con Swagger](documentacion/evidencias/Captura%208.png)

*Figura 8. Documentación de la API REST con Swagger. Fuente: captura propia del entorno de desarrollo.*

#### Figura 9. Especificación de la creación de retos

Swagger muestra la estructura JSON del endpoint POST de retos y el esquema de respuesta HTTP 201 esperado. La captura documenta el contrato de la API; no constituye por sí sola una ejecución exitosa del POST.

![Especificación de la creación de retos](documentacion/evidencias/Captura%209.png)

*Figura 9. Especificación de la creación de retos. Fuente: captura propia del entorno de desarrollo.*

#### Figura 10. Registro de cambios del backend

Se realizó el commit `32a2f36`, correspondiente a la implementación de la API REST de retos y avances, incluyendo los modelos, serializadores, vistas, rutas y pruebas.

![Registro de cambios del backend](documentacion/evidencias/Captura%2010.png)

*Figura 10. Registro de cambios del backend. Fuente: captura propia del entorno de desarrollo.*

#### Figura 12. Migración, generación semanal y pruebas del backend

Se aplicó la migración `0002_tareasemanal`, se generaron nueve tareas semanales para el reto existente y se ejecutaron cinco pruebas automáticas, todas con resultado `OK`.

![Migración, generación semanal y pruebas del backend](documentacion/evidencias/Captura%2012.png)

*Figura 12. Migración, generación semanal y pruebas del backend. Fuente: captura propia del entorno de desarrollo.*

#### Figura 13. Consulta de tareas semanales mediante la API

El endpoint `GET /api/tareas/` respondió con HTTP 200 OK y presentó los registros generados con sus fechas, descripción y porcentaje de avance.

![Consulta de tareas semanales mediante la API](documentacion/evidencias/Captura%2013.png)

*Figura 13. Consulta de tareas semanales mediante la API. Fuente: captura propia del entorno de desarrollo.*

### 5.3. Frontend web e integración Android

#### Figura 11. Acceso a la API desde el emulador

El navegador del emulador accedió a `10.0.2.2:8000/api/retos/`, verificando la comunicación con el servidor Django del equipo anfitrión.

![Acceso a la API desde el emulador](documentacion/evidencias/Captura%2011.png)

*Figura 11. Acceso a la API desde el emulador. Fuente: captura propia del entorno de desarrollo.*

#### Figura 14. Pruebas unitarias del sistema de semáforo

Se ejecutaron ocho pruebas unitarias que verifican la clasificación de semanas según fechas y avance, la detección de riesgo, el bloqueo de edición en semanas cerradas desde la interfaz y el cálculo de días.

![Pruebas unitarias del sistema de semáforo](documentacion/evidencias/Captura%2014.png)

*Figura 14. Pruebas unitarias del sistema de semáforo. Fuente: captura propia del entorno de desarrollo.*

#### Figura 15. Registro y consulta de avances en la web

La pantalla de seguimiento muestra el formulario de avances con fecha, descripción y porcentaje, así como los registros previamente almacenados para el reto Leer 10 libros.

![Registro y consulta de avances en la web](documentacion/evidencias/Captura%2015.png)

*Figura 15. Registro y consulta de avances en la web. Fuente: captura propia del entorno de desarrollo.*

#### Figura 16. Listado de retos en Android

La aplicación móvil muestra el reto Leer 10 libros, el buscador, el acceso a alertas y el botón de creación de retos. La presencia del registro evidencia la carga de datos del backend.

![Listado de retos en Android](documentacion/evidencias/Captura%2016.png)

*Figura 16. Listado de retos en Android. Fuente: captura propia del entorno de desarrollo.*

## 6. Evidencias de la funcionalidad propia

### 6.1. Validación del dashboard en la web

#### Figura 17. Visualización inicial de estadísticas

Con un reto y nueve tareas semanales, el panel muestra un avance promedio del 10 %, correspondiente a los valores del 20 % y 0 % de las semanas 7 y 8.

![Visualización inicial de estadísticas](documentacion/evidencias/Captura%2017.png)

*Figura 17. Visualización inicial de estadísticas. Fuente: captura propia del entorno de desarrollo.*

#### Figura 18. Actualización de los indicadores de rendimiento

Después de incrementar el avance de la semana 8 al 80 %, el promedio pasó del 10 % al 50 %. La comparación con la captura 17 evidencia que el panel refleja los datos actualizados.

![Actualización de los indicadores de rendimiento](documentacion/evidencias/Captura%2018.png)

*Figura 18. Actualización de los indicadores de rendimiento. Fuente: captura propia del entorno de desarrollo.*

#### Figura 19. Estadísticas consolidadas de múltiples retos

Se incorporó el reto Aprender inglés. La vista general presenta dos retos, 17 tareas semanales y un avance promedio del 47 %, con una semana incompleta, dos en curso y 14 por iniciar.

![Estadísticas consolidadas de múltiples retos](documentacion/evidencias/Captura%2019.png)

*Figura 19. Estadísticas consolidadas de múltiples retos. Fuente: captura propia del entorno de desarrollo.*

#### Figura 20. Filtrado individual: Aprender inglés

El selector permite visualizar únicamente el reto Aprender inglés, con ocho tareas semanales, un promedio del 40 % y una semana en curso.

![Filtrado individual: Aprender inglés](documentacion/evidencias/Captura%2020.png)

*Figura 20. Filtrado individual: Aprender inglés. Fuente: captura propia del entorno de desarrollo.*

#### Figura 21. Filtrado individual: Leer 10 libros

Al seleccionar Leer 10 libros, el panel presenta nueve tareas semanales y un promedio del 50 %. Las barras de las semanas 7 y 8 representan el 20 % y 80 %, respectivamente.

![Filtrado individual: Leer 10 libros](documentacion/evidencias/Captura%2021.png)

*Figura 21. Filtrado individual: Leer 10 libros. Fuente: captura propia del entorno de desarrollo.*

### 6.2. Validación del dashboard en Android

#### Figura 22. Dashboard general en el emulador Android

La versión móvil presenta los mismos indicadores que la web: dos retos, 17 tareas semanales y un promedio del 47 %. La distribución de las tarjetas se adapta a la pantalla del dispositivo.

![Dashboard general en el emulador Android](documentacion/evidencias/Captura%2022.png)

*Figura 22. Dashboard general en el emulador Android. Fuente: captura propia del entorno de desarrollo.*

#### Figura 29. Filtro individual y evolución semanal en Android

Se verificó el filtro del reto Leer 10 libros y la representación de los porcentajes semanales en el emulador. La captura muestra el promedio del 50 %, nueve tareas semanales y barras del 20 % y 80 %. Los valores corresponden a los datos restaurados después de las simulaciones.

![Filtro individual y evolución semanal en Android](documentacion/evidencias/Captura%2029.png)

*Figura 29. Filtro individual y evolución semanal en Android. Fuente: captura propia del entorno de desarrollo.*

## 7. Validación de reglas de negocio y alertas

### Figura 23. Aviso de cierre de una semana en rojo

Se simuló una semana cerrada con bajo cumplimiento mediante el administrador de Django. Android mostró un aviso de una semana cerrada en rojo y un indicador en el listado de retos.

![Aviso de cierre de una semana en rojo](documentacion/evidencias/Captura%2023.png)

*Figura 23. Aviso de cierre de una semana en rojo. Fuente: captura propia del entorno de desarrollo.*

### Figura 24. Consulta de semanas no cumplidas en la página de alertas

La pantalla de alertas identifica la semana 7 del reto Leer 10 libros, cerrada el 22 de noviembre con un avance del 5 %, y la clasifica como no cumplida.

![Consulta de semanas no cumplidas en la página de alertas](documentacion/evidencias/Captura%2024.png)

*Figura 24. Consulta de semanas no cumplidas en la página de alertas. Fuente: captura propia del entorno de desarrollo.*

### Figura 25. Petición PATCH rechazada por el backend

Se intentó actualizar la tarea semanal con identificador 1 al 100 % mediante Swagger. El servidor devolvió HTTP 400 Bad Request. En esta evidencia se ha ocultado el valor del token CSRF para evitar exponerlo en el repositorio.

![Petición PATCH rechazada por el backend](documentacion/evidencias/Captura%2025.png)

*Figura 25. Petición PATCH rechazada por el backend. Fuente: captura propia del entorno de desarrollo.*

### Figura 26. Mensaje de validación de una semana cerrada

El cuerpo de la respuesta HTTP 400 confirma la regla de negocio: «La semana 7 ya está cerrada; no se puede modificar». La respuesta observada es la del apartado Server response, no el ejemplo HTTP 200 de la documentación.

![Mensaje de validación de una semana cerrada](documentacion/evidencias/Captura%2026.png)

*Figura 26. Mensaje de validación de una semana cerrada. Fuente: captura propia del entorno de desarrollo.*

### Figura 27. Clasificación de una semana cumplida

En una simulación administrativa se asignó un avance del 100 % a la semana 7, previamente cerrada. Android mostró el estado Cumplida y la barra verde, mientras que la semana abierta conservó su control de avance.

![Clasificación de una semana cumplida](documentacion/evidencias/Captura%2027.png)

*Figura 27. Clasificación de una semana cumplida. Fuente: captura propia del entorno de desarrollo.*

### Figura 28. Detección de una semana en riesgo

Se modificaron temporalmente la fecha de cierre y el porcentaje de la semana 8. Con un día restante y un avance del 5 %, la aplicación mostró la advertencia de riesgo de cierre en rojo.

![Detección de una semana en riesgo](documentacion/evidencias/Captura%2028.png)

*Figura 28. Detección de una semana en riesgo. Fuente: captura propia del entorno de desarrollo.*

Las modificaciones de porcentajes y fechas realizadas desde Django Admin fueron simulaciones controladas para verificar las reglas de la aplicación. Después de las pruebas se restauraron los valores originales. El bloqueo HTTP 400 se comprobó específicamente en la API REST; la simulación administrativa no equivale a una edición permitida desde la API.

## 8. Resultados de las pruebas

### 8.1. Pruebas automáticas y compilación

En la verificación final se obtuvieron los siguientes resultados:

| Componente | Pruebas ejecutadas | Superadas | Fallidas |
|---|---:|---:|---:|
| Backend Django | 5 | 5 | 0 |
| Sistema de semáforo | 8 | 8 | 0 |
| Dashboard de estadísticas | 7 | 7 | 0 |
| **Total** | **20** | **20** | **0** |

La compilación final de Angular terminó sin errores e incluyó el componente `estadisticas-page`. La comprobación del sistema Django no identificó problemas y `connection.vendor` devolvió `mysql`.

Comandos de comprobación (desde `backend`):

```powershell
python manage.py test retos
python manage.py check --database default
python manage.py shell -c "from django.db import connection; print(connection.vendor)"
```

Desde `frontend`:

```powershell
npm.cmd run build
npx.cmd ng test --watch=false
```

Las figuras 12 y 14 muestran las pruebas iniciales del backend y del semáforo. Los resultados finales de 20 pruebas corresponden a las ejecuciones posteriores en terminal.

### 8.2. Resultados funcionales del dashboard

| Filtro | Retos | Tareas semanales | Avance promedio |
|---|---:|---:|---:|
| Todos los retos | 2 | 17 | 47 % |
| Leer 10 libros | 1 | 9 | 50 % |
| Aprender inglés | 1 | 8 | 40 % |

Los datos corresponden al escenario de comprobación del 24 de noviembre de 2026. Los indicadores de semanas en curso y por iniciar dependen de la fecha de consulta, por lo que pueden cambiar con el tiempo.

### 8.3. Cobertura de la documentación

| Componente evaluado | Figuras de referencia |
|---|---|
| Instalación y backend Django + MySQL | 1–10, 12 y 13 |
| Frontend web Ionic + Angular | 14 y 15 |
| Aplicación Android y reglas de cierre | 1–3, 11, 16, 23–28 |
| Funcionalidad propia en web y Android | 17–22 y 29 |

## 9. Control de versiones y archivos excluidos

El historial Git contiene el commit `07f83ed`, correspondiente a la implementación del seguimiento semanal reactivo, semáforo y alertas en web y Android. El dashboard constituye una ampliación posterior de esa base.

Se verificó que Git no rastrea las rutas `backend/.env`, `backend/.venv/`, `frontend/node_modules/` ni `frontend/dist/`. El archivo `.env.example` se conserva como referencia, sin incluir las credenciales reales del entorno.

## 10. Conclusiones

La práctica permitió integrar el desarrollo web y móvil con una API REST y una base de datos MySQL. El seguimiento semanal incorpora reglas de cumplimiento, alertas y validaciones de modificación que fueron comprobadas en el backend y en Android.

El dashboard reactivo amplía la aplicación mediante indicadores consolidados, filtrado individual y visualización de la evolución semanal. Las pruebas funcionales evidenciaron resultados consistentes en la web y en el emulador Android. La compilación final y las 20 pruebas automáticas completadas satisfactoriamente respaldan el funcionamiento de los componentes evaluados.
