import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEnum, IsJSON, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Notifications } from '../entities/users.entity';

// export class UpdateUserDto {
//     @IsNotEmpty({message: "id khong duoc de trong"})
//     id: string;

//     @IsOptional()
//     username: string;

//     @IsOptional()
//     phone: string;

//     @IsOptional()
//     address: string;

//     @IsOptional()
//     avatar_url: string;

//     @IsOptional()
//     role_id: string;
// }

enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
  }
  
  export class UpdateUserDto {

    // @IsNotEmpty({message: "id khong duoc de trong"})
    id: string;

    @IsString()
    @IsOptional()
    username?: string;
  
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsOptional()
    phone?: string;
  
    @IsString()
    @IsOptional()
    address?: string;
  
    @IsString()
    @IsOptional()
    full_name?: string;
  
    @IsString()
    @IsOptional()
    avatar_url?: string;
  
    @IsString()
    @IsOptional()
    bio?: string;
  
    @IsString()
    @IsOptional()
    date_of_birth?: string;
  
    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;
  
    @IsOptional()
    notification_preferences?: Notifications[];
  }