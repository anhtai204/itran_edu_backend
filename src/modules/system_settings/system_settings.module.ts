import { Module } from '@nestjs/common';
import { SystemSettingsService } from './system_settings.service';
import { SystemSettingsController } from './system_settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemSetting, SystemSettingSchema } from './schema/system_setting.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettingEntity } from './entities/system_setting.entity';


@Module({
  imports: [MongooseModule.forFeature([{ name: SystemSetting.name, schema: SystemSettingSchema}]),
  TypeOrmModule.forFeature([SystemSettingEntity])],
  controllers: [SystemSettingsController],
  providers: [SystemSettingsService],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}
