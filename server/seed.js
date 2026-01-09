const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');
const Country = require('./models/Country');
const Order = require('./models/Order');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        await Product.deleteMany({});
        await User.deleteMany({});
        await Country.deleteMany({});
        await Order.deleteMany({});
        console.log('Cleared existing data');

        const products = [
            {
                name: 'Golden Crescent Moon Necklace',
                description: 'Elegant crescent moon pendant crafted in 18k gold with delicate chain.',
                price: 189.99,
                category: 'Necklaces',
                color: 'Gold',
                material: 'Gold',
                images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
                inStock: true,
                isFeatured: true
            },
            {
                name: 'Diamond Solitaire Pendant',
                description: 'Stunning solitaire diamond pendant set in 14k white gold.',
                price: 599.99,
                category: 'Necklaces',
                color: 'Silver',
                material: 'White Gold',
                images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
                inStock: true,
                isFeatured: true
            },
            {
                name: 'Pearl Strand Necklace',
                description: 'Classic freshwater pearl strand with sterling silver clasp.',
                price: 249.99,
                category: 'Necklaces',
                color: 'White',
                material: 'Pearl',
                images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Rose Gold Heart Locket',
                description: 'Romantic heart-shaped locket in rose gold.',
                price: 159.99,
                category: 'Necklaces',
                color: 'Rose Gold',
                material: 'Rose Gold',
                images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Crystal Drop Earrings',
                description: 'Sparkling crystal drops that catch the light beautifully.',
                price: 79.99,
                category: 'Earrings',
                color: 'Silver',
                material: 'Crystal',
                images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
                inStock: true,
                isFeatured: true
            },
            {
                name: 'Gold Hoop Earrings',
                description: 'Classic 14k gold hoops. Lightweight and comfortable.',
                price: 129.99,
                category: 'Earrings',
                color: 'Gold',
                material: 'Gold',
                images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Emerald Stud Earrings',
                description: 'Beautiful emerald studs set in 18k gold.',
                price: 349.99,
                category: 'Earrings',
                color: 'Green',
                material: 'Emerald',
                images: ['https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800'],
                inStock: true,
                isFeatured: true
            },
            {
                name: 'Pearl Drop Earrings',
                description: 'Elegant freshwater pearl drops with gold accents.',
                price: 119.99,
                category: 'Earrings',
                color: 'White',
                material: 'Pearl',
                images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Tennis Bracelet',
                description: 'Classic diamond tennis bracelet in 14k white gold.',
                price: 899.99,
                category: 'Bracelets',
                color: 'Silver',
                material: 'Diamond',
                images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
                inStock: true,
                isFeatured: true
            },
            {
                name: 'Gold Chain Bracelet',
                description: 'Delicate gold chain bracelet. Stackable and versatile.',
                price: 149.99,
                category: 'Bracelets',
                color: 'Gold',
                material: 'Gold',
                images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Charm Bracelet',
                description: 'Sterling silver charm bracelet with celestial themed charms.',
                price: 89.99,
                category: 'Bracelets',
                color: 'Silver',
                material: 'Sterling Silver',
                images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Rose Gold Bangle',
                description: 'Modern rose gold bangle with subtle texture.',
                price: 179.99,
                category: 'Bracelets',
                color: 'Rose Gold',
                material: 'Rose Gold',
                images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Diamond Engagement Ring',
                description: 'Stunning round brilliant diamond in a classic solitaire setting.',
                price: 2499.99,
                category: 'Rings',
                color: 'Silver',
                material: 'Diamond',
                images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
                inStock: true,
                isFeatured: true
            },
            {
                name: 'Sapphire Cocktail Ring',
                description: 'Bold blue sapphire surrounded by diamonds.',
                price: 699.99,
                category: 'Rings',
                color: 'Blue',
                material: 'Sapphire',
                images: ['https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800'],
                inStock: true,
                isFeatured: true
            },
            {
                name: 'Gold Signet Ring',
                description: 'Classic gold signet ring. Can be personalized with engraving.',
                price: 299.99,
                category: 'Rings',
                color: 'Gold',
                material: 'Gold',
                images: ['https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800'],
                inStock: true,
                isFeatured: false
            },
            {
                name: 'Eternity Band',
                description: 'Beautiful diamond eternity band in platinum.',
                price: 1299.99,
                category: 'Rings',
                color: 'Silver',
                material: 'Platinum',
                images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
                inStock: true,
                isFeatured: false
            }
        ];

        await Product.insertMany(products);
        console.log('Seeded ' + products.length + ' products');

        const hashedPassword = await bcrypt.hash('123456', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        const users = [
            {
                name: 'Cagatay',
                surname: 'Gurses',
                email: 'cagatay@example.com',
                password: hashedPassword,
                phone: '+90 555-123-4567',
                gender: 'male',
                birthDate: new Date('1995-03-15'),
                address: {
                    street: '123 Ataturk Caddesi',
                    city: 'Istanbul',
                    postalCode: '34000',
                    country: 'Turkey'
                },
                isAdmin: false
            },
            {
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                password: hashedPassword,
                phone: '+1 555-987-6543',
                gender: 'male',
                birthDate: new Date('1990-07-22'),
                address: {
                    street: '456 Oak Avenue',
                    city: 'New York',
                    postalCode: '10001',
                    country: 'United States'
                },
                isAdmin: false
            },
            {
                name: 'Jane',
                surname: 'Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                phone: '+44 20 7946 0958',
                gender: 'female',
                birthDate: new Date('1988-11-30'),
                address: {
                    street: '789 High Street',
                    city: 'London',
                    postalCode: 'SW1A 1AA',
                    country: 'United Kingdom'
                },
                isAdmin: false
            },
            {
                name: 'Admin',
                surname: 'User',
                email: 'admin@lal.com',
                password: adminPassword,
                phone: '+1 555-000-0000',
                address: {
                    street: '1 Admin Plaza',
                    city: 'San Francisco',
                    postalCode: '94102',
                    country: 'United States'
                },
                isAdmin: true
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log('Seeded ' + createdUsers.length + ' users');

        // Seed Countries
        const countries = [
            {
                name: 'Turkey',
                code: 'TR',
                phoneCode: '+90',
                phoneFormat: 'XXX XXX XX XX',
                phonePlaceholder: '555 123 45 67',
                flag: '🇹🇷',
                cities: [
                    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
                    'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
                    'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
                    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'Istanbul',
                    'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
                    'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
                    'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop',
                    'Şırnak', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
                ]
            },
            {
                name: 'United States',
                code: 'US',
                phoneCode: '+1',
                phoneFormat: 'XXX XXX XXXX',
                phonePlaceholder: '555 123 4567',
                flag: '🇺🇸',
                cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Francisco']
            },
            {
                name: 'United Kingdom',
                code: 'GB',
                phoneCode: '+44',
                phoneFormat: 'XXXX XXX XXXX',
                phonePlaceholder: '7911 123 456',
                flag: '🇬🇧',
                cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff']
            },
            {
                name: 'Germany',
                code: 'DE',
                phoneCode: '+49',
                phoneFormat: 'XXXX XXXXXXX',
                phonePlaceholder: '1512 3456789',
                flag: '🇩🇪',
                cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen']
            },
            {
                name: 'France',
                code: 'FR',
                phoneCode: '+33',
                phoneFormat: 'X XX XX XX XX',
                phonePlaceholder: '6 12 34 56 78',
                flag: '🇫🇷',
                cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille']
            },
            {
                name: 'Italy',
                code: 'IT',
                phoneCode: '+39',
                phoneFormat: 'XXX XXX XXXX',
                phonePlaceholder: '312 345 6789',
                flag: '🇮🇹',
                cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Venice', 'Verona']
            },
            {
                name: 'Spain',
                code: 'ES',
                phoneCode: '+34',
                phoneFormat: 'XXX XX XX XX',
                phonePlaceholder: '612 34 56 78',
                flag: '🇪🇸',
                cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Bilbao', 'Alicante']
            },
            {
                name: 'Netherlands',
                code: 'NL',
                phoneCode: '+31',
                phoneFormat: 'X XX XX XX XX',
                phonePlaceholder: '6 12 34 56 78',
                flag: '🇳🇱',
                cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen']
            },
            {
                name: 'Belgium',
                code: 'BE',
                phoneCode: '+32',
                phoneFormat: 'XXX XX XX XX',
                phonePlaceholder: '470 12 34 56',
                flag: '🇧🇪',
                cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Mechelen']
            },
            {
                name: 'Austria',
                code: 'AT',
                phoneCode: '+43',
                phoneFormat: 'XXX XXXXXXX',
                phonePlaceholder: '664 1234567',
                flag: '🇦🇹',
                cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn']
            },
            {
                name: 'Switzerland',
                code: 'CH',
                phoneCode: '+41',
                phoneFormat: 'XX XXX XX XX',
                phonePlaceholder: '78 123 45 67',
                flag: '🇨🇭',
                cities: ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel']
            },
            {
                name: 'Canada',
                code: 'CA',
                phoneCode: '+1',
                phoneFormat: 'XXX XXX XXXX',
                phonePlaceholder: '416 123 4567',
                flag: '🇨🇦',
                cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Victoria']
            },
            {
                name: 'Australia',
                code: 'AU',
                phoneCode: '+61',
                phoneFormat: 'XXXX XXX XXX',
                phonePlaceholder: '0412 345 678',
                flag: '🇦🇺',
                cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Hobart', 'Darwin']
            },
            {
                name: 'Japan',
                code: 'JP',
                phoneCode: '+81',
                phoneFormat: 'XX XXXX XXXX',
                phonePlaceholder: '90 1234 5678',
                flag: '🇯🇵',
                cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Kobe', 'Kyoto', 'Fukuoka', 'Kawasaki', 'Hiroshima']
            },
            {
                name: 'South Korea',
                code: 'KR',
                phoneCode: '+82',
                phoneFormat: 'XX XXXX XXXX',
                phonePlaceholder: '10 1234 5678',
                flag: '🇰🇷',
                cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Seongnam']
            }
        ];

        await Country.insertMany(countries);
        console.log('Seeded ' + countries.length + ' countries');

        // Seed Sample Orders (for testing)
        const cagatayUser = createdUsers.find(u => u.email === 'cagatay@example.com');
        const johnUser = createdUsers.find(u => u.email === 'john@example.com');
        const janeUser = createdUsers.find(u => u.email === 'jane@example.com');

        const seededProducts = await Product.find({});

        const orders = [
            {
                user: cagatayUser._id,
                orderItems: [
                    {
                        name: seededProducts[0].name,
                        qty: 1,
                        image: seededProducts[0].images[0],
                        price: seededProducts[0].price,
                        product: seededProducts[0]._id
                    },
                    {
                        name: seededProducts[4].name,
                        qty: 2,
                        image: seededProducts[4].images[0],
                        price: seededProducts[4].price,
                        product: seededProducts[4]._id
                    }
                ],
                shippingAddress: {
                    firstName: 'Cagatay',
                    lastName: 'Gurses',
                    address: '123 Ataturk Caddesi',
                    city: 'Istanbul',
                    postalCode: '34000',
                    country: 'Turkey',
                    phone: '+90 555-123-4567'
                },
                paymentMethod: 'Credit Card',
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: seededProducts[0].price + (seededProducts[4].price * 2),
                isPaid: true,
                paidAt: new Date('2025-12-15'),
                isDelivered: true,
                deliveredAt: new Date('2025-12-20')
            },
            {
                user: johnUser._id,
                orderItems: [
                    {
                        name: seededProducts[12].name,
                        qty: 1,
                        image: seededProducts[12].images[0],
                        price: seededProducts[12].price,
                        product: seededProducts[12]._id
                    }
                ],
                shippingAddress: {
                    firstName: 'John',
                    lastName: 'Doe',
                    address: '456 Oak Avenue',
                    city: 'New York',
                    postalCode: '10001',
                    country: 'United States',
                    phone: '+1 555-987-6543'
                },
                paymentMethod: 'Credit Card',
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: seededProducts[12].price,
                isPaid: true,
                paidAt: new Date('2026-01-02'),
                isDelivered: false
            },
            {
                user: janeUser._id,
                orderItems: [
                    {
                        name: seededProducts[8].name,
                        qty: 1,
                        image: seededProducts[8].images[0],
                        price: seededProducts[8].price,
                        product: seededProducts[8]._id
                    },
                    {
                        name: seededProducts[2].name,
                        qty: 1,
                        image: seededProducts[2].images[0],
                        price: seededProducts[2].price,
                        product: seededProducts[2]._id
                    }
                ],
                shippingAddress: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    address: '789 High Street',
                    city: 'London',
                    postalCode: 'SW1A 1AA',
                    country: 'United Kingdom',
                    phone: '+44 20 7946 0958'
                },
                paymentMethod: 'PayPal',
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: seededProducts[8].price + seededProducts[2].price,
                isPaid: false,
                isDelivered: false
            }
        ];

        await Order.insertMany(orders);
        console.log('Seeded ' + orders.length + ' orders');

        console.log('\nDatabase seeded successfully!');
        console.log('\nTest Credentials:');
        console.log('   User: cagatay@example.com / 123456');
        console.log('   User: john@example.com / 123456');
        console.log('   User: jane@example.com / 123456');
        console.log('   Admin: admin@lal.com / admin123');

        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
