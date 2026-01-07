const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Country = require('./models/Country');

dotenv.config();

const countries = [
    {
        name: 'Turkey',
        code: 'TR',
        phoneCode: '+90',
        phoneFormat: 'XXX XXX XX XX',
        phonePlaceholder: '532 123 45 67',
        flag: '🇹🇷',
        cities: [
            'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara',
            'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman',
            'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
            'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne',
            'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
            'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'Istanbul', 'Izmir',
            'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri',
            'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
            'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
            'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun',
            'Şanlıurfa', 'Siirt', 'Sinop', 'Şırnak', 'Sivas', 'Tekirdağ', 'Tokat',
            'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
        ]
    },
    {
        name: 'United States',
        code: 'US',
        phoneCode: '+1',
        phoneFormat: 'XXX XXX XXXX',
        phonePlaceholder: '555 123 4567',
        flag: '🇺🇸',
        cities: [
            'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
            'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
            'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
            'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville',
            'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville',
            'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
            'Miami', 'Atlanta', 'New Orleans', 'Cleveland', 'Minneapolis'
        ]
    },
    {
        name: 'United Kingdom',
        code: 'GB',
        phoneCode: '+44',
        phoneFormat: 'XXXX XXXXXX',
        phonePlaceholder: '7911 123456',
        flag: '🇬🇧',
        cities: [
            'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Bristol',
            'Sheffield', 'Leeds', 'Edinburgh', 'Leicester', 'Coventry', 'Bradford',
            'Cardiff', 'Belfast', 'Nottingham', 'Kingston upon Hull', 'Newcastle upon Tyne',
            'Stoke-on-Trent', 'Southampton', 'Derby', 'Portsmouth', 'Brighton',
            'Plymouth', 'Northampton', 'Reading', 'Luton', 'Wolverhampton', 'Bolton',
            'Aberdeen', 'Bournemouth', 'Norwich', 'Swindon', 'Oxford', 'Cambridge'
        ]
    },
    {
        name: 'Germany',
        code: 'DE',
        phoneCode: '+49',
        phoneFormat: 'XXX XXXXXXXX',
        phonePlaceholder: '151 12345678',
        flag: '🇩🇪',
        cities: [
            'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart',
            'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden',
            'Hanover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld',
            'Bonn', 'Münster', 'Karlsruhe', 'Mannheim', 'Augsburg', 'Wiesbaden',
            'Mönchengladbach', 'Gelsenkirchen', 'Braunschweig', 'Aachen', 'Kiel',
            'Chemnitz', 'Halle', 'Magdeburg', 'Freiburg', 'Krefeld', 'Mainz'
        ]
    },
    {
        name: 'France',
        code: 'FR',
        phoneCode: '+33',
        phoneFormat: 'X XX XX XX XX',
        phonePlaceholder: '6 12 34 56 78',
        flag: '🇫🇷',
        cities: [
            'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg',
            'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre',
            'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes',
            'Villeurbanne', 'Le Mans', 'Aix-en-Provence', 'Clermont-Ferrand',
            'Brest', 'Tours', 'Limoges', 'Amiens', 'Perpignan', 'Metz', 'Besançon',
            'Orléans', 'Rouen', 'Mulhouse', 'Caen', 'Nancy', 'Avignon'
        ]
    },
    {
        name: 'Italy',
        code: 'IT',
        phoneCode: '+39',
        phoneFormat: 'XXX XXX XXXX',
        phonePlaceholder: '312 345 6789',
        flag: '🇮🇹',
        cities: [
            'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna',
            'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua',
            'Trieste', 'Brescia', 'Parma', 'Taranto', 'Prato', 'Modena', 'Reggio Calabria',
            'Reggio Emilia', 'Perugia', 'Livorno', 'Ravenna', 'Cagliari', 'Foggia',
            'Rimini', 'Salerno', 'Ferrara', 'Sassari', 'Latina', 'Giugliano in Campania'
        ]
    },
    {
        name: 'Spain',
        code: 'ES',
        phoneCode: '+34',
        phoneFormat: 'XXX XXX XXX',
        phonePlaceholder: '612 345 678',
        flag: '🇪🇸',
        cities: [
            'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga',
            'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba',
            'Valladolid', 'Vigo', 'Gijón', 'Hospitalet de Llobregat', 'A Coruña',
            'Vitoria-Gasteiz', 'Granada', 'Elche', 'Oviedo', 'Santa Cruz de Tenerife',
            'Badalona', 'Cartagena', 'Terrassa', 'Jerez de la Frontera', 'Sabadell',
            'Móstoles', 'Alcalá de Henares', 'Pamplona', 'Fuenlabrada', 'Almería'
        ]
    },
    {
        name: 'Netherlands',
        code: 'NL',
        phoneCode: '+31',
        phoneFormat: 'X XXXXXXXX',
        phonePlaceholder: '6 12345678',
        flag: '🇳🇱',
        cities: [
            'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg',
            'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Haarlem',
            'Arnhem', 'Zaanstad', 'Amersfoort', 'Apeldoorn', 'Hertogenbosch',
            'Hoofddorp', 'Maastricht', 'Leiden', 'Dordrecht', 'Zoetermeer',
            'Zwolle', 'Deventer', 'Delft', 'Alkmaar', 'Heerlen', 'Venlo'
        ]
    },
    {
        name: 'Belgium',
        code: 'BE',
        phoneCode: '+32',
        phoneFormat: 'XXX XX XX XX',
        phonePlaceholder: '470 12 34 56',
        flag: '🇧🇪',
        cities: [
            'Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges',
            'Namur', 'Leuven', 'Mons', 'Mechelen', 'Aalst', 'La Louvière',
            'Kortrijk', 'Hasselt', 'Ostend', 'Sint-Niklaas', 'Tournai', 'Genk',
            'Seraing', 'Roeselare', 'Verviers', 'Mouscron', 'Beveren', 'Dendermonde'
        ]
    },
    {
        name: 'Switzerland',
        code: 'CH',
        phoneCode: '+41',
        phoneFormat: 'XX XXX XX XX',
        phonePlaceholder: '79 123 45 67',
        flag: '🇨🇭',
        cities: [
            'Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur',
            'Lucerne', 'St. Gallen', 'Lugano', 'Biel', 'Thun', 'Köniz',
            'La Chaux-de-Fonds', 'Fribourg', 'Schaffhausen', 'Chur', 'Vernier',
            'Neuchâtel', 'Uster', 'Sion', 'Lancy', 'Emmen', 'Yverdon-les-Bains'
        ]
    },
    {
        name: 'Austria',
        code: 'AT',
        phoneCode: '+43',
        phoneFormat: 'XXX XXXXXXX',
        phonePlaceholder: '664 1234567',
        flag: '🇦🇹',
        cities: [
            'Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt',
            'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn', 'Wiener Neustadt',
            'Steyr', 'Feldkirch', 'Bregenz', 'Leonding', 'Klosterneuburg',
            'Baden bei Wien', 'Wolfsberg', 'Leoben', 'Krems', 'Traun', 'Amstetten'
        ]
    },
    {
        name: 'Poland',
        code: 'PL',
        phoneCode: '+48',
        phoneFormat: 'XXX XXX XXX',
        phonePlaceholder: '512 345 678',
        flag: '🇵🇱',
        cities: [
            'Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin',
            'Bydgoszcz', 'Lublin', 'Białystok', 'Katowice', 'Gdynia', 'Częstochowa',
            'Radom', 'Toruń', 'Sosnowiec', 'Rzeszów', 'Kielce', 'Gliwice', 'Olsztyn',
            'Zabrze', 'Bielsko-Biała', 'Bytom', 'Zielona Góra', 'Rybnik', 'Ruda Śląska'
        ]
    },
    {
        name: 'Portugal',
        code: 'PT',
        phoneCode: '+351',
        phoneFormat: 'XXX XXX XXX',
        phonePlaceholder: '912 345 678',
        flag: '🇵🇹',
        cities: [
            'Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Setúbal',
            'Coimbra', 'Funchal', 'Almada', 'Agualva-Cacém', 'Queluz', 'Leiria',
            'Viseu', 'Guimarães', 'Évora', 'Odivelas', 'Póvoa de Varzim', 'Rio Tinto',
            'Aveiro', 'Santarém', 'Faro', 'Portimão', 'Viana do Castelo', 'Matosinhos'
        ]
    },
    {
        name: 'Greece',
        code: 'GR',
        phoneCode: '+30',
        phoneFormat: 'XXX XXX XXXX',
        phonePlaceholder: '694 123 4567',
        flag: '🇬🇷',
        cities: [
            'Athens', 'Thessaloniki', 'Patras', 'Piraeus', 'Larissa', 'Heraklion',
            'Peristeri', 'Kallithea', 'Acharnes', 'Kalamaria', 'Nikaia', 'Glyfada',
            'Volos', 'Ilio', 'Ilioupoli', 'Keratsini', 'Evosmos', 'Chalandri',
            'Nea Smyrni', 'Marousi', 'Agios Dimitrios', 'Zografou', 'Egaleo', 'Rhodes'
        ]
    },
    {
        name: 'Russia',
        code: 'RU',
        phoneCode: '+7',
        phoneFormat: 'XXX XXX XX XX',
        phonePlaceholder: '912 345 67 89',
        flag: '🇷🇺',
        cities: [
            'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan',
            'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don',
            'Ufa', 'Krasnoyarsk', 'Voronezh', 'Perm', 'Volgograd', 'Krasnodar',
            'Saratov', 'Tyumen', 'Tolyatti', 'Izhevsk', 'Barnaul', 'Ulyanovsk',
            'Irkutsk', 'Khabarovsk', 'Yaroslavl', 'Vladivostok', 'Makhachkala', 'Tomsk'
        ]
    },
    {
        name: 'Canada',
        code: 'CA',
        phoneCode: '+1',
        phoneFormat: 'XXX XXX XXXX',
        phonePlaceholder: '416 123 4567',
        flag: '🇨🇦',
        cities: [
            'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa',
            'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria',
            'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'Regina', 'St. Catharines',
            'Kelowna', 'Barrie', 'Sherbrooke', 'Guelph', 'Kanata', 'Abbotsford',
            'Trois-Rivières', 'Kingston', 'Milton', 'Thunder Bay', 'St. John\'s'
        ]
    },
    {
        name: 'Australia',
        code: 'AU',
        phoneCode: '+61',
        phoneFormat: 'XXX XXX XXX',
        phonePlaceholder: '412 345 678',
        flag: '🇦🇺',
        cities: [
            'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast',
            'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong', 'Hobart',
            'Geelong', 'Townsville', 'Cairns', 'Darwin', 'Toowoomba', 'Ballarat',
            'Bendigo', 'Albury', 'Launceston', 'Mackay', 'Rockhampton', 'Bunbury'
        ]
    },
    {
        name: 'Japan',
        code: 'JP',
        phoneCode: '+81',
        phoneFormat: 'XX XXXX XXXX',
        phonePlaceholder: '90 1234 5678',
        flag: '🇯🇵',
        cities: [
            'Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe',
            'Kyoto', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Kitakyushu',
            'Chiba', 'Sakai', 'Niigata', 'Hamamatsu', 'Shizuoka', 'Sagamihara',
            'Okayama', 'Kumamoto', 'Kagoshima', 'Funabashi', 'Hachioji', 'Kawaguchi'
        ]
    },
    {
        name: 'South Korea',
        code: 'KR',
        phoneCode: '+82',
        phoneFormat: 'XX XXXX XXXX',
        phonePlaceholder: '10 1234 5678',
        flag: '🇰🇷',
        cities: [
            'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon',
            'Ulsan', 'Changwon', 'Seongnam', 'Goyang', 'Yongin', 'Bucheon',
            'Cheongju', 'Ansan', 'Jeonju', 'Cheonan', 'Anyang', 'Namyangju',
            'Hwaseong', 'Uijeongbu', 'Gimhae', 'Pohang', 'Jeju City', 'Siheung'
        ]
    },
    {
        name: 'China',
        code: 'CN',
        phoneCode: '+86',
        phoneFormat: 'XXX XXXX XXXX',
        phonePlaceholder: '131 2345 6789',
        flag: '🇨🇳',
        cities: [
            'Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou',
            'Wuhan', 'Xi\'an', 'Suzhou', 'Nanjing', 'Chongqing', 'Tianjin',
            'Dongguan', 'Shenyang', 'Qingdao', 'Zhengzhou', 'Dalian', 'Jinan',
            'Changsha', 'Harbin', 'Kunming', 'Fuzhou', 'Xiamen', 'Ningbo', 'Hefei'
        ]
    },
    {
        name: 'India',
        code: 'IN',
        phoneCode: '+91',
        phoneFormat: 'XXXXX XXXXX',
        phonePlaceholder: '98765 43210',
        flag: '🇮🇳',
        cities: [
            'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
            'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
            'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
            'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
            'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad'
        ]
    },
    {
        name: 'Brazil',
        code: 'BR',
        phoneCode: '+55',
        phoneFormat: 'XX XXXXX XXXX',
        phonePlaceholder: '11 98765 4321',
        flag: '🇧🇷',
        cities: [
            'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
            'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia', 'Belém',
            'Porto Alegre', 'Guarulhos', 'Campinas', 'São Luís', 'São Gonçalo',
            'Maceió', 'Duque de Caxias', 'Natal', 'Teresina', 'São Bernardo do Campo',
            'Campo Grande', 'Osasco', 'João Pessoa', 'Jaboatão dos Guararapes'
        ]
    },
    {
        name: 'Mexico',
        code: 'MX',
        phoneCode: '+52',
        phoneFormat: 'XX XXXX XXXX',
        phonePlaceholder: '55 1234 5678',
        flag: '🇲🇽',
        cities: [
            'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León',
            'Juárez', 'Zapopan', 'Mérida', 'San Luis Potosí', 'Aguascalientes',
            'Hermosillo', 'Saltillo', 'Mexicali', 'Culiacán', 'Querétaro', 'Morelia',
            'Chihuahua', 'Cancún', 'Acapulco', 'Toluca', 'Veracruz', 'Villahermosa'
        ]
    },
    {
        name: 'Argentina',
        code: 'AR',
        phoneCode: '+54',
        phoneFormat: 'XX XXXX XXXX',
        phonePlaceholder: '11 2345 6789',
        flag: '🇦🇷',
        cities: [
            'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'San Miguel de Tucumán',
            'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia',
            'Santiago del Estero', 'Corrientes', 'Neuquén', 'Posadas', 'San Salvador de Jujuy',
            'Bahía Blanca', 'Paraná', 'Formosa', 'San Fernando del Valle de Catamarca'
        ]
    },
    {
        name: 'United Arab Emirates',
        code: 'AE',
        phoneCode: '+971',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '50 123 4567',
        flag: '🇦🇪',
        cities: [
            'Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah',
            'Fujairah', 'Umm Al Quwain', 'Khor Fakkan', 'Dibba Al-Fujairah',
            'Ruwais', 'Madinat Zayed', 'Liwa Oasis', 'Jebel Ali', 'Hatta'
        ]
    },
    {
        name: 'Saudi Arabia',
        code: 'SA',
        phoneCode: '+966',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '50 123 4567',
        flag: '🇸🇦',
        cities: [
            'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran',
            'Taif', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Abha', 'Najran',
            'Jubail', 'Yanbu', 'Al-Ahsa', 'Hail', 'Jizan', 'Al Qatif', 'Hofuf'
        ]
    },
    {
        name: 'South Africa',
        code: 'ZA',
        phoneCode: '+27',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '82 123 4567',
        flag: '🇿🇦',
        cities: [
            'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth',
            'Bloemfontein', 'East London', 'Nelspruit', 'Kimberley', 'Polokwane',
            'Pietermaritzburg', 'Rustenburg', 'George', 'Stellenbosch', 'Welkom',
            'Richards Bay', 'Middelburg', 'Vanderbijlpark', 'Potchefstroom', 'Klerksdorp'
        ]
    },
    {
        name: 'Egypt',
        code: 'EG',
        phoneCode: '+20',
        phoneFormat: 'XXX XXX XXXX',
        phonePlaceholder: '100 123 4567',
        flag: '🇪🇬',
        cities: [
            'Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez',
            'Luxor', 'Mansoura', 'El-Mahalla El-Kubra', 'Tanta', 'Asyut', 'Ismailia',
            'Faiyum', 'Zagazig', 'Aswan', 'Damietta', 'Damanhur', 'Minya', 'Beni Suef'
        ]
    },
    {
        name: 'Israel',
        code: 'IL',
        phoneCode: '+972',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '50 123 4567',
        flag: '🇮🇱',
        cities: [
            'Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZion', 'Petah Tikva',
            'Ashdod', 'Netanya', 'Beer Sheva', 'Bnei Brak', 'Holon', 'Ramat Gan',
            'Rehovot', 'Ashkelon', 'Bat Yam', 'Beit Shemesh', 'Kfar Saba', 'Herzliya',
            'Hadera', 'Modiin', 'Nazareth', 'Lod', 'Ramla', 'Ra\'anana', 'Eilat'
        ]
    },
    {
        name: 'Singapore',
        code: 'SG',
        phoneCode: '+65',
        phoneFormat: 'XXXX XXXX',
        phonePlaceholder: '9123 4567',
        flag: '🇸🇬',
        cities: [
            'Singapore', 'Woodlands', 'Tampines', 'Jurong West', 'Hougang',
            'Sengkang', 'Yishun', 'Bedok', 'Ang Mo Kio', 'Choa Chu Kang',
            'Bukit Batok', 'Bukit Merah', 'Pasir Ris', 'Punggol', 'Toa Payoh'
        ]
    },
    {
        name: 'Malaysia',
        code: 'MY',
        phoneCode: '+60',
        phoneFormat: 'XX XXXX XXXX',
        phonePlaceholder: '12 3456 7890',
        flag: '🇲🇾',
        cities: [
            'Kuala Lumpur', 'George Town', 'Ipoh', 'Johor Bahru', 'Petaling Jaya',
            'Shah Alam', 'Malacca City', 'Kota Kinabalu', 'Kuching', 'Seremban',
            'Klang', 'Subang Jaya', 'Miri', 'Alor Setar', 'Kuantan', 'Kuala Terengganu',
            'Kota Bharu', 'Taiping', 'Sibu', 'Sandakan', 'Tawau', 'Bintulu'
        ]
    },
    {
        name: 'Indonesia',
        code: 'ID',
        phoneCode: '+62',
        phoneFormat: 'XXX XXXX XXXX',
        phonePlaceholder: '812 3456 7890',
        flag: '🇮🇩',
        cities: [
            'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
            'Palembang', 'Tangerang', 'Depok', 'Bekasi', 'Padang', 'Denpasar',
            'Malang', 'Samarinda', 'Pekanbaru', 'Batam', 'Bandar Lampung',
            'Bogor', 'Balikpapan', 'Yogyakarta', 'Pontianak', 'Banjarmasin'
        ]
    },
    {
        name: 'Thailand',
        code: 'TH',
        phoneCode: '+66',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '81 234 5678',
        flag: '🇹🇭',
        cities: [
            'Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Nonthaburi', 'Pak Kret',
            'Hat Yai', 'Nakhon Ratchasima', 'Udon Thani', 'Khon Kaen', 'Chiang Rai',
            'Nakhon Si Thammarat', 'Surat Thani', 'Rayong', 'Ubon Ratchathani',
            'Songkhla', 'Nakhon Pathom', 'Phitsanulok', 'Krabi', 'Hua Hin'
        ]
    },
    {
        name: 'Vietnam',
        code: 'VN',
        phoneCode: '+84',
        phoneFormat: 'XXX XXX XXXX',
        phonePlaceholder: '912 345 678',
        flag: '🇻🇳',
        cities: [
            'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho',
            'Bien Hoa', 'Nha Trang', 'Hue', 'Buon Ma Thuot', 'Vung Tau',
            'Da Lat', 'Quy Nhon', 'Thai Nguyen', 'Vinh', 'Long Xuyen',
            'My Tho', 'Rach Gia', 'Nam Dinh', 'Pleiku', 'Ca Mau'
        ]
    },
    {
        name: 'Philippines',
        code: 'PH',
        phoneCode: '+63',
        phoneFormat: 'XXX XXX XXXX',
        phonePlaceholder: '917 123 4567',
        flag: '🇵🇭',
        cities: [
            'Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City',
            'Zamboanga City', 'Taguig', 'Antipolo', 'Pasig', 'Cagayan de Oro',
            'Parañaque', 'Dasmariñas', 'Valenzuela', 'Bacoor', 'General Santos',
            'Las Piñas', 'Makati', 'Bacolod', 'Muntinlupa', 'San Jose del Monte'
        ]
    },
    {
        name: 'New Zealand',
        code: 'NZ',
        phoneCode: '+64',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '21 123 4567',
        flag: '🇳🇿',
        cities: [
            'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga',
            'Napier-Hastings', 'Dunedin', 'Palmerston North', 'Nelson', 'Rotorua',
            'New Plymouth', 'Whangarei', 'Invercargill', 'Whanganui', 'Gisborne',
            'Blenheim', 'Pukekohe', 'Timaru', 'Taupo', 'Masterton'
        ]
    },
    {
        name: 'Ireland',
        code: 'IE',
        phoneCode: '+353',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '85 123 4567',
        flag: '🇮🇪',
        cities: [
            'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Drogheda',
            'Swords', 'Dundalk', 'Bray', 'Navan', 'Ennis', 'Kilkenny', 'Tralee',
            'Carlow', 'Newbridge', 'Naas', 'Athlone', 'Letterkenny', 'Mullingar',
            'Wexford', 'Sligo', 'Clonmel', 'Greystones', 'Arklow', 'Cobh'
        ]
    },
    {
        name: 'Sweden',
        code: 'SE',
        phoneCode: '+46',
        phoneFormat: 'XX XXX XX XX',
        phonePlaceholder: '70 123 45 67',
        flag: '🇸🇪',
        cities: [
            'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro',
            'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå',
            'Gävle', 'Borås', 'Södertälje', 'Eskilstuna', 'Karlstad', 'Täby',
            'Växjö', 'Halmstad', 'Sundsvall', 'Luleå', 'Trollhättan', 'Östersund'
        ]
    },
    {
        name: 'Norway',
        code: 'NO',
        phoneCode: '+47',
        phoneFormat: 'XXX XX XXX',
        phonePlaceholder: '412 34 567',
        flag: '🇳🇴',
        cities: [
            'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Fredrikstad',
            'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg', 'Skien', 'Ålesund',
            'Sandefjord', 'Haugesund', 'Tønsberg', 'Moss', 'Porsgrunn', 'Bodø',
            'Arendal', 'Hamar', 'Larvik', 'Halden', 'Lillehammer', 'Molde'
        ]
    },
    {
        name: 'Denmark',
        code: 'DK',
        phoneCode: '+45',
        phoneFormat: 'XX XX XX XX',
        phonePlaceholder: '20 12 34 56',
        flag: '🇩🇰',
        cities: [
            'Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg', 'Esbjerg',
            'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning',
            'Hørsholm', 'Helsingør', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg',
            'Køge', 'Holstebro', 'Taastrup', 'Slagelse', 'Hillerød', 'Sønderborg'
        ]
    },
    {
        name: 'Finland',
        code: 'FI',
        phoneCode: '+358',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '40 123 4567',
        flag: '🇫🇮',
        cities: [
            'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä',
            'Lahti', 'Kuopio', 'Pori', 'Kouvola', 'Joensuu', 'Lappeenranta',
            'Hämeenlinna', 'Vaasa', 'Rovaniemi', 'Seinäjoki', 'Mikkeli', 'Kotka',
            'Salo', 'Porvoo', 'Kokkola', 'Hyvinkää', 'Lohja', 'Järvenpää'
        ]
    },
    {
        name: 'Czech Republic',
        code: 'CZ',
        phoneCode: '+420',
        phoneFormat: 'XXX XXX XXX',
        phonePlaceholder: '601 123 456',
        flag: '🇨🇿',
        cities: [
            'Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'České Budějovice',
            'Hradec Králové', 'Ústí nad Labem', 'Pardubice', 'Zlín', 'Havířov',
            'Kladno', 'Most', 'Opava', 'Frýdek-Místek', 'Karviná', 'Jihlava',
            'Teplice', 'Děčín', 'Chomutov', 'Karlovy Vary', 'Jablonec nad Nisou'
        ]
    },
    {
        name: 'Hungary',
        code: 'HU',
        phoneCode: '+36',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '20 123 4567',
        flag: '🇭🇺',
        cities: [
            'Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza',
            'Kecskemét', 'Székesfehérvár', 'Szombathely', 'Szolnok', 'Tatabánya',
            'Kaposvár', 'Érd', 'Veszprém', 'Békéscsaba', 'Zalaegerszeg', 'Sopron',
            'Eger', 'Nagykanizsa', 'Dunakeszi', 'Hódmezővásárhely', 'Dunaújváros'
        ]
    },
    {
        name: 'Romania',
        code: 'RO',
        phoneCode: '+40',
        phoneFormat: 'XXX XXX XXX',
        phonePlaceholder: '721 123 456',
        flag: '🇷🇴',
        cities: [
            'Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova',
            'Brașov', 'Galați', 'Ploiești', 'Oradea', 'Brăila', 'Arad', 'Pitești',
            'Sibiu', 'Bacău', 'Târgu Mureș', 'Baia Mare', 'Buzău', 'Botoșani',
            'Satu Mare', 'Râmnicu Vâlcea', 'Drobeta-Turnu Severin', 'Suceava'
        ]
    },
    {
        name: 'Bulgaria',
        code: 'BG',
        phoneCode: '+359',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '88 123 4567',
        flag: '🇧🇬',
        cities: [
            'Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven',
            'Sliven', 'Dobrich', 'Shumen', 'Pernik', 'Haskovo', 'Yambol', 'Pazardzhik',
            'Blagoevgrad', 'Veliko Tarnovo', 'Vratsa', 'Gabrovo', 'Asenovgrad',
            'Vidin', 'Kazanlak', 'Kyustendil', 'Kardzhali', 'Montana', 'Lovech'
        ]
    },
    {
        name: 'Ukraine',
        code: 'UA',
        phoneCode: '+380',
        phoneFormat: 'XX XXX XXXX',
        phonePlaceholder: '50 123 4567',
        flag: '🇺🇦',
        cities: [
            'Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Donetsk', 'Zaporizhzhia', 'Lviv',
            'Kryvyi Rih', 'Mykolaiv', 'Mariupol', 'Luhansk', 'Vinnytsia', 'Kherson',
            'Poltava', 'Chernihiv', 'Cherkasy', 'Sumy', 'Zhytomyr', 'Rivne',
            'Khmelnytskyi', 'Ivano-Frankivsk', 'Ternopil', 'Lutsk', 'Uzhhorod'
        ]
    }
];

const seedCountries = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/selene_jewelry');
        console.log('MongoDB Connected');

        // Clear existing countries
        await Country.deleteMany({});
        console.log('Cleared existing countries');

        // Insert new countries
        await Country.insertMany(countries);
        console.log(`Seeded ${countries.length} countries with cities`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding countries:', err);
        process.exit(1);
    }
};

seedCountries();
