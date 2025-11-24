import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDifficultyDto } from './dto/create-difficulty.dto';
import { UpdateDifficultyDto } from './dto/update-difficulty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DifficultyEntity } from './entities/difficulty.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class DifficultiesService {
  constructor(
    @InjectRepository(DifficultyEntity)
    private readonly difficultyRepository: Repository<DifficultyEntity>,
  ) {}

  // create(createDifficultyDto: CreateDifficultyDto) {
  //   return 'This action adds a new difficulty';
  // }

  // findAll() {
  //   return this.difficultyRepository.find();
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} difficulty`;
  // }

  // update(id: number, updateDifficultyDto: UpdateDifficultyDto) {
  //   return `This action updates a #${id} difficulty`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} difficulty`;
  // }

  // Helper function to extract UUIDs from a string
  private extractUUIDs(input: string): string[] {
    return input
      .replace(/^\[|\]$/g, '') // Loại bỏ dấu [ và ]
      .split(',')
      .map((uuid) => uuid.trim().replace(/^'|'$/g, '')); // Loại bỏ dấu nháy đơn
  }

  async create(createDifficultyDto: CreateDifficultyDto) {
    const { name, description } = createDifficultyDto;
    const newDiff = this.difficultyRepository.create({
      name,
      description,
    });
    return await this.difficultyRepository.save(newDiff);
  }

  findAll() {
    return this.difficultyRepository.find();
  }

  findOne(id: string) {
    return this.difficultyRepository.findOne({ where: { id } });
  }

  async updateDifficulty(updateDifficultyDto: UpdateDifficultyDto) {
    const diff = await this.difficultyRepository.findOne({
      where: { id: updateDifficultyDto.id },
    });
    if (!diff) {
      throw new BadRequestException('Difficulty không tồn tại');
    }
    Object.assign(diff, updateDifficultyDto);
    return await this.difficultyRepository.save(diff);
  }

  async deleteById(id: string) {
    const diff = await this.difficultyRepository.findOne({ where: { id } });
    if (!diff) {
      throw new BadRequestException('Difficulty không tồn tại');
    }
    return await this.difficultyRepository.remove(diff);
  }

  async findAllWithPaginate(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const queryBuilder = this.difficultyRepository
      .createQueryBuilder('difficulties')
      .select([
        'difficulties.id',
        'difficulties.name',
        'difficulties.description',
      ])
      .where(filter)
      .orderBy(sort as any)
      .skip((current - 1) * pageSize) // Offset
      .take(pageSize); // Limit

    const [results, totalItems] = await queryBuilder.getManyAndCount();
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
}
