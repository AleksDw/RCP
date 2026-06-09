from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Dodatkowe informacje', {'fields': ('role',)}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Dodatkowe informacje', {'fields': ('role',)}),
    )
    
admin.site.register(CustomUser, CustomUserAdmin)