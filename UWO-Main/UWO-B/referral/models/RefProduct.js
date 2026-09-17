const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project/Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    webUrl: {
      type: String,
      default: '',
      trim: true,
    },
    androidUrl: {
      type: String,
      default: '',
      trim: true,
    },
    iosUrl: {
      type: String,
      default: '',
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Validate that at least one of the 3 URLs is provided
ProductSchema.pre('validate', function (next) {
  const hasWeb = this.webUrl && this.webUrl.trim().length > 0;
  const hasAndroid = this.androidUrl && this.androidUrl.trim().length > 0;
  const hasIos = this.iosUrl && this.iosUrl.trim().length > 0;

  if (!hasWeb && !hasAndroid && !hasIos) {
    this.invalidate('webUrl', 'At least one URL (Web, Android Play Store, or iOS App Store) is required.');
  }
  if (typeof next === 'function') next();
});

module.exports = mongoose.models.RefProduct || mongoose.model('RefProduct', ProductSchema, 'ref_products');
