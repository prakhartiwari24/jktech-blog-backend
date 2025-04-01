import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let mockPostModel: any;

  beforeEach(async () => {
    mockPostModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
      exec: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken('Post'),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
            prototype: {
              save: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new post', async () => {
      const save = jest.fn().mockResolvedValue({
        _id: 'post123',
        title: 'Test Title',
        body: 'Test Body',
        userId: 'user123',
      });

      const mockPostConstructor = jest.fn(() => ({ save }));

      (service as any).postModel = mockPostConstructor;

      const result = await service.create('user123', 'Test Title', 'Test Body');

      expect(mockPostConstructor).toHaveBeenCalledWith({
        title: 'Test Title',
        body: 'Test Body',
        userId: 'user123',
      });
      expect(save).toHaveBeenCalled();
      expect(result).toEqual({
        _id: 'post123',
        title: 'Test Title',
        body: 'Test Body',
        userId: 'user123',
      });
    });
  });

  describe('findAll', () => {
    it('should return user posts', async () => {
      const mockPosts = [{ title: 'Post 1' }];
      jest.spyOn(service['postModel'], 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPosts),
      } as any);

      const result = await service.findAll('user123');
      expect(result).toEqual(mockPosts);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const post = { _id: '1', title: 'Test' };
      jest.spyOn(service['postModel'], 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(post),
      } as any);

      const result = await service.findOne('1');
      expect(result).toEqual(post);
    });
  });

  describe('update', () => {
    it('should update post if user is authorized', async () => {
      const post = { _id: '1', userId: 'user123' };
      jest.spyOn(service['postModel'], 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(post),
      } as any);

      const updatedPost = { title: 'New Title' };
      jest.spyOn(service['postModel'], 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedPost),
      } as any);

      const result = await service.update('1', 'user123', 'New Title', 'Body');
      expect(result).toEqual(updatedPost);
    });

    it('should throw if user is not authorized to update', async () => {
      const post = { _id: '1', userId: 'otherUser' };
      jest.spyOn(service['postModel'], 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(post),
      } as any);

      await expect(
        service.update('1', 'user123', 'Title', 'Body'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('delete', () => {
    it('should delete post if user is authorized', async () => {
      const post = { _id: '1', userId: 'user123' };
      const mockDelete = jest.fn().mockResolvedValue(null);
      jest.spyOn(service['postModel'], 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(post),
      } as any);
      jest.spyOn(service['postModel'], 'deleteOne').mockReturnValue({
        exec: mockDelete,
      } as any);

      await expect(service.delete('1', 'user123')).resolves.toBeUndefined();
    });

    it('should throw if user is not authorized to delete', async () => {
      const post = { _id: '1', userId: 'otherUser' };
      jest.spyOn(service['postModel'], 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(post),
      } as any);

      await expect(service.delete('1', 'user123')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
