import mongoose from 'mongoose';

const MultilingualStringSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  hu: { type: String, default: '' },
  ru: { type: String, default: '' },
  sk: { type: String, default: '' },
}, { _id: false });

const ArticleSchema = new mongoose.Schema({
  title: {
    type: MultilingualStringSchema,
    required: true,
  },
  content: {
    type: MultilingualStringSchema,
    required: true,
  },
  author: {
    type: String,
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
