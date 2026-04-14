from django.contrib import admin
from .models import Element

@admin.register(Element)
class ElementAdmin(admin.ModelAdmin):
    list_display = ('number', 'symbol', 'name', 'mass', 'category', 'electrons', 'discovery', 'color', 'config', 'radius', 'ionization', 'electronegativity', 'period', 'group', 'summary')

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False