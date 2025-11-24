import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthSessionDto } from './create-auth_session.dto';

export class UpdateAuthSessionDto extends PartialType(CreateAuthSessionDto) {}
