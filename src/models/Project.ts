import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  customerId: mongoose.Types.ObjectId;
  status: 'Concept' | 'Design' | 'Construction' | 'Completion';
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Concept', 'Design', 'Construction', 'Completion'],
      default: 'Concept',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
