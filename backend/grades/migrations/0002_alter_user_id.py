# Generated by Django 5.1.4 on 2025-02-02 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("grades", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
