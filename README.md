# Paz Consultorio Dietético - Frontend (React + TypeScript)

Este es el frontend interactivo y premium para la gestión de **Paz Consultorio Dietético**. La aplicación está desarrollada con **React**, **TypeScript** y **Tailwind CSS**, y se conecta en tiempo real a una API REST implementada con **Django** y **Django REST Framework**.

El diseño del proyecto sigue estrictamente el patrón de **Clean Architecture** (Arquitectura Limpia) y el control de acceso basado en roles (RBAC).

---

## 🚀 Requisitos e Instalación

### 1. Requisitos Previos
* **Node.js** (versión 18 o superior)
* **npm** (versión 9 o superior)
* **Backend de Django** iniciado y accesible (en local `http://localhost:8000` o en producción).

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto para conectar el frontend con la API:
```env
VITE_API_BASE_URL=https://nutritec.uaeftt-ute.site/api
```

### 3. Instalar Dependencias
Instala los paquetes necesarios definidos en el archivo `package.json`:
```bash
npm install
```

### 4. Ejecución del Proyecto
* **Modo Desarrollo**: Levanta el servidor local interactivo de Vite en `http://localhost:5173`.
  ```bash
  npm run dev
  ```
* **Producción (Build)**: Compila y genera el paquete de producción en la carpeta `dist/`.
  ```bash
  npm run build
  ```

---

## 🏛️ Estructura del Proyecto: Arquitectura Limpia (Clean Architecture)

El código fuente del frontend está organizado bajo el siguiente patrón de diseño desacoplado:

```
src/
├── domain/                      # Capa del Dominio (Reglas e Interfaces puras)
│   ├── entities/                # Entidades principales (User, Paciente, Plan, etc.)
│   ├── enums/                   # Enums globales de control (e.g., roles de usuario)
│   ├── exceptions/              # Manejo personalizado de excepciones
│   ├── ports/                   # Interfaces del Repositorio (puertos de comunicación)
│   └── services/                # Reglas de negocio puras
│
├── application/                 # Capa de Aplicación (Casos de Uso)
│   ├── use-cases/               # Casos de uso de autenticación, pacientes, planes y chat
│   └── dtos/                    # DTOs (Data Transfer Objects) para peticiones a la API
│
├── infrastructure/              # Capa de Infraestructura (Implementaciones Técnicas)
│   ├── config/                  # Configuración de URLs y variables de entorno
│   ├── http/                    # Cliente HTTP centralizado (Axios) y parseo de errores de API
│   ├── storage/                 # Persistencia del token JWT en localStorage
│   ├── adapters/                # Adaptadores de repositorios (Consumo real de API Django)
│   └── factories/               # Factorías para inyección de dependencias (wiring)
│
└── presentation/                # Capa de Presentación (Interfaz de Usuario)
    ├── theme/                   # Paleta de colores global y temas
    ├── utils/                   # Utilidades generales (formateadores, cn helper)
    ├── store/                   # Manejadores de estado global de Zustand (Zustand + UseCases)
    ├── pages/                   # Páginas públicas y privadas (Dashboard, Plan, Chat, Recetas, etc.)
    ├── components/              # Componentes visuales atómicos e interactivos
    └── router/                  # AppRouter con guards de protección de rutas y permisos RBAC
```

---

## 🛡️ Control de Acceso por Roles (RBAC) y Seguridad

La aplicación cuenta con protección estricta de rutas privadas y elementos dinámicos en la interfaz según el rol del usuario:

1. **Parte Pública**:
   * **Landing Page (`/`)**: Página de inicio, catálogo de planes y sección de contacto accesibles sin autenticación.
2. **Parte Privada (Protegida)**:
   * **Paciente (`/patient/*`)**: Rutas accesibles únicamente para usuarios autenticados con rol `paciente`. Permite ver la dieta asignada, recetas y chatear con su nutricionista.
   * **Administración (`/admin/*`)**: Rutas de gestión accesibles únicamente para los roles `ADMIN` y `NUTRICIONISTA`.
3. **Reglas de Negocio en la UI según Rol**:
   * **Rol ADMIN**: Cuenta con permisos de CRUD completo. Es el único que tiene visibilidad y acceso para **Eliminar** registros (Pacientes, Planes, Recetas).
   * **Rol NUTRICIONISTA (EDITOR/OPERADOR)**: Puede visualizar, crear y editar registros, pero la interfaz oculta automáticamente el botón de **Eliminar** y restringe estas peticiones para cumplir con las políticas de negocio asignadas.

---

## 🔑 Credenciales de Prueba (Semillero)

Si ejecutaste el semillero del backend (`seed_data.py`), puedes utilizar los siguientes perfiles de prueba:

| Rol | Usuario | Contraseña | Permisos y Restricciones |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `Admin1234` | CRUD total. Puede listar, crear, editar y eliminar cualquier recurso. |
| **Nutricionista** | `nutri_pro` | `Admin1234` | CRUD de Pacientes y Planes. Botón de **Eliminar** bloqueado. |
| **Paciente** | `john` | `12345678` | Panel de paciente. Visualiza su plan nutricional, recetas, chat y consumo de agua. |

---

## 📦 Documentación del Despliegue CI/CD

El proyecto frontend se despliega automáticamente en cada subida a la rama `main` a través de un pipeline automatizado de **GitHub Actions**.

### ⚙️ Pipeline de GitHub Actions (`.github/workflows/deploy.yml`)
El flujo automatizado realiza las siguientes tareas de forma continua:
1. **Checkout**: Descarga el código fuente en el runner virtual.
2. **Setup Node**: Prepara el entorno de Node.js v20.
3. **Create env for build**: Escribe la variable `VITE_API_BASE_URL` a partir del secreto de GitHub `REACT_ENV`.
4. **Install deps & Build**: Instala dependencias y compila la versión optimizada del frontend (`npm run build`).
5. **Upload build to VPS**: Transfiere los archivos generados en `dist/` al servidor VPS mediante protocolo seguro SCP utilizando el secreto `VPS_HOST`.
6. **Activate build on VPS**: Ejecuta comandos vía SSH para colocar los archivos finales en `/var/www/Paz_Consultorio_Dietetico_React`, les asigna los permisos necesarios para el servidor web (`www-data:www-data`), verifica la configuración de Nginx y recarga el servicio de forma limpia.

### 🔑 Secretos Requeridos en GitHub
Para el funcionamiento correcto del despliegue automático, se configuraron los siguientes secretos en el repositorio de GitHub (**Settings > Secrets and variables > Actions**):
* `REACT_ENV`: Contenido del archivo `.env.production` (e.g., `VITE_API_BASE_URL=https://nutritec.uaeftt-ute.site/api`).
* `VPS_HOST`: Dirección IP pública del servidor VPS.
* `VPS_USER`: Usuario del servidor con permisos de administración (e.g., `root` o `czdarkfenix`).
* `VPS_KEY`: Clave SSH privada para la autenticación sin contraseña del pipeline.
