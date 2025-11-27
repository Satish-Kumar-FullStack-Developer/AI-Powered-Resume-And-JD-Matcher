import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IMatchResult, {}, {}, {}, mongoose.Document<unknown, {}, IMatchResult> & IMatchResult & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MatchResult.d.ts.map