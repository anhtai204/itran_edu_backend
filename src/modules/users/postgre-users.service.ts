// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { UserEntity } from "./entities/users.entity";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { Repository } from "typeorm";
// import { UpdateUserDto } from "./dto/update-user.dto";

// @Injectable()
// export class PostgresUsersService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//   ) {}

//   async create(createUserDto: CreateUserDto): Promise<UserEntity> {
//     const newUser = this.userRepository.create(createUserDto);
//     return this.userRepository.save(newUser);
//   }

//   async findAll() {
//     // return `This action returns all users use PostgreSQL`;
//     return this.userRepository.find();
//   }

//   async findOne(id: number) {
//     // return `This action returns a #${id} user use PostgreSQL`;
//     return this.userRepository.findOne({ where: { id } });
//   }

//   async update(id: number, updateUserDto: UpdateUserDto) {
//     // return `This action updates a #${id} user use PostgreSQL`;
//     await this.userRepository.update(id, updateUserDto);
//     return this.findOne(id);
//   }

//   async remove(id: number) {
//     // return `This action removes a #${id} user use PostgreSQL`;
//     await this.userRepository.delete(id);
//   }
// }