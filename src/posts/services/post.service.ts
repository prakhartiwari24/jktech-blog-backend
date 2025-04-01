import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/posts.schemas';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(userId: string, title: string, body: string): Promise<Post> {
    this.logger.log(
      `PostsService ~ create invoked with userId: ${userId}, title: ${title}, body: ${body}`,
    );
    const post = new this.postModel({ title, body, userId });
    return await post.save();
  }

  async findAll(userId: string): Promise<Post[]> {
    this.logger.log(`PostsService ~ findAll invoked with userId: ${userId}}`);
    return this.postModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Post | null> {
    this.logger.log(`PostsService ~ findOne invoked with id: ${id}}`);
    return this.postModel.findById(id).exec();
  }

  async update(
    id: string,
    userId: string,
    title: string,
    body: string,
  ): Promise<Post> {
    this.logger.log(
      `PostsService ~ update invoked with id: ${id}, userId: ${userId}, title: ${title}, body: ${body}`,
    );
    const post = await this.postModel.findById(id).exec();
    if (!post || post.userId.toString() !== userId) {
      throw new UnauthorizedException('Not authorized to update this post');
    }
    return this.postModel
      .findByIdAndUpdate(id, { title, body }, { new: true })
      .exec();
  }

  async delete(id: string, userId: string): Promise<void> {
    const post = await this.postModel.findById(id).exec();
    if (!post || post.userId.toString() !== userId) {
      throw new UnauthorizedException('Not authorized to delete this post');
    }
    await this.postModel.deleteOne({ _id: id }).exec();
  }
}
