import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  googleId: string;

  @Prop({ unique: true })
  facebookId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 'User' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
