# Consultorio Dietético - Frontend en React

Este es el frontend interactivo en **React** y **Tailwind CSS** para la gestión del Consultorio Dietético. La aplicación se conecta en tiempo real a una API REST implementada en **Django** y **Django REST Framework**, siguiendo un enfoque estricto de **Clean Architecture** (Arquitectura Limpia).

---

## 🚀 Requisitos e Instalación

### 1. Requisitos Previos
- **Node.js** (versión 18 o superior)
- **npm** (o yarn/pnpm)
- **Django Backend** iniciado localmente en `http://localhost:8000`.

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto (o edita el existente):
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Iniciar en Modo de Desarrollo
```bash
npm run dev
```
La aplicación web se abrirá en `http://localhost:5173`.

---

## 🔑 Credenciales de Prueba

La base de datos del backend puede poblarse ejecutando el semillero en la carpeta del backend:
```bash
python seed_data.py
```

Esto habilitará los siguientes usuarios de prueba:

| Rol | Usuario | Contraseña | Permisos y Limitaciones |
| :--- | :--- | :--- | :--- |
| **Nutricionista** | `nutri_pro` | `Admin1234` | CRUD de Pacientes y Planes (Botón "Eliminar" bloqueado por rol). |
| **Administrador** | `admin` | `Admin1234` | Acceso CRUD total (puede crear, editar y eliminar). |
| **Paciente** | `john` | `12345678` | Panel de paciente, visualiza su dieta, agua, y sube fotos de progreso. |

---

## 🏛️ Estructura del Proyecto: Arquitectura Limpia

El código está estructurado bajo las capas de Clean Architecture requeridas por la rúbrica:

```
src/
├── domain/                  # Entidades puras y puertos (interfaces)
│   ├── entities/            # user.entity.ts (User, Paciente, Plan)
│   ├── enums/               # role.enum.ts (UserRole)
│   ├── exceptions/          # Excepciones personalizadas
│   ├── ports/               # auth, paciente, plan, photo repositories
│   └── services/            # Reglas puras
│
├── application/             # Casos de uso y DTOs
│   ├── use-cases/           # auth, paciente, plan, photo use-cases
│   └── dtos/                # Interfaces de transferencia de datos
│
├── infrastructure/          # Detalles técnicos externos y adaptadores
│   ├── config/              # api.config.ts
│   ├── http/                # axios-client.ts, parse-api-error.ts
│   ├── storage/             # local-token-storage.ts (JWT localStorage)
│   ├── adapters/            # axios-*.repository.ts (Implementa los ports)
│   └── factories/           # Instanciación y wiring de adaptadores con use-cases
│
└── presentation/            # Vistas, estilos y estados de React
    ├── theme/               # Colores globales de Tailwind
    ├── utils/               # cn.ts, formatters.ts
    ├── store/               # Zustand stores (useAuthStore, usePacienteStore, etc.)
    ├── pages/               # LandingPage, LoginPage, RegisterPage, Admin & Patient pages
    ├── components/          # Componentes visuales reutilizables
    └── router/              # AppRouter con guards de rutas privadas y RBAC
```

---

## 🛡️ Control de Acceso por Roles (RBAC)
- **Rutas Públicas**: `/` (Landing Page informativa y de contacto) es accesible sin iniciar sesión.
- **Rutas de Paciente**: `/patient/*` requiere autenticación y rol `paciente`. Bloquea accesos a `/admin`.
- **Rutas de Administración**: `/admin/*` requiere autenticación y rol `admin` o `nutricionista`.
- **Reglas de Negocio en la UI**: El botón de **Eliminar** (tanto en el módulo de Pacientes como en el de Planes) está deshabilitado y bloqueado con un candado si el rol del usuario autenticado es `nutricionista`. Solo los usuarios con rol `admin` tienen permiso para eliminar registros.

---

## 📷 Guardado Local de Imágenes
En el panel del paciente (`/patient/photos`), el paciente puede seleccionar una imagen local y escribir una anotación. Al presionar **Subir**, la imagen se envía mediante una petición `multipart/form-data` al endpoint `/api/progresos-fotos/` del backend. El archivo se almacena físicamente en el disco local dentro del directorio `media/progresos_fotos/` del backend en lugar de utilizar CDNs externos.

---

## 📦 Instrucciones del Despliegue CI/CD

Para automatizar la compilación y entrega del proyecto, se propone la integración de **GitHub Actions** y el despliegue en **Render** (o Vercel):

### ⚙️ GitHub Actions Workflow (Integración Continua)
Crea un archivo `.github/workflows/ci.yml`:
```yaml
name: CI React Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: TypeScript Check
      run: npx tsc --noEmit

    - name: Build production bundle
      run: npm run build
      env:
        VITE_API_BASE_URL: https://su-backend-django.site/api
```

### 🌐 Despliegue de Producción (Render / Vercel)
1. **Frontend en Vercel/Render**:
   - Conecta tu repositorio de GitHub.
   - Configura el comando de compilación: `npm run build`.
   - Configura el directorio de salida: `dist`.
   - Agrega la variable de entorno `VITE_API_BASE_URL` apuntando a tu servidor Django de producción.
2. **Backend en Render / VPS**:
   - Asegúrate de configurar la carpeta `media/` con volumen persistente en Render para que las imágenes físicas subidas por los pacientes no se borren en cada despliegue.
