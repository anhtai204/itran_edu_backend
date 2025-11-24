import { PartialType } from '@nestjs/mapped-types';
import { CreateOauthConnectionDto } from './create-oauth_connection.dto';

export class UpdateOauthConnectionDto extends PartialType(CreateOauthConnectionDto) {}
