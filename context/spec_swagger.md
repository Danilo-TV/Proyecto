# Especificación de Arquitectura: Documentación Interactiva de la API

Actúa como un Arquitecto Backend Senior. Nuestro código ya está estructurado y necesitamos generar la documentación OpenAPI (Swagger y ReDoc) para entregarla al equipo de Frontend.

## Requerimientos de Arquitectura
1. **Librería:** Utiliza `drf-yasg` para la generación automática de la documentación Swagger/OpenAPI 2.0.
2. **Configuración en `settings.py`:** Añade `drf_yasg` a la lista de `INSTALLED_APPS`.
3. **Enrutamiento (urls.py central):** 
   - Configura las rutas `/swagger/` y `/redoc/` importando `schema_view` de `drf_yasg.views`.
   - Asegúrate de definir la información pública de la API en el `openapi.Info` (Título: "API Microblading ERP", Versión: "v1", Descripción: "Documentación oficial del backend para el E-Commerce y Dashboard").
4. **Seguridad en la Documentación:** La vista de la documentación debe ser pública (`permissions.AllowAny`) para que el equipo frontend pueda consultarla sin necesidad de un JWT.
