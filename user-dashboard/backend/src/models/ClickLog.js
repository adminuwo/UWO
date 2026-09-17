const mongoose = require('mongoose');

const ClickLogSchema = new mongoose.Schema(
  {
    referralLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReferralLink',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'android', 'ios', 'other'],
      default: 'desktop',
    },
    targetUrl: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: '',
    },
    ip: {
      type: String,
      default: '',
      index: true,
    },
    isUnique: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index to quickly verify if IP already clicked this referral link
ClickLogSchema.index({ referralLink: 1, ip: 1 });

module.exports = mongoose.models.ClickLog || mongoose.model('ClickLog', ClickLogSchema, 'ref_click_logs');
