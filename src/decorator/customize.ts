import { SetMetadata } from "@nestjs/common";
// Public Guard cho phép truy cập endpoint mà không cần xác thực qua local strategy
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) => 
    SetMetadata(RESPONSE_MESSAGE, message);