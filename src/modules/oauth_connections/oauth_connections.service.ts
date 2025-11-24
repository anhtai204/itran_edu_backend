import { Injectable } from '@nestjs/common';
import { CreateOauthConnectionDto } from './dto/create-oauth_connection.dto';
import { UpdateOauthConnectionDto } from './dto/update-oauth_connection.dto';

@Injectable()
export class OauthConnectionsService {
  create(createOauthConnectionDto: CreateOauthConnectionDto) {
    return 'This action adds a new oauthConnection';
  }

  findAll() {
    return `This action returns all oauthConnections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oauthConnection`;
  }

  update(id: number, updateOauthConnectionDto: UpdateOauthConnectionDto) {
    return `This action updates a #${id} oauthConnection`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauthConnection`;
  }
}
