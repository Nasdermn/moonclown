import mongoose from 'mongoose';
import { ICodeDocument } from '../utils/interfaces/database.interface';

const codeSchema = new mongoose.Schema<ICodeDocument>({
  email: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
    select: false,
  },

  createdAt: {
    type: Date,
    expires: 300,
    default: Date.now,
  },
});

export default mongoose.model<ICodeDocument>('code', codeSchema);
