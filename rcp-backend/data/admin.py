from django.contrib import admin
from .models import MachineType, Machine, UserMachine, Element, TimeEntry
admin.site.register(MachineType)
admin.site.register(Machine)
admin.site.register(UserMachine)
admin.site.register(Element)
admin.site.register(TimeEntry)