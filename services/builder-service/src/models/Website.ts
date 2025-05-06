import mongoose from 'mongoose';
import { Website, WebsiteStatus } from '@247vitrine/types';

// Define the website schema
const websiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    subdomain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    customDomain: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Template',
    },
    colorSchemeId: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    status: {
      type: String,
      enum: Object.values(WebsiteStatus),
      default: WebsiteStatus.DRAFT,
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

// Create and export the Website model
const WebsiteModel = mongoose.model<Website & mongoose.Document>('Website', websiteSchema);

export default WebsiteModel;
