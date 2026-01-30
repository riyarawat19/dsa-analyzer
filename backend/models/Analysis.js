import mongoose from "mongoose";

const findingSchema = new mongoose.Schema(
  {
    rule: String,
    confidence: String,
    reason: String,
    fix: String,
    errorType: String,
    severity: String,
    suggestedTopics: [String],
    similarProblems: [String],
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  language: String,
  errorType: String,

  summary: {
    hasErrors: Boolean,
    errorTypes: [String],
    score: Number,
  },

  findings: [findingSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Analysis", analysisSchema);
