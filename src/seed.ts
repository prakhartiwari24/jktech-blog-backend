import { faker } from '@faker-js/faker';
import { User, UserSchema } from './users/schemas/user.schema';
import { Post, PostSchema } from './posts/schemas/posts.schemas';
import mongoose, { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

async function seed() {
  await mongoose.connect(
    'mongodb://localhost:27017/jktech-blog?retryWrites=true&w=majority&appName=Cluster0',
  );

  const userModel: Model<User> = mongoose.model('User', UserSchema);
  const postModel: Model<Post> = mongoose.model('Post', PostSchema);
  const logger = new Logger();

  logger.debug('Connected to DB');

  const users = Array.from({ length: 1000 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    googleId: faker.string.uuid(),
    facebookId: faker.string.uuid(),
  }));

  logger.log('Inserting users...');
  const createdUsers = await userModel.insertMany(users);
  logger.log(`Inserted ${createdUsers.length} users`);

  const posts = Array.from({ length: 5000 }).map(() => ({
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2),
    userId: faker.helpers.arrayElement(createdUsers)._id,
    createdAt: faker.date.recent(),
  }));

  logger.log('Inserting posts...');
  await postModel.insertMany(posts);
  logger.log('Inserted 5000 posts');

  await mongoose.disconnect();
  logger.log('🚀 Seed completed and disconnected from DB');
}

seed().catch((err) => {
  console.error(' Error during seed:', err);
  mongoose.disconnect();
});
