import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Snippet, SnippetDocument } from './schemas/snippet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(@InjectModel(Snippet.name) private snippetModel: Model<SnippetDocument>) {}

  async create(createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    const createdSnippet = new this.snippetModel(createSnippetDto);
    return createdSnippet.save();
  }

  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id).exec();
    if (!snippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }
    return snippet;
  }

  async update(id: string, updateSnippetDto: UpdateSnippetDto): Promise<Snippet> {
    const updatedSnippet = await this.snippetModel
      .findByIdAndUpdate(id, updateSnippetDto, { new: true })
      .exec();

    if (!updatedSnippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }
    return updatedSnippet;
  }

  async remove(id: string): Promise<string> {
    const deletedSnippet = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!deletedSnippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return `Snippet with id ${id} deleted`;
  }

  async findAll(page: number = 1, limit: number = 10, q?: string, tag?: string) {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (q) {
      filter.$text = { $search: q };
    }

    if (tag) {
      filter.tags = tag;
    }

    const [items, total] = await Promise.all([
      this.snippetModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.snippetModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
