# Especificación de Arquitectura: Pasarela de Pagos (PayPal)

Actúa como un Arquitecto Backend Senior. Vamos a implementar la lógica de pagos con PayPal en la app `e_commerce` utilizando TDD y Mocks.

## 1. Requerimientos de Arquitectura
- **Seguridad:** Todos los endpoints de pago deben requerir autenticación OBLIGATORIA (`IsAuthenticated`).
- **Mocks para Testing:** Es OBLIGATORIO usar el decorador `@patch` de `unittest.mock` en los tests de Pytest para interceptar y simular las peticiones HTTP a la API de PayPal. Ningún test debe hacer llamadas reales a internet para evitar tests frágiles y lentos.
- **Endpoints requeridos (APIViews):**
  1. `POST /e_commerce/pagar/`: Inicia la intención de pago y devuelve una URL de aprobación simulada al cliente.
  2. `POST /e_commerce/confirmar-pago/`: Recibe la confirmación (token) y marca la `Cita` o `VentaCurso` correspondiente como "Pagada".

## 2. Criterios de Aceptación (Gherkin) para Pytest

Feature: Integración de Pagos con PayPal
  Scenario: Inicialización de pago exitosa
    Given un usuario autenticado y una Cita en estado pendiente
    When hace un POST a `/e_commerce/pagar/` con el ID de la Cita
    Then la API de PayPal es mockeada (interceptada con @patch)
    And el sistema devuelve un HTTP 200 OK con una "approval_url"

  Scenario: Confirmación de pago actualiza el estado
    Given un pago previamente iniciado
    When hace un POST a `/e_commerce/confirmar-pago/` con el token de PayPal
    Then la API de validación de PayPal es mockeada para retornar éxito
    And el sistema marca la Cita como pagada en la base de datos
    And el sistema devuelve un HTTP 200 OK
