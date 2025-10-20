from django.contrib import admin

# Register your models here.
from .models import ItemPortafolio, ContactoPortafolio

class ItemPortafolioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'fecha_trabajo')

admin.site.register(ItemPortafolio, ItemPortafolioAdmin)
admin.site.register(ContactoPortafolio)