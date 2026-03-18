# Especificación de Seguridad y Citas (Django REST Framework)

Actúa como un Arquitecto Backend Senior. Implementa las siguientes reglas de negocio utilizando la metodología TDD (Red-Green-Refactor).

## 1. Reglas de Seguridad (Permisos)
- En la app `e_commerce`, todas las vistas (Cursos, Servicios) deben estar protegidas con la clase `IsAuthenticated`.
- En la app `blog`, las vistas de lectura de Posts deben ser públicas, pero la creación de Comentarios y Likes debe estar protegida usando `IsAuthenticatedOrReadOnly`.
- En la app `dashboard`, todas las vistas deben usar `IsAdminUser`.

## 2. Lógica Anti-Duplicado (Citas)
- En el modelo `Cita` (app `e_commerce`), implementa una validación a nivel de modelo y serializador que impida crear dos citas en la misma fecha y hora exacta. 

## Criterios de Aceptación (Gherkin) para los Tests en Pytest:

Feature: Seguridad del Blog
  Scenario: Interacción bloqueada para anónimos
    Given un usuario no autenticado
    When intenta hacer un POST a /blog/comentarios/
    Then el sistema devuelve un error HTTP 401 Unauthorized

Feature: Motor de Reservas
  Scenario: Prevención de doble reserva (Double Booking)
    Given una cita ya agendada para el "2026-05-20 a las 10:00 AM"
    When otro usuario intenta agendar una cita en la misma fecha y hora
    Then el sistema devuelve un error HTTP 400 Bad Request indicando que el horario no está disponible

**Instrucción para el Agente:** 
No escribas la lógica de las vistas todavía. Escribe ÚNICAMENTE los tests en Pytest para comprobar estos escenarios y detente para que yo los revise.