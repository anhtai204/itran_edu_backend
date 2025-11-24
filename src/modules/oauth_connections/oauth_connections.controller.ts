import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OauthConnectionsService } from './oauth_connections.service';
import { CreateOauthConnectionDto } from './dto/create-oauth_connection.dto';
import { UpdateOauthConnectionDto } from './dto/update-oauth_connection.dto';

@Controller('oauth-connections')
export class OauthConnectionsController {
  constructor(private readonly oauthConnectionsService: OauthConnectionsService) {}

  @Post()
  create(@Body() createOauthConnectionDto: CreateOauthConnectionDto) {
    return this.oauthConnectionsService.create(createOauthConnectionDto);
  }

  @Get()
  findAll() {
    return this.oauthConnectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oauthConnectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOauthConnectionDto: UpdateOauthConnectionDto) {
    return this.oauthConnectionsService.update(+id, updateOauthConnectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oauthConnectionsService.remove(+id);
  }
}
