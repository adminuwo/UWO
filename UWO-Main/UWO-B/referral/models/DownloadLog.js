const mongoose = require('mongoose');

const DownloadLogSchema = new mongoose.Schema(
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
    platform: {
      type: String,
      enum: ['android', 'ios'],
      required: true,
    },
    ip: {
      type: String,
      default: '',
    },
    fingerprint: {
      type: String,
      default: '',
    },
    attributionMethod: {
      type: String,
      enum: ['google_play_referrer', 'ios_ip_fingerprint'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.RefDownloadLog || mongoose.model('RefDownloadLog', DownloadLogSchema, 'ref_download_logs');
