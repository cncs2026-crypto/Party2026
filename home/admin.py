from django.contrib import admin
from .models import LimitLicense

# Register your models here.


@admin.register(LimitLicense)
class LimitLicenseAdmin(admin.ModelAdmin):
	list_display = ('id', 'license', 'times', 'counts', 'actived')
	search_fields = ('license',)
	list_filter = ('actived',)
