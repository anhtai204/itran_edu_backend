import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Sử dụng chiến lược xác thực local qua tên đăng nhập và mật khẩu
@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){}