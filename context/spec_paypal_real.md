# Misión: Refactorización a la API Real de PayPal

Actúa como un Arquitecto Backend Senior. Ya tenemos los tests en verde usando Mocks. Ahora vamos a refactorizar las vistas de `e_commerce/views.py` para que hagan la llamada real a la API de PayPal.

## Tareas a realizar en `views.py`:
1. **Credenciales:** Lee `PAYPAL_CLIENT_ID` y `PAYPAL_SECRET` desde la configuración de Django (`settings.py`).
2. **Generar Token de Acceso (PayPal):** Crea una función de utilidad interna que haga un POST a `https://api-m.sandbox.paypal.com/v1/oauth2/token` usando autenticación básica (Basic Auth) con el Client ID y Secret para obtener un `access_token` de PayPal.
3. **Refactor de IniciarPagoPayPalView:** 
   - Llama a la función anterior para obtener el token.
   - Modifica el `requests.post` para crear una orden en `https://api-m.sandbox.paypal.com/v2/checkout/orders`.
   - Pasa el `access_token` en los headers (`Authorization: Bearer <token>`, `Content-Type: application/json`).
   - El payload JSON debe incluir `intent: "CAPTURE"` y un arreglo `purchase_units` con el precio de la Cita.
   - Extrae el link con `rel="approve"` de la respuesta de PayPal y devuélvelo en el JSON de respuesta.

**ALTO:** Realiza la implementación y vuelve a correr `pytest`. Como nuestros tests ya mockean `requests.post`, **deberás ajustar los mocks en `test_paypal.py`** para que soporten la nueva estructura de múltiples llamadas (una para el token y otra para la orden) y devuelvan las respuestas simuladas correctas. Avísame cuando los tests vuelvan a estar en verde.