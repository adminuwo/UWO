const mongoose = require('mongoose');

const PendingAttributionSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    fingerprint: {
      type: String,
      required: true,
      index: true,
    },
    referralLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReferralLink',
      required: true,
    },
    code: {
      type: String,
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
    },
    platform: {
      type: String,
      enum: ['ios', 'android'],
      default: 'ios',
    },
    userAgent: {
      type: String,
      default: '',
    },
    converted: {
      type: Boolean,
      default: false,
    },
    // TTL index: automatically deleted by MongoDB after expiry (default 3 hours)
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.RefPendingAttribution || mongoose.model('RefPendingAttribution', PendingAttributionSchema, 'ref_pending_attributions');
