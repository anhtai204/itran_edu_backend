// import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { InjectModel } from '@nestjs/mongoose';
// import { User, UserDocument } from './schemas/user.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class MongoUsersService {
//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
//   ) {}

//   async create(createUserDto: CreateUserDto) {
//     const newUser = new this.userModel(createUserDto);
//     return newUser.save();
//     // return 'This action adds a new user use MongoDB';
//   }

//   async findAll() {
//     // return `This action returns all users use MongoDB`;
//     return this.userModel.find().exec();
//   }

//   async findOne(id: number) {
//     // return `This action returns a #${id} user use MongoDB`;
//     return this.userModel.findById(id).exec();
//   }

//   async update(id: number, updateUserDto: UpdateUserDto) {
//     // return `This action updates a #${id} user use MongoDB`;
//     return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
//   }

//   async remove(id: number) {
//     // return `This action removes a #${id} user use MongoDB`;
//     await this.userModel.findByIdAndDelete(id).exec();
//   }
// }