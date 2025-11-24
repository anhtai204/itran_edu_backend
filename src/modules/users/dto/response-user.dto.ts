import { Exclude } from 'class-transformer';

export class UserDto {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  address: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role_id: number;
  is_active: boolean;
  last_login_at: Date | null;
  failed_login_attempts: number | null;
  date_of_birth: Date | null;
  gender: string | null;
  notification_preferences: JSON | null;
  created_at: Date;
  updated_at: Date;
  roles: { id: number; name: string }[] ;

  @Exclude()
  password_hash: string;

  @Exclude()
  code_id: string;

  @Exclude()
  code_expired: Date;
}