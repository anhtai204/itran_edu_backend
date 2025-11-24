import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Public } from '@/decorator/customize';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/response-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // MongoDBMongoDB
  @Post('mongo')
  createMongo(@Body() createUserDto: CreateUserDto) {
    console.log('>>> check createUserDto: ', createUserDto);
    return this.usersService.createInMongo(createUserDto);
  }

  @Get('mongo')
  @Public()
  async findAllMongo(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAllInMongo(query, +current, +pageSize);
  }

  @Get('mongo/:id')
  findOneMongo(@Param('id') id: string) {
    return this.usersService.findOneInMongo(+id);
  }

  @Patch('mongo')
  updateMongo(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateInMongo(updateUserDto);
  }

  @Delete('mongo/:id')
  removeMongo(@Param('id') id: string): Promise<any> {
    return this.usersService.removeInMongo(id);
  }

  // PostgreDB
  @Post('postgres')
  createPostgres(@Body() createUserDto: CreateUserDto) {
    console.log('>>> check createUserDto: ', createUserDto);
    return this.usersService.createInPostgres(createUserDto);
  }

  @Get()
  @Public()
  async getALlUser() {
    return this.usersService.find();
  }

  @Get('postgres')
  @Public()
  async findAllPostgres(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAllInPostgres(query, +current, +pageSize);
  }

  @Patch('postgres/change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    return this.usersService.changePasswordWithoutCode(
      id,
      oldPassword,
      newPassword,
      confirmPassword,
    );
  }

  @Get('postgres/:id')
  findOnePostgres(@Param('id') id: string) {
    return this.usersService.findOneInPostgres(id);
  }

  @Patch('postgres/:id')
  @Public()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('An error occurred while updating the user');
    }
  }

  @Patch('postgres')
  updatePostgres(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateInPostgres(updateUserDto);
  }

  @Delete('postgres/:id')
  removePostgres(@Param('id') id: string): Promise<any> {
    return this.usersService.removeInPostgres(id);
  }

  
}
