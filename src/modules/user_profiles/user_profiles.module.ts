import { Module } from '@nestjs/common';
import { UserProfilesService } from './user_profiles.service';
import { UserProfilesController } from './user_profiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfile, UserProfileSchema } from './schemas/user_profile.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from './entities/user_profile.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserProfile.name, schema: UserProfileSchema}]),
  TypeOrmModule.forFeature([UserProfileEntity])],
  controllers: [UserProfilesController],
  providers: [UserProfilesService],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}
