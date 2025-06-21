// products.js - Your central product database (ONLY CONTAINS DATA)

const allProducts = [
    {
        id: 'shirt-001',
        category: 'shirt',
        name: 'Two-Tone Contrast Embroidered Shirt',
        price: 80000.00,
        description: 'Make a bold statement with our Two-Tone Contrast Embroidered Shirt, a striking fusion of classic elegance and contemporary design. This unique shirt features a distinct half-and-half color block, combining a rich navy blue on one side with a crisp white on the other, creating an eye-catching visual appeal.',
        fabric: 'cotton-blend for a crisp look and comfortable wear',
        care: 'Machine wash cold, tumble dry low. Iron on medium heat.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: [
            'images/shirt (1).png',
            'images/sub (8).png'
        ],
        similarProducts: ['shirt-002', 'trousers-001']
    },
    {
        id: 'shirt-002',
        category: 'shirt',
        name: 'Tropical Breeze Button-Up Shirt',
        price: 65000.00,
        description: 'Embrace effortless summer style with our Tropical Breeze Button-Up Shirt. This vibrant short-sleeve shirt features a striking all-over print of lush green and golden-yellow palm leaves against a crisp white background, instantly transporting you to a vacation state of mind.',
        fabric: 'lightweight cotton',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (2).png',
            'images/sub (10).png'
        ],
        similarProducts: ['shirt-008', 'trousers-002']
    },
    {
        id: 'shirt-003',
        category: 'shirt',
        name: 'Azure Paradise Floral Shirt',
        price: 65000.00,
        description: 'Dive into a vibrant summer with our Azure Paradise Floral Shirt. This eye-catching short-sleeve shirt boasts a lively print of dark blue and black hibiscus flowers interspersed with various shades of blue tropical leaves, all set against a refreshing light blue background.',
        fabric: 'lightweight cotton',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (3).png',
            'images/sub (4).png'
        ],
        similarProducts: ['shirt-007', 'trousers-003']
    },
        {
        id: 'shirt-004',
        category: 'shirt',
        name: 'Midnight Bloom Aloha Shirt',
        price: 65000.00,
        description: 'Step into laid-back sophistication with our Midnight Bloom Aloha Shirt. This captivating short-sleeve button-up features a rich navy blue background adorned with an intricate pattern of light blue foliage and elegant cream/beige floral blooms. Perfect for embracing warm weather in style, this shirt offers a relaxed yet refined look suitable for beach vacations, casual gatherings, or simply adding a touch of island charm to your everyday wardrobe.',
        fabric: 'lightweight cotton',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (4).png',
            'images/sub (3).png'
        ],
        similarProducts: ['shirt-003', 'trousers-004']
    },
    {
        id: 'shirt-005',
        category: 'shirt',
        name: 'Multi-Tone Textured Polo Shirt (Multi-Pack)',
        price: 70000.00,
        description: 'Elevate your casual wardrobe with our Multi-Tone Textured Polo Shirt, designed for both style and comfort. This sophisticated polo features distinct horizontal color blocking, combining a subtle textured pattern with a modern aesthetic. Available in several versatile color combinations, including a striking white, olive green, and camel tan mix, and a more subdued earth-toned variant, these shirts are perfect for a smart-casual look.',
        fabric: 'cotton blend, offering breathability and a comfortable feel. The texture appears to be a subtle repeating pattern, possibly a jacquard or pique knit',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (5).png',
            'images/sub (9).png'
        ],
        similarProducts: ['shirt-006', 'trousers-005']
    },
    {
        id: 'shirt-006',
        category: 'shirt',
        name: 'Dynamic Stripe Polo Shirt (Multi-Color Pack)',
        price: 70000.00,
        description: 'Add a vibrant touch to your casual wardrobe with our Dynamic Stripe Polo Shirts. These stylish polos feature a refreshing horizontal stripe pattern, combining varying widths and shades for a contemporary look. Available in a range of appealing color combinations—including a classic blue palette, an earthy green mix, and a striking burgundy variant—each shirt is designed for comfort and a flattering fit.',
        fabric: 'cotton blend,mesh-like fabric',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (6).png',
            'images/sub (6).png'
        ],
        similarProducts: ['shirt-005', 'trousers-006']
    },
    {
        id: 'shirt-007',
        category: 'shirt',
        name: 'Retro Stripe Polo Shirt (Multi-Pack)',
        price: 70000.00,
        description: 'Infuse your wardrobe with a touch of retro charm with our Retro Stripe Polo Shirts. These stylish polos feature a classic vertical stripe pattern in various appealing color combinations, offering a vibrant yet timeless look. Available in a range of options, including a refreshing blue and white, a versatile green and white, a bold burgundy and white, and a sleek black and white, these shirts are crafted from a textured, breathable fabric for ultimate comfort.',
        fabric: 'a textured fabric',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (7).png',
            'images/sub (5).png'
        ],
        similarProducts: ['shirt-001', 'trousers-007']
    },
    {
        id: 'shirt-008',
        category: 'shirt',
        name: 'Tropical Bloom Azure Shirt',
        price: 70000.00,
        description: 'Immerse yourself in vibrant island vibes with our Tropical Bloom Azure Shirt. This striking short-sleeve button-up features an intricate all-over print of lush green and various blue palm leaves, accented with bursts of red-orange bird-of-paradise flowers and soft pink blossoms, all set against a rich azure blue background. Designed for a flattering fit and maximum comfort, this shirt is your go-to for embracing warm weather, whether you are heading to the beach, a casual party.',
        fabric: 'a lightweight and breathable material cotton',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (8).png',
            'images/sub (2).png'
        ],
        similarProducts: ['shirt-011', 'trousers-001']
    },
    {
        id: 'shirt-009',
        category: 'shirt',
        name: 'Textured Berry Overshirt',
        price: 70000.00,
        description: 'Add a layer of distinctive style with our Textured Berry Overshirt. This eye-catching piece features a rich, deep berry (or magenta/maroon) color with a unique horizontal textured stripe pattern, adding depth and interest to the fabric. Designed to be worn as a versatile layering piece, it is perfect over a simple t-shirt for a relaxed yet stylish look. It includes classic shirt details like a point collar, full button-front closure, and two practical chest pockets with flaps.',
        fabric: 'linen blend with a woven horizontal textured',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (9).png',
            'images/sub (1).png'
        ],
        similarProducts: ['shirt-010', 'trousers-002']
    },
    {
        id: 'shirt-010',
        category: 'shirt',
        name: 'Classic Crisp White Button-Down Shirt',
        price: 80000.00,
        description: 'A timeless staple for every wardrobe, our Classic Crisp White Button-Down Shirt offers unmatched versatility and sophistication. Crafted from a comfortable and breathable fabric, this shirt features a clean, sharp silhouette that can be dressed up or down. The classic button-down collar and full-button front provide a refined look, while the long sleeves with buttoned cuffs ensure a polished finish. Perfect for formal occasions.',
        fabric: 'cotton blend, offering breathability and a crisp feel.',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (10).png',
            'images/sub (7).png'
        ],
        similarProducts: ['shirt-005', 'trousers-003']
    },
    {
        id: 'shirt-011',
        category: 'shirt',
        name: 'Classic Crisp White Button-Down Shirt',
        price: 70000.00,
        description: 'Upgrade your casual and active wear with our Sporty Stripe Polo Shirt collection. These comfortable and stylish polos feature a distinctive horizontal stripe design across the chest and sleeves, set against a classic solid body. Available in a versatile pack of three essential colors a crisp white, a bold red, and a deep navy blue each shirt is crafted from a breathable, textured fabric, ensuring comfort and easy movement. Perfect for everyday wear.',
        fabric: 'a similar textured, breathable cotton or poly-cotton blend, ideal for comfort and durability.',
        care: 'Wash inside out with similar colors. Line dry recommended.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
            'images/shirt (11).png',
            'images/sub (9).png'
        ],
        similarProducts: ['shirt-003', 'trousers-004']
    },
    {
        id: 'trousers-001',
        category: 'trousers',
        name: 'Classic Blue Slim-Fit Jeans',
        price: 80000.00,
        description: 'Discover your new go-to denim with our Classic Blue Slim-Fit Jeans. These versatile jeans feature a timeless medium-blue wash with subtle fading, offering a lived-in look that is perfect for everyday wear. Designed with a contemporary slim fit, they provide a sleek silhouette without compromising on comfort. The classic five-pocket styling, sturdy construction, and a distinctive stitch detail on the back pocket ensure both functionality and a touch of unique style.',
        fabric: 'Durable denim (likely 100% cotton)',
        care: 'Dry clean only.',
        sizes: ['28', '30', '32', '34', '36', '38'],
        images: [
            'images/trouser (1).png',
            'https://via.placeholder.com/600x400?text=Wool+Trousers+Back'
        ],
        similarProducts: ['trousers-002', 'shirt-007']
    },
    {
        id: 'trousers-002',
        category: 'trousers',
        name: 'Deep Indigo Slim-Fit Jeans',
        price: 90000.00,
        description: 'Elevate your denim collection with our Deep Indigo Slim-Fit Jeans. These stylish jeans feature a rich, dark indigo blue wash, offering a versatile and modern aesthetic that can effortlessly transition from day to night. Designed with a contemporary slim fit, they provide a sleek and flattering silhouette while ensuring comfortable wear. Classic five-pocket styling and subtle, yet distinctive, stitching details on the back pockets add a touch of refined character. Perfect for pairing with anything from a casual t-shirt to a smart button-down, these jeans are a timeless addition to any wardrobe.',
        fabric: 'Durable denim (a cotton blend, potentially with stretch for comfort).',
        care: 'Machine wash cold. Tumble dry low.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/trouser (2).png',
            'https://via.placeholder.com/600x400?text=Chino+Trousers+Back'
        ],
        similarProducts: ['trousers-007', 'shirt-006']
    },
    {
        id: 'trousers-003',
        category: 'trousers',
        name: 'Vintage Wash Slim-Fit Jeans',
        price: 150000.00,
        description: 'Achieve a cool, lived-in look with our Vintage Wash Slim-Fit Jeans. These stylish jeans feature a medium-to-dark blue wash with intentional fading and whiskering on the thighs and knees, giving them a perfectly worn aesthetic from day one. Designed with a modern slim fit, they offer a sleek silhouette that flatters without being overly restrictive. The classic five-pocket construction provides timeless utility, while the aged finish adds character. Perfect for elevating your casual wardrobe, these jeans pair effortlessly with graphic tees, hoodies, or a relaxed button-down.',
        fabric: 'Durable denim (a cotton blend, potentially with stretch for comfort).',
        care: 'Machine wash cold. Tumble dry low.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/trouser (3).png',
            'https://via.placeholder.com/600x400?text=Chino+Trousers+Back'
        ],
        similarProducts: ['trousers-002', 'shirt-005']
    },
    {
        id: 'trousers-004',
        category: 'trousers',
        name: 'Vibrant Cobalt Blue Jeans',
        price: 90000.00,
        description: 'Add a pop of striking color to your denim collection with our Vibrant Cobalt Blue Jeans. These bold jeans feature a rich, saturated blue wash that stands out from typical denim shades, offering a modern and expressive look. Designed with a comfortable fit, they feature classic five-pocket styling and unique "V" shaped stitching details on the back pockets in contrasting gold thread, adding a distinctive touch. Perfect for making a statement in your casual attire, these jeans pair well with neutral tops or can be styled for an adventurous, color-coordinated ensemble.',
        fabric: 'Durable denim (a cotton blend, potentially with stretch for comfort).',
        care: 'Machine wash cold. Tumble dry low.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/trouser (4).png',
            'https://via.placeholder.com/600x400?text=Chino+Trousers+Back'
        ],
        similarProducts: ['trousers-003', 'shirt-004']
    },
    {
        id: 'trousers-005',
        category: 'trousers',
        name: 'Dark Rinse Classic Stitch Jeans',
        price: 90000.00,
        description: 'Step out in timeless style with our Dark Rinse Classic Stitch Jeans. These versatile jeans feature a rich, deep indigo wash with subtle whiskering, offering a sophisticated and clean aesthetic suitable for various occasions. The classic five-pocket design is enhanced by distinctive golden-brown contrast stitching that highlights the seams and pocket details, adding a touch of craftsmanship. Designed for comfort and a flattering fit.',
        fabric: 'Durable denim (a cotton blend, potentially with stretch for comfort).',
        care: 'Machine wash cold. Tumble dry low.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/trouser (5).png',
            'https://via.placeholder.com/600x400?text=Chino+Trousers+Back'
        ],
        similarProducts: ['trousers-004', 'shirt-003']
    },
    {
        id: 'trousers-006',
        category: 'trousers',
        name: 'Mid-Wash Distressed Slim Jeans',
        price: 150000.00,
        description: 'Achieve an effortlessly cool and contemporary look with our Mid-Wash Distressed Slim Jeans. These stylish jeans feature a versatile mid-blue wash with subtle fading and whiskering on the thighs and knees, giving them a perfectly worn-in feel. Designed with a modern slim fit, they offer a streamlined silhouette while ensuring comfort for all-day wear. The classic five-pocket styling and rugged aesthetic make them an ideal choice for casual outings, weekend adventures, or pairing with your favorite sneakers and a relaxed top.',
        fabric: 'Durable denim (a cotton blend, potentially with stretch for comfort).',
        care: 'Machine wash cold. Tumble dry low.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/trouser (6).png',
            'https://via.placeholder.com/600x400?text=Chino+Trousers+Back'
        ],
        similarProducts: ['trousers-005', 'shirt-002']
    },
    {
        id: 'trousers-007',
        category: 'trousers',
        name: 'Bright Blue Essential Slim Jeans',
        price: 150000.00,
        description: 'Brighten up your denim collection with our Bright Blue Essential Slim Jeans. These vibrant jeans feature a striking, clear blue wash that offers a fresh and modern alternative to traditional denim. Designed with a comfortable slim fit, they provide a sleek silhouette that flatters while allowing for easy movement. The classic five-pocket styling is enhanced by subtle "V" shaped stitching on the back pockets and a distinct branded patch, adding a touch of contemporary detail. Perfect for adding a pop of color to your casual ensembles.',
        fabric: 'Durable denim (a cotton blend, potentially with stretch for comfort).',
        care: 'Machine wash cold. Tumble dry low.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/trouser (7).png',
            'https://via.placeholder.com/600x400?text=Chino+Trousers+Back'
        ],
        similarProducts: ['trousers-006', 'shirt-001']
    },
    {
        id: 'shoe-001',
        category: 'shoes',
        name: 'Air Force 1 Classic White',
        price: 110000.00,
        description: 'Elevate your everyday style with the iconic Air Force 1 Classic White. This timeless low-top sneaker features a pristine all-white design, offering unmatched versatility and a clean, fresh look that complements any outfit. Its durable construction ensures lasting wear, making it a staple for your wardrobe.',
        fabric: 'Upper: Premium Synthetic Leather Lining: Breathable Textile Sole: Durable Rubber Outsole with Encapsulated Air Unit',
        care: 'Wipe clean with a damp cloth and mild soap. Air dry away from direct sunlight. Do not machine wash.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/shoe (1).png',
            'images/shoe (3).png'
        ],
        similarProducts: [ 'shirt-010', 'shoe-004']
    },
        {
        id: 'shoe-002',
        category: 'shoes',
        name: 'Air Force 1 Ocean Blues',
        price: 110000.00,
        description: 'Dive into classic comfort with the Air Force 1 Ocean Blues. This striking two-tone design blends deep navy and crisp white, creating a versatile sneaker that’s both stylish and easy to wear. The textured upper adds depth, making it a unique addition to your sneaker rotation.',
        fabric: 'Upper: Durable Synthetic Leather & Textured Suede-like material (blue) Lining: Breathable Textile Sole: Durable Rubber Outsole with Encapsulated Air Unit',
        care: 'Wipe leather sections with a damp cloth. For textured/suede-like areas, use a soft brush. Air dry. Do not machine wash.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/shoe (2).png',
            'images/shoe (6).png'
        ],
        similarProducts: [ 'shirt-008', 'shoe-003']
    },
        {
        id: 'shoe-003',
        category: 'shoes',
        name: 'Air Force 1 Desert Camo Lows',
        price: 110000.00,
        description: 'Embrace urban sophistication with the Air Force 1 Desert Camo Lows. This distinctive colorway combines rich tan and deep black panels, accented by a crisp white sole, offering a rugged yet refined aesthetic. Perfect for adding a bold statement to your casual or street-style ensemble.',
        fabric: 'Upper: High-Quality Synthetic Leather & Suede accents (black toe) Lining: Breathable Textile Sole: Durable Rubber Outsole with Encapsulated Air Unit',
        care: 'Wipe leather sections with a damp cloth. For suede areas, use a suede brush to remove dirt. Air dry. Do not machine wash.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/shoe (4).png',
            'images/shoe (7).png'
        ],
        similarProducts: [ 'shirt-005', 'shoe-002']
    },
        {
        id: 'shoe-004',
        category: 'shoes',
        name: 'Air Force 1 Tropical Breeze',
        price: 110000.00,
        description: 'Make a vibrant splash with the Air Force 1 Tropical Breeze. Featuring an eye-catching combination of energetic orange suede and cool teal accents, these sneakers bring a playful, resort-inspired vibe to your look. Designed for those who dare to stand out and embrace bold color.',
        fabric: 'Upper: Premium Suede (Orange, Teal, White) Lining: Breathable Textile Sole: Durable Rubber Outsole with Encapsulated Air Unit',
        care: 'Use a soft suede brush to clean. For tough spots, use a suede cleaner. Avoid excessive water. Air dry away from direct sunlight. Do not machine wash.',
        sizes: ['28', '30', '32', '34', '36'],
        images: [
            'images/shoe (5).png',
            'images/shoe (8).png'
        ],
        similarProducts: [ 'shirt-001', 'shoe-001']
    },
];