import mongoose from 'mongoose';

const MultilingualStringSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  hu: { type: String, default: '' },
  ru: { type: String, default: '' },
  sk: { type: String, default: '' },
  cs: { type: String, default: '' },
  uk: { type: String, default: '' },
}, { _id: false });

const StyleSettingsSchema = new mongoose.Schema({
  themeName: { type: String, default: 'Default' }, // 'Default', 'Compact', 'Playful'
  primaryColor: { type: String, default: '#00FFFF' }, // Cyan
  backgroundColor: { type: String, default: '#FFFFFF' }, // White
  textColor: { type: String, default: '#000000' }, // Black
  headerFont: { type: String, default: 'Arial, sans-serif' },
  bodyFont: { type: String, default: 'Arial, sans-serif' },
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
  style: {
    type: StyleSettingsSchema,
    default: () => ({}) // Ensures a default object is created
  }
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
