# Generated by Django 4.2.7 on 2024-05-29 17:07

from django.db import migrations, models
import shortuuid.django_fields


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0004_tax_notification_productfaq_review_wishlist'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cartorder',
            name='postal_code',
        ),
        migrations.AlterField(
            model_name='cartorder',
            name='oid',
            field=shortuuid.django_fields.ShortUUIDField(alphabet='abcdefg12345', length=10, max_length=10, prefix='', unique=True),
        ),
        migrations.AlterField(
            model_name='cartorder',
            name='order_status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Fulfilled', 'Fulfilled'), ('Cancelled', 'Cancelled')], default='Pending', max_length=100),
        ),
        migrations.AlterField(
            model_name='cartorder',
            name='payment_status',
            field=models.CharField(choices=[('paid', 'Paid'), ('pending', 'Pending'), ('processing', 'Processing'), ('cancelled', 'Cancelled')], default='initiated', max_length=100),
        ),
        migrations.AlterField(
            model_name='cartorderitem',
            name='oid',
            field=shortuuid.django_fields.ShortUUIDField(alphabet='abcdefg12345', length=10, max_length=10, prefix='', unique=True),
        ),
        migrations.AlterField(
            model_name='cartorderitem',
            name='qty',
            field=models.IntegerField(default=0),
        ),
    ]
