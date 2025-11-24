import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {  User, UserSchema } from './schemas/user.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import { RoleEntity } from '../roles/entities/role.entity';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
//     TypeOrmModule.forFeature([User])],
//   controllers: [UsersController],
//   providers: [UsersService, PostgresUsersService, MongoUsersService],
// })
// export class UsersModule {}

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
  TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
