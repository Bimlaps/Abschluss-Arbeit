import mongoose from 'mongoose';
import { Template } from '@247vitrine/types';

// Define the template schema
const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    htmlStructure: {
      type: String,
      required: true,
    },
    cssStructure: {
      type: String,
      required: true,
    },
    availableSections: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create and export the Template model
const TemplateModel = mongoose.model<Template & mongoose.Document>('Template', templateSchema);

export default TemplateModel;
