import mongoose from 'mongoose';

const MultilingualStringSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  hu: { type: String, default: '' },
  ru: { type: String, default: '' },
  sk: { type: String, default: '' },
  cs: { type: String, default: '' }, // Added Czech
  uk: { type: String, default: '' }, // Added Ukrainian
}, { _id: false });

const SiteSettingsSchema = new mongoose.Schema({
  contactEmail: {
    type: String,
    default: '',
  },
  contactPhone: {
    type: String,
    default: '',
  },
  address: {
    type: MultilingualStringSchema,
  },
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
