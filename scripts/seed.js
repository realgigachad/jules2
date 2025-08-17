const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User.js').default;
const Article = require('../src/models/Article.js').default;

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database.');

    // --- Seed Admin User ---
    const existingUser = await User.findOne({ username: 'fonok' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('abc123', 10);
      const adminUser = new User({
        username: 'fonok',
        password: hashedPassword,
        forcePasswordChange: true,
      });
      await adminUser.save();
      console.log('Successfully created admin user "fonok".');
    } else {
      console.log('Admin user "fonok" already exists.');
    }

    // --- Seed Articles ---
    const articleCount = await Article.countDocuments();
    if (articleCount === 0) {
      console.log('No articles found, seeding test articles...');
      const articles = [
        {
          title: {
            en: 'The Majestic Alps by Rail',
            de: 'Die majestätischen Alpen mit der Bahn',
            hu: 'A fenséges Alpok vasúton',
            ru: 'Величественные Альпы по железной дороге',
            sk: 'Majestátne Alpy po železnici',
            cs: 'Majestátní Alpy po železnici',
            uk: 'Величні Альпи залізницею',
          },
          content: {
            en: 'Exploring the breathtaking scenery of the Swiss Alps from the comfort of a panoramic train is an unforgettable experience.',
            de: 'Die atemberaubende Landschaft der Schweizer Alpen bequem vom Panoramazug aus zu erkunden, ist ein unvergessliches Erlebnis.',
            hu: 'A svájci Alpok lélegzetelállító tájainak felfedezése egy panorámavonat kényelméből felejthetetlen élmény.',
            ru: 'Исследование захватывающих дух пейзажей Швейцарских Альп из комфорта панорамного поезда - это незабываемый опыт.',
            sk: 'Preskúmanie dychberúcej scenérie švajčiarskych Álp z pohodlia panoramatického vlaku je nezabudnuteľným zážitkom.',
            cs: 'Prozkoumávání dechberoucí scenérie švýcarských Alp z pohodlí panoramatického vlaku je nezapomenutelným zážitkem.',
            uk: 'Дослідження захоплюючих пейзажів Швейцарських Альп з комфорту панорамного поїзда - це незабутній досвід.',
          }
        },
        {
          title: {
            en: 'A Culinary Journey Through Italy',
            de: 'Eine kulinarische Reise durch Italien',
            hu: 'Kulináris utazás Olaszországon keresztül',
            ru: 'Кулинарное путешествие по Италии',
            sk: 'Kulinárska cesta Talianskom',
            cs: 'Kulinářská cesta Itálií',
            uk: 'Кулінарна подорож Італією',
          },
          content: {
            en: 'From pasta in Rome to pizza in Naples, discover the rich flavors of Italy by train, stopping at iconic cities and hidden gems.',
            de: 'Von Pasta in Rom bis Pizza in Neapel – entdecken Sie die reichen Aromen Italiens mit dem Zug und halten Sie in ikonischen Städten und versteckten Juwelen.',
            hu: 'A római tésztától a nápolyi pizzáig fedezze fel Olaszország gazdag ízeit vonattal, megállva ikonikus városokban és rejtett gyöngyszemeknél.',
            ru: 'От пасты в Риме до пиццы в Неаполе, откройте для себя богатые вкусы Италии на поезде, останавливаясь в знаковых городах и скрытых жемчужинах.',
            sk: 'Od cestovín v Ríme po pizzu v Neapole, objavte bohaté chute Talianska vlakom, so zastávkami v ikonických mestách a skrytých klenotoch.',
            cs: 'Od těstovin v Římě po pizzu v Neapoli, objevte bohaté chutě Itálie vlakem, se zastávkami v ikonických městech a skrytých klenotech.',
            uk: 'Від пасти в Римі до піци в Неаполі, відкрийте для себе багаті смаки Італії поїздом, зупиняючись у знакових містах та прихованих перлинах.',
          }
        }
      ];
      await Article.insertMany(articles);
      console.log('Successfully seeded 2 test articles.');
    } else {
      console.log('Articles collection is not empty, skipping seed.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

seedDatabase();
