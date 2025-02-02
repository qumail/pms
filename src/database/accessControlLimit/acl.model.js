import mongoose from "mongoose";

const { Schema } = mongoose;

const aclSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["admin", "doctor", "patient"], // Restrict roles
      index: true,
    },
    resources: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        permission: {
          type: String,
          required: true,
          enum: ["read", "write", "delete"],
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure unique role-resource combinations to prevent duplication
aclSchema.index({ role: 1, "resources.name": 1 }, { unique: true });

export const ACL = mongoose.model("Acl", aclSchema);
