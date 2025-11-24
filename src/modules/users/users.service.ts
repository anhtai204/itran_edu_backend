import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { hashPasswordHelpers } from '@/helpers/utils';
import aqp from 'api-query-params';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateAuthDto,
} from '@/auth/dto/create-auth.dto';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { RoleEntity } from '../roles/entities/role.entity';
import { UserDto } from './dto/response-user.dto';
import { plainToClass } from 'class-transformer';

import bcrypt = require('bcrypt')

@Injectable()
export class UsersService {
  constructor(
    // private readonly mongoUsersService: MongoUsersService,
    // private readonly postgresUsersService: PostgresUsersService,

    // mongo
    @InjectModel(User.name) private userModel: Model<User>,

    // postgres
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,

    private readonly mailerService: MailerService,
  ) {}

  // Sử dụng MongoDB
  // createInMongo(createUserDto: CreateUserDto) {
  //   return this.mongoUsersService.create(createUserDto);
  //   // return 'This action adds a new user use MongoDB';
  // }

  // findAllInMongo() {
  //   return this.mongoUsersService.findAll();
  //   // return `This action returns all users use MongoDB`;

  // }

  // findOneInMongo(id: number) {
  //   return this.mongoUsersService.findOne(id);
  //   // return `This action returns a #${id} user use MongoDB`;
  // }

  // updateInMongo(id: number, updateUserDto: any) {
  //   return this.mongoUsersService.update(id, updateUserDto);
  //   // return `This action updates a #${id} user use MongoDB`;
  // }

  // removeInMongo(id: number) {
  //   return this.mongoUsersService.remove(id);
  //   // return `This action removes a #${id} user use MongoDB`;
  // }

  // // Sử dụng PostgreSQL
  // createInPostgres(createUserDto: CreateUserDto) {
  //   // return this.postgresUsersService.create(createUserDto);
  //   return 'This action adds a new user use PostgreSQL';
  // }

  // findAllInPostgres() {
  //   return this.postgresUsersService.findAll();
  //   // return `This action returns all users use PostgreSQL`;
  // }

  // findOneInPostgres(id: number) {
  //   return this.postgresUsersService.findOne(id);
  //   // return `This action returns a #${id} user use PostgreSQL`;
  // }

  // updateInPostgres(id: number, updateUserDto: any) {
  //   return this.postgresUsersService.update(id, updateUserDto);
  //   // return `This action updates a #${id} user use PostgreSQL`;
  // }

  // removeInPostgres(id: number) {
  //   return this.postgresUsersService.remove(id);
  //   // return `This action removes a #${id} user use PostgreSQL`;

  // }

  isEmailExistInMongo = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };

  async createInMongo(createUserDto: CreateUserDto) {
    const { username, email, password, phone, address, avatar_url } =
      createUserDto;

    // check email
    const isExist = await this.isEmailExistInMongo(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} exists`);
    }

    // hash password
    const hashPassword = await hashPasswordHelpers(createUserDto.password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      avatar_url,
    });
    return {
      id: user.id,
    };
  }

  async findAllInMongo(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return {
      meta: {
        current: current, // trang hiện tại
        pageSize: pageSize, // số lượng bản ghi đã lấy
        pages: totalPages, // tổng số trang với điều kiện query
        total: totalItems, // tổng số bản ghi
      },
      results, // kết quả query
    };
  }

  findOneInMongo(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmailInMongo(email: string) {
    return await this.userModel.findOne({ email });
  }

  async updateInMongo(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { id: updateUserDto.id },
      { ...updateUserDto },
    );
  }

  async removeInMongo(id: string) {
    // check id
    if (mongoose.isValidObjectId(id)) {
      return this.userModel.deleteOne({ id });
    } else {
      throw new BadRequestException('Id khong dung dinh dang');
    }
    // return `This action removes a #${id} user`;
  }

  // Postgres
  isEmailExistInPostgres = async (email: string) => {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) return true;
    return false;
  };

  async find() {
    return this.userRepository.find({
      select: ['id', 'username'],
    });
  }

  async createInPostgres(createUserDto: CreateUserDto) {
    const { username, email, password, phone, address, avatar_url } =
      createUserDto;

    // check email
    const isEmailExist = await this.isEmailExistInPostgres(email);
    if (isEmailExist) {
      throw new BadRequestException(`Email ${email} exists`);
    }

    // check username
    const isUsernameExist = await this.userRepository.findOne({
      where: { username },
    });
    if (isUsernameExist) {
      throw new BadRequestException(`Username ${username} exists`);
    }

    // hash password
    const hashPassword = await hashPasswordHelpers(createUserDto.password);
    const user = await this.userRepository.create({
      username,
      email,
      password_hash: hashPassword,
      phone,
      address,
      avatar_url,
    });
    return await this.userRepository.save(user);
  }

  async findAllInPostgres(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.phone',
        'user.address',
        'user.role_id',
      ])
      .where(filter)
      .orderBy(sort as any)
      .skip((current - 1) * pageSize) // Offset
      .take(pageSize); // Limit

    console.log('>>>queryBuilder: ', queryBuilder.getSql());
    const [results, totalItems] = await queryBuilder.getManyAndCount();
    console.debug('>>>results: ', results);
    console.debug('>>>totalItems: ', totalItems);
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }

  async findOneInPostgres(id: string): Promise<UserDto> {
    // Tìm người dùng theo ID
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Tìm vai trò tương ứng với role_id
    const role = await this.roleRepository.findOne({
      where: { id: user.role_id },
    });

    // Tạo object kết hợp thông tin người dùng và vai trò
    const userWithRole = {
      ...user,
      role: role
        ? { id: role.id, name: role.name }
        : { id: user.role_id, name: 'Unknown' },
    };

    // Chuyển đổi sang UserDto để loại bỏ các trường nhạy cảm
    return plainToClass(UserDto, userWithRole);
  }

  async findByEmailInPostgres(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateInPostgres(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: updateUserDto.id },
    });
    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async removeInPostgres(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }
    return await this.userRepository.remove(user);
  }

  // auth
  async handleRegister(registerDto: CreateAuthDto) {
    const { username, email, password } = registerDto;

    // check email
    const isExist = await this.isEmailExistInPostgres(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} exists`);
    }

    // Mã hóa mật khẩu
    const hashPassword = await hashPasswordHelpers(registerDto.password);
    const code_id = uuidv4();

    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Thời gian hết hạn (lưu dưới dạng UTC)
    const code_expiredUTC = dayjs.utc().add(5, 'minutes').toDate();
    console.log(code_expiredUTC);

    // Tạo user (chưa lưu vào DB)
    const user = this.userRepository.create({
      username,
      email,
      password_hash: hashPassword,
      code_id: code_id,
      is_active: false,
      code_expired: code_expiredUTC,
    });

    // Lưu user vào PostgreSQL
    await this.userRepository.save(user);

    // send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register',
      context: {
        name: user?.username ?? user?.email,
        activationCode: code_id,
      },
    });

    // response
    return {
      id: user.id,
    };
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: data.id,
        code_id: data.code,
      },
    });
    console.log(user);
    if (!user) {
      throw new BadRequestException('mã code không hợp lệ');
    }

    // check expire
    const isBeforeCheck = dayjs().isBefore(user.code_expired);
    console.log(isBeforeCheck);
    if (isBeforeCheck) {
      // valid => update user
      await this.userRepository.update({ id: data.id }, { is_active: true });
    } else {
      throw new BadRequestException('mã code đã hết hạn');
    }

    return { isBeforeCheck };
  }

  async retryActive(email: string) {
    // check email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (user.is_active) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const code_expiredUTC = dayjs.utc().add(5, 'minutes').toDate();

    // update user
    const code_id = uuidv4();

    // await user.update({where: {
    //   code_id: code_id,
    //   code_expired: dayjs().add(5, 'minutes'),
    // }});

    await this.userRepository.update(
      { email: user.email },
      { code_id: code_id, code_expired: code_expiredUTC },
    );

    // send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register',
      context: {
        name: user?.username ?? user?.email,
        activationCode: code_id,
      },
    });

    return { id: user.id };
  }

  async retryPassword(email: string) {
    // check email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    // update user
    // await user.updateOne({
    //   code_id: code_id,
    //   code_expired: dayjs().add(5, 'minutes'),
    // });

    dayjs.extend(utc);
    dayjs.extend(timezone);

    const code_id = uuidv4();
    const code_expiredUTC = dayjs.utc().add(5, 'minutes').toDate();
    console.log(code_expiredUTC);
    console.log(code_id);

    await this.userRepository.update(
      { email: user.email },
      { code_id: code_id, code_expired: code_expiredUTC },
    );

    // send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change your password account', // Subject line
      template: 'register',
      context: {
        name: user?.username ?? user?.email,
        activationCode: code_id,
      },
    });

    return { id: user.id, email: user.email };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException(
        'Mật khẩu/xác nhận mật khẩu không chính xác.',
      );
    }
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    // check exact
    const isExactCode = user.code_id === data.code;

    // check expire
    const isBeforeCheck = dayjs().isBefore(user.code_expired);

    if (isBeforeCheck && isExactCode) {
      // valid
      const newPassword = await hashPasswordHelpers(data.password);
      await this.userRepository.update(
        { code_id: user.code_id },
        { password_hash: newPassword },
      );

      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc hết hạn');
    }
  }

  async changePasswordWithoutCode(
    id: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu/xác nhận mật khẩu không chính xác.',
      );
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    // hash new password
    const hashPassword = await hashPasswordHelpers(newPassword);
    await this.userRepository.update({ id }, { password_hash: hashPassword });

    return { message: 'Cập nhật mật khẩu thành công' };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedData = {
      ...user,
      ...updateUserDto,
      notification_preferences: updateUserDto.notification_preferences
        ? updateUserDto.notification_preferences // Đảm bảo đây là Notifications[]
        : user.notification_preferences,
      date_of_birth: updateUserDto.date_of_birth
        ? new Date(updateUserDto.date_of_birth)
        : user.date_of_birth,
      updated_at: new Date(),
    };

    await this.userRepository.save(updatedData as DeepPartial<UserEntity>);

    const role = await this.roleRepository.findOne({
      where: { id: user.role_id },
    });

    const userWithRole = {
      ...updatedData,
      role: role
        ? { id: role.id, name: role.name }
        : { id: user.role_id, name: 'Unknown' },
    };

    return plainToClass(UserDto, userWithRole);
  }

  async updateLastLogin(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.last_login_at = new Date();
    await this.userRepository.save(user);
  }
}
