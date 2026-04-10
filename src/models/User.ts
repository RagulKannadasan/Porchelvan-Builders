import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'CUSTOMER';
  isVerified: boolean;
  verifyOtp?: string;
  verifyOtpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'CUSTOMER'], default: 'CUSTOMER' },
    isVerified: { type: Boolean, default: false },
    verifyOtp: { type: String },
    verifyOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
