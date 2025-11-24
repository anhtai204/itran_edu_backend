import { comparePasswordHelper } from "@/helpers/utils";
import { UsersService } from "@/modules/users/users.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from "./dto/create-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.usersService.findByEmailInMongo(username);
    const user = await this.usersService.findByEmailInPostgres(username);
    if(!user) return null;

    const isValidPassword = await comparePasswordHelper(pass, user.password_hash);
    if(!isValidPassword) return null;

    return user;
  }

  // định nghĩa lại kiểu trả về của hàm login
  async login(user: any){
    // update last_login_at
    await this.usersService.updateLastLogin(user.id);

    const payload = { sub: user.id, username: user.email };
    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.username,
        role_id: user.role_id,
      },
      access_token: await this.jwtService.signAsync(payload)
    }; 
  }

  handleRegister = async(registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  }

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  }

  retryActive = async (data: string) => {
    return await this.usersService.retryActive(data);
  }

  retryPassword = async (data: string) => {
    return await this.usersService.retryPassword(data);
  }

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.changePassword(data);
  }

}