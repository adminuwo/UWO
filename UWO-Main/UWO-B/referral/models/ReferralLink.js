const mongoose = require('mongoose');

const ReferralLinkSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RefUser',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RefProduct',
      required: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    uniqueClicks: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ReferralLinkSchema.index({ user: 1, product: 1 });

module.exports = mongoose.models.ReferralLink || mongoose.model('ReferralLink', ReferralLinkSchema, 'ref_links');
