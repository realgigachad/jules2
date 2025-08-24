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
  themeName: { type: String, default: 'Default' },
  primaryColor: { type: String, default: '#0891b2' }, // Changed to a calmer cyan
  backgroundColor: { type: String, default: '#FFFFFF' },
  textColor: { type: String, default: '#1f2937' }, // Changed to a softer dark gray
  headerFont: { type: String, default: 'Georgia, serif' },
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
    default: () => ({
      primaryColor: '#0891b2',
      backgroundColor: '#FFFFFF',
      textColor: '#1f2937',
      headerFont: 'Georgia, serif',
      bodyFont: 'Arial, sans-serif',
    })
  },
  adminAppearance: {
    type: String,
    default: 'default',
  },
  publicAppearance: {
    type: String,
    default: 'default',
  }
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
