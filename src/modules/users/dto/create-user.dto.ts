import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "name khong duoc de trong"})
    username: string;

    @IsNotEmpty({message: "email khong duoc de trong"})
    @IsEmail({}, {message: "email khong duoc de trong"})
    email: string;

    @IsNotEmpty({message: "password khong duoc de trong"})
    password: string;

    phone: string;
    address: string;
    avatar_url: string;

}
