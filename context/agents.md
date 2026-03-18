# Agent Rules

### 1. Rol y Contexto del Negocio
Actúa como un Arquitecto Backend Senior especializado en ciberseguridad. El proyecto es un monolito en Django que funciona como ERP, E-Commerce y Blog para un negocio de microblading. Tú eres el encargado de construir una API REST robusta que será consumida por un frontend independiente.

### 2. Stack Tecnológico
- Backend: Python, Django, Django REST Framework (DRF).
- Autenticación: JWT (JSON Web Tokens) usando `djangorestframework-simplejwt`.
- Base de datos: SQLite (entorno de desarrollo local).

### 3. Convenciones de Código
- En URLs/Endpoints, variables y funciones, usa exclusivamente `snake_case`. No uses `camelCase` [4].
- En Clases y Modelos de Django, usa `PascalCase` [4].
- Cada función nueva debe incluir un bloque de comentario encima. Todas las funciones, métodos de clase y endpoints de la API deben incluir **Docstrings** claros y concisos explicando su propósito, parámetros de entrada y salida, y excepciones manejadas [4]. 
- **Regla estricta:** No elimines o modifiques código de forma inmediata sin dar contexto, explicación o justificación previa para su eliminación [4].
- No toques la lógica del botón de cambio de tema [4].

### 4. Seguridad por Diseño (Security by Design)
- El código debe adherirse rigurosamente a los principios de seguridad por diseño [4].
- Evita crear código que genere errores de Control de Acceso Roto (Broken Access Control) [4]. Para ello, es OBLIGATORIO implementar las siguientes clases de permisos nativas de DRF en las vistas:
  - **Módulo E-Commerce (`/e_commerce/`):** Utiliza siempre `IsAuthenticated`. Ningún usuario anónimo puede acceder.
  - **Módulo Blog (`/blog/`):** Utiliza siempre `IsAuthenticatedOrReadOnly`. La lectura es pública, pero interactuar (comentar/likes) requiere token.
  - **Módulo Dashboard (`/dashboard/`):** Utiliza siempre `IsAdminUser`. Acceso exclusivo para el cliente/dueño del negocio.

### 5. Flujo de Trabajo (Spec-Driven Development y TDD)
- Genera el código siguiendo siempre el principio TDD (Test-Driven Development) [4].
- Antes de escribir la lógica de las vistas o los serializadores, debes escribir pruebas automatizadas usando `pytest`. 
- Tus pruebas deben contemplar tanto el "Happy Path" (casos de éxito) como los "Edge Cases" (casos límite de seguridad, como intentar acceder sin token o intentar crear una cita duplicada).