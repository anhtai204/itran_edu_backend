import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { RolePermissionsController } from './role_permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermission, RolePermissionSchema } from './schema/role.permission.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionEntity } from './entities/role_permission.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: RolePermission.name, schema: RolePermissionSchema}]),
  TypeOrmModule.forFeature([RolePermissionEntity])],
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
  exports: [RolePermissionsService],
})

export class RolePermissionsModule {}
