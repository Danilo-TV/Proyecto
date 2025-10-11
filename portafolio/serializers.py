from rest_framework import serializers
from .models import ItemPortafolio, ContactoPortafolio

class ItemPortafolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPortafolio
        fields = '__all__'

class ContactoPortafolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactoPortafolio
        fields = '__all__'
