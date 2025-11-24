import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    // mongo
    @InjectModel(Category.name) private categoryModel: Model<Category>,

    // postgres
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug, description, parent_id } = createCategoryDto;
    const newCategory = this.categoryRepository.create({
      name,
      slug,
      description,
      parent_id: parent_id || null, // Ensure parent_id is null if not provided
    });
    return await this.categoryRepository.save(newCategory);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns findOne a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      return null;
    }
    const updatedCategory = {
      ...category,
      ...updateCategoryDto,
    };
    return await this.categoryRepository.save(updatedCategory);
  }

  remove(id: string) {
    return this.categoryRepository.delete(id);
  }

  
  // New method to get all categories with complete information
  async findAllWithRelationships() {
    return this.categoryRepository.find({
      select: ["id", "name", "slug", "description", "parent_id"],
    })
  }

  // New method to get category relationships
  async getCategoryRelationships() {
    const categories = await this.categoryRepository.find({
      select: ["id", "parent_id"],
    })

    return categories.map((category) => ({
      category_id: category.id,
      parent_id: category.parent_id,
    }))
  }

  // New method to get children of a category
  async getChildrenOfCategory(categoryId: string) {
    return this.categoryRepository.find({
      where: { parent_id: categoryId },
    })
  }
}
