import mongoose from "mongoose";

const findingSchema = new mongoose.Schema(
  {
    rule: String,               // STACK_EMPTY_ACCESS
    confidence: String,         // High / Medium / Low
    reason: String,
    fix: String,
    errorType: String,          // RE / TLE / WA
    suggestedTopics: [String],
    similarProblems: [String],
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    language: {
      type: String,
      enum: ["cpp", "java", "python", "js"],
    },

    topic: {
      type: String,
      enum: ["arrays", "strings", "stack", "queue", "trees", "graphs", "dp", "misc"],
    },

    summary: {
      hasErrors: Boolean,
      errorTypes: [String],
      score: Number,
    },

    findings: [findingSchema],
  },
  { timestamps: true }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Analysis", analysisSchema);