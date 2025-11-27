import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchResult extends Document {
  userId: mongoose.Types.ObjectId;
  resumeFileName: string;
  jdFileName: string;
  matchPercentage: number;
  matchDetails: {
    resumeKeywords: string[];
    jdKeywords: string[];
    matchedKeywords: string[];
    missingSkills: string[];
  };
  suggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const matchResultSchema = new Schema<IMatchResult>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeFileName: {
      type: String,
      required: true,
    },
    jdFileName: {
      type: String,
      required: true,
    },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchDetails: {
      resumeKeywords: [String],
      jdKeywords: [String],
      matchedKeywords: [String],
      missingSkills: [String],
    },
    suggestions: [String],
  },
  {
    timestamps: true,
  }
);

/**
 * Index on userId for faster queries
 */
matchResultSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IMatchResult>('MatchResult', matchResultSchema);
