import { Injectable } from '@nestjs/common';
import { CreateAuthSessionDto } from './dto/create-auth_session.dto';
import { UpdateAuthSessionDto } from './dto/update-auth_session.dto';

@Injectable()
export class AuthSessionsService {
  create(createAuthSessionDto: CreateAuthSessionDto) {
    return 'This action adds a new authSession';
  }

  findAll() {
    return `This action returns all authSessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authSession`;
  }

  update(id: number, updateAuthSessionDto: UpdateAuthSessionDto) {
    return `This action updates a #${id} authSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} authSession`;
  }
}
