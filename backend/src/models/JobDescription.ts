import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDescription extends Document {
  position: string;
  company: string;
  location: string;
  salary?: string;
  experience?: string;
  jobType: string;
  summary?: string;
  description: string;
  postedDate: Date;
  createdAt: Date;
}

const JobDescriptionSchema: Schema = new Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  experience: { type: String },
  jobType: { type: String, default: 'Full-time' },
  summary: { type: String },
  description: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IJobDescription>('JobDescription', JobDescriptionSchema);
