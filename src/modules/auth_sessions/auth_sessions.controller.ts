import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthSessionsService } from './auth_sessions.service';
import { CreateAuthSessionDto } from './dto/create-auth_session.dto';
import { UpdateAuthSessionDto } from './dto/update-auth_session.dto';

@Controller('auth-sessions')
export class AuthSessionsController {
  constructor(private readonly authSessionsService: AuthSessionsService) {}

  @Post()
  create(@Body() createAuthSessionDto: CreateAuthSessionDto) {
    return this.authSessionsService.create(createAuthSessionDto);
  }

  @Get()
  findAll() {
    return this.authSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authSessionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthSessionDto: UpdateAuthSessionDto) {
    return this.authSessionsService.update(+id, updateAuthSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authSessionsService.remove(+id);
  }
}
