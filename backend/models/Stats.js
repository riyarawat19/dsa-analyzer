import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },

    totalAnalyses: { type: Number, default: 0 },

    errorTypes: {
      RE: { type: Number, default: 0 },
      TLE: { type: Number, default: 0 },
      WA: { type: Number, default: 0 },
    },

    topics: {
      arrays: { type: Number, default: 0 },
      strings: { type: Number, default: 0 },
      stack: { type: Number, default: 0 },
      queue: { type: Number, default: 0 },
      trees: { type: Number, default: 0 },
      graphs: { type: Number, default: 0 },
      dp: { type: Number, default: 0 },
      misc: { type: Number, default: 0 },
    },

    // Map: RULE_NAME -> count
    commonMistakes: {
      type: Map,
      of: Number,
      default: {},
    },

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Stats", statsSchema);
