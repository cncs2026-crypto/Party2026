from django.db import models

# Create your models here.


class LimitLicense(models.Model):
	license = models.CharField(max_length=255)
	times = models.CharField(max_length=50, blank=True, null=True)
	counts = models.IntegerField(default=0)
	actived = models.IntegerField(default=0)

	class Meta:
		managed = False
		db_table = '_limit_'
		verbose_name = 'License giới hạn'
		verbose_name_plural = 'License giới hạn'

	def __str__(self):
		return f"{self.license} | lượt còn: {self.counts}"
