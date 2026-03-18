# Especificación de Seguridad: Autenticación JWT y Throttling

Actúa como un Arquitecto Backend Senior. Vamos a refactorizar y asegurar la aplicación `users` / `auth` utilizando TDD.

## 1. Requerimientos de Arquitectura
- **JWT:** Reemplaza el token nativo de DRF por JSON Web Tokens utilizando la librería `djangorestframework-simplejwt`. Configura endpoints para obtener el par de tokens (Access y Refresh) y para refrescarlos.
- **Throttling (Rate Limiting):** Aplica la clase `AnonRateThrottle` de DRF en los endpoints de inicio de sesión para mitigar ataques de fuerza bruta (ej. máximo 5 peticiones por minuto para usuarios anónimos).
- **Cero Signals:** NO utilices Django Signals para lógica de creación de usuarios.

## 2. Criterios de Aceptación (Gherkin) para Pytest

Feature: Autenticación Segura
  Scenario: Login exitoso devuelve JWT
    Given un usuario registrado y activo
    When hace un POST al endpoint de login con credenciales válidas
    Then el sistema devuelve un HTTP 200 OK
    And la respuesta contiene un "access" token y un "refresh" token

  Scenario: Prevención de Fuerza Bruta (Throttling)
    Given un usuario anónimo malicioso
    When hace 6 peticiones POST fallidas consecutivas al endpoint de login
    Then en la sexta petición el sistema devuelve un HTTP 429 Too Many Requests

**Instrucción para el Agente:** 
Ejecuta la Fase Roja del TDD. Escribe ÚNICAMENTE los tests en Pytest dentro del módulo correspondiente para cubrir estos escenarios. Ejecútalos para confirmar que fallan y detente a esperar mi aprobación antes de escribir el código de implementación.