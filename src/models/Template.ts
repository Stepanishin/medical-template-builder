import mongoose from 'mongoose';

export interface ITemplate {
  _id?: string;
  name: string;
  content: string;
  variables?: Array<{
    name: string;
    type: 'text' | 'select';
    options?: string[];
    placeholder?: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const TemplateSchema = new mongoose.Schema<ITemplate>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  variables: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['text', 'select'], default: 'text' },
    options: [String],
    placeholder: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);