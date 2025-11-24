import { Module } from '@nestjs/common';
import { OauthConnectionsService } from './oauth_connections.service';
import { OauthConnectionsController } from './oauth_connections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OauthConnection, OauthConnectionSchema } from './schema/oauth_connection.schem';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthConnectionEntity } from './entities/oauth_connection.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: OauthConnection.name, schema: OauthConnectionSchema}]),
  TypeOrmModule.forFeature([OauthConnectionEntity])],
  controllers: [OauthConnectionsController],
  providers: [OauthConnectionsService],
  exports: [OauthConnectionsService],
})

export class OauthConnectionsModule {}
