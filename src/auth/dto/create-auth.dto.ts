import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "email khong duoc de trong"})
    email: string;

    @IsNotEmpty({ message: "password khong duoc de trong"})
    password: string;

    @IsOptional()
    username: string;
}


export class CodeAuthDto {
    @IsNotEmpty({message: "id khong duoc de trong"})
    id: string;

    @IsNotEmpty({ message: "code khong duoc de trong"})
    code: string;
}

export class ChangePasswordAuthDto {
    @IsNotEmpty({message: "code khong duoc de trong"})
    code: string;

    @IsNotEmpty({ message: "password khong duoc de trong"})
    password: string;

    @IsNotEmpty({message: "confirmPassword khong duoc de trong"})
    confirmPassword: string;

    @IsNotEmpty({ message: "email khong duoc de trong"})
    email: string;
}