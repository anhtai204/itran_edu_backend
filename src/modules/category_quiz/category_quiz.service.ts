import { Injectable } from '@nestjs/common';
import { CreateCategoryQuizDto } from './dto/create-category_quiz.dto';
import { UpdateCategoryQuizDto } from './dto/update-category_quiz.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryQuiz } from './schema/category_quiz.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryQuizEntity } from './entities/category_quiz.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryQuizService {
  constructor(
    // mongo
    @InjectModel(CategoryQuiz.name) private categoryQuizModel: Model<CategoryQuiz>,

    // postgres
    @InjectRepository(CategoryQuizEntity)
    private readonly categoryQuizRepository: Repository<CategoryQuizEntity>,
  ) {}

  async create(createCategoryQuizDto: CreateCategoryQuizDto) {
    const { name, slug, description, parent_id } = createCategoryQuizDto;
    const newCategory = this.categoryQuizRepository.create({
      name,
      slug,
      description,
      parent_id: parent_id || null, // Ensure parent_id is null if not provided
    });
    return await this.categoryQuizRepository.save(newCategory);
  }

  findAll() {
    return this.categoryQuizRepository.find();
  }

  findOne(id: number) {
    return `This action returns findOne a #${id} category`;
  }

  async update(id: string, updateCategoryQuizDto: UpdateCategoryQuizDto) {
    const category = await this.categoryQuizRepository.findOne({ where: { id } });
    if (!category) {
      return null;
    }
    const updatedCategory = {
      ...category,
      ...updateCategoryQuizDto,
    };
    return await this.categoryQuizRepository.save(updatedCategory);
  }

  remove(id: string) {
    return this.categoryQuizRepository.delete(id);
  }

  
  // New method to get all categories with complete information
  async findAllWithRelationships() {
    return this.categoryQuizRepository.find({
      select: ["id", "name", "slug", "description", "parent_id"],
    })
  }

  // New method to get category relationships
  async getCategoryRelationships() {
    const categories = await this.categoryQuizRepository.find({
      select: ["id", "parent_id"],
    })

    return categories.map((category) => ({
      category_id: category.id,
      parent_id: category.parent_id,
    }))
  }

  // New method to get children of a category
  async getChildrenOfCategory(categoryId: string) {
    return this.categoryQuizRepository.find({
      where: { parent_id: categoryId },
    })
  }
}
