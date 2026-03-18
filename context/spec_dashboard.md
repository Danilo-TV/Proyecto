# Especificación de Arquitectura: Módulo Dashboard

Actúa como un Arquitecto Backend Senior. Vamos a implementar la lógica del panel de control para el dueño del negocio en la app `dashboard` utilizando TDD.

## 1. Requerimientos de Arquitectura y Seguridad
- **Permisos Estrictos:** Todas las vistas dentro de la app `dashboard` deben estar protegidas OBLIGATORIAMENTE con la clase de permiso `IsAdminUser` de DRF. Ningún usuario anónimo ni cliente normal puede acceder.
- **Agregador de Datos (Solo Lectura):** Crea un endpoint `/dashboard/resumen/` que devuelva un JSON con métricas agregadas. Debe consultar e incluir:
  a) El número total de Citas agendadas (leyendo el modelo `Cita` de la app `e_commerce`).
  b) El número total de mensajes de contacto (leyendo el modelo correspondiente en la app `portafolio`).
- **No crees nuevos modelos de base de datos.** Reutiliza los modelos existentes de las otras aplicaciones.

## 2. Criterios de Aceptación (Gherkin) para Pytest

Feature: Seguridad y Métricas del Dashboard
  Scenario: Acceso denegado a clientes normales
    Given un usuario autenticado pero con rol normal (no staff/admin)
    When intenta hacer un GET a /dashboard/resumen/
    Then el sistema devuelve un error HTTP 403 Forbidden

  Scenario: Acceso exitoso para el Administrador
    Given un usuario administrador (is_staff=True) autenticado con JWT
    When hace un GET a /dashboard/resumen/
    Then el sistema devuelve un HTTP 200 OK con el conteo de Citas y Contactos