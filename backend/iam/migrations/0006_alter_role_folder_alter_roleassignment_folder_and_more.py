# Generated by Django 5.1.1 on 2024-09-12 15:00

import django.db.models.deletion
import iam.models
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("iam", "0005_alter_user_managers"),
    ]

    operations = [
        migrations.AlterField(
            model_name="role",
            name="folder",
            field=models.ForeignKey(
                default=iam.models.Folder.get_root_folder_id,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="%(class)s_folder",
                to="iam.folder",
            ),
        ),
        migrations.AlterField(
            model_name="roleassignment",
            name="folder",
            field=models.ForeignKey(
                default=iam.models.Folder.get_root_folder_id,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="%(class)s_folder",
                to="iam.folder",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="folder",
            field=models.ForeignKey(
                default=iam.models.Folder.get_root_folder_id,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="%(class)s_folder",
                to="iam.folder",
            ),
        ),
        migrations.AlterField(
            model_name="usergroup",
            name="folder",
            field=models.ForeignKey(
                default=iam.models.Folder.get_root_folder_id,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="%(class)s_folder",
                to="iam.folder",
            ),
        ),
    ]
