try {
    const Product = require('./models/Product');
    console.log('Product model loaded successfully');
} catch (error) {
    console.error('Failed to load Product model:', error);
}
