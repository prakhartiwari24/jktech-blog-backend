import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from '../services/post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body('title') title: string,
    @Body('body') body: string,
  ) {
    this.logger.log(`POST /posts - Creating post for user: ${req.user.sub}`);
    if (!title || !body) {
      throw new UnauthorizedException('Title and body are required');
    }
    return this.postsService.create(req.user.sub, title, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    this.logger.log(`GET /posts - Fetching posts for user: ${req.user.sub}`);
    return this.postsService.findAll(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`GET /posts/${id} - Fetching post details`);
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new UnauthorizedException('Post not found');
    }
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('body') body: string,
  ) {
    this.logger.log(
      `PUT /posts/${id} - Updating post for user: ${req.user.sub}`,
    );
    if (!title || !body) {
      throw new UnauthorizedException('Title and body are required');
    }
    return this.postsService.update(id, req.user.sub, title, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    this.logger.log(
      `DELETE /posts/${id} - Deleting post for user: ${req.user.sub}`,
    );
    await this.postsService.delete(id, req.user.sub);
    return { message: 'Post deleted successfully' };
  }
}
