


// Define types for the data structures
interface OrderLine {
    id: string | number;
    product_id: string;
    orderId: string;
    quantity: number;
    price: number;
    created_at: string;
}

interface Product {
    id: string;
    name: string;
    category?: string;
    price: number;
    slug?: string;
    description?: string;
    featured?: boolean;
    badge?: string;
    rating?: number;
    tags?: string[];
    images?: number[];
    totalComments?: number;
    created_at?: string;
    stock?: number;
    collection_id?: number;
    featured_image_id?: number;
}

interface DiscountMetrics {
    totalOrders: number;
    totalQuantity: number;
    averageOrderSize: number;
    totalRevenue: number;
    daysSinceLastOrder: number;
    salesVelocity: number;
}

interface DiscountResult {
    product_id: string;
    discountPercentage: number;
    discountReason: string;
    eligibleForDiscount: boolean;
    metrics?: DiscountMetrics;
}

/**
 * Calculate discount for a specific product based on order history and product data
 * @param productId - The product ID to calculate discount for
 * @returns Discount information for the specified product
 */
function calculateDiscount(productId: string): DiscountResult {
    const products: Product[] = [
        {
            "id": "0015642b-3ac6-4047-ad6b-a690a8297a0c",
            "name": "Comfortable Formal Brown Linen Shoes",
            "slug": "comfortable-formal-brown-linen-shoes_47fab0e1-d51f-4ef8-91a2-2a4d6a965c4e",
            "description": "This women comfortable formal brown linen shoes features a grey color and polka dot pattern. Available in size XL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 4.8,
            "tags": [
                "loafers",
                "boots",
                "casual"
            ],
            "images": [
                4,
                5,
                2
            ],
            "price": 186.68,
            "totalComments": 29,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 184,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "003c15d9-8ade-4fb9-9f36-486b442b2d24",
            "name": "Playful Grey Cargo Pants",
            "slug": "playful-grey-cargo-pants_a462873b-bfff-4765-a836-8ca35a327943",
            "description": "This women playful grey cargo pants features a brown color and solid pattern. Available in size XL.",
            "featured": true,
            "badge": "",
            "rating": 1.6,
            "tags": [
                "jeans",
                "dress",
                "colorful",
                "leggings",
                "t-shirt"
            ],
            "images": [
                1,
                3,
                5,
                2
            ],
            "price": 118.42,
            "totalComments": 49,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 2,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "006b9fb8-2f70-4972-9a0a-87223d0de2d2",
            "name": "Cute Bunny Skirt",
            "slug": "cute-bunny-skirt_a9dd290c-6f65-489d-bf7d-2fe3e1e2dded",
            "description": "This women cute bunny skirt features a maroon color and floral pattern. Available in size L.",
            "featured": true,
            "badge": "",
            "rating": 2.4,
            "tags": [
                "colorful",
                "cotton",
                "dress",
                "top",
                "t-shirt"
            ],
            "images": [
                1,
                5
            ],
            "price": 151.39,
            "totalComments": 15,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 19,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "00bf9a3a-bd76-4952-8f57-ae4ae879de2f",
            "name": "Stylish Cone Red Heels",
            "slug": "stylish-cone-red-heels_7743ec28-4686-4ab7-8143-1320880e5fbb",
            "description": "This kids' stylish cone red heels features a grey color and cable knit pattern. Available in size M.",
            "featured": false,
            "badge": "",
            "rating": 3.6,
            "tags": [
                "formal",
                "sneakers",
                "casual"
            ],
            "images": [
                3,
                1,
                2,
                5
            ],
            "price": 162.87,
            "totalComments": 36,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 129,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "00dc2e2b-b025-415b-b664-f807a2d66a4a",
            "name": "Stylish Kitten Red Heels",
            "slug": "stylish-kitten-red-heels_2e137e33-9b87-4194-a44d-8ad9019560c3",
            "description": "This men stylish kitten red heels features a pink color and patterned pattern. Available in size XS.",
            "featured": false,
            "badge": "Sale",
            "rating": 2.7,
            "tags": [
                "formal",
                "casual",
                "loafers",
                "sports",
                "boots"
            ],
            "images": [
                2,
                1,
                3,
                5
            ],
            "price": 198.56,
            "totalComments": 16,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 194,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "00e2e244-f0fd-42ef-bd20-ac8cd9ba683c",
            "name": "Stylish Green Pants",
            "slug": "stylish-green-pants_cc885ae5-62e0-493b-96b2-df67c4903652",
            "description": "This women stylish green pants features a green color and solid pattern. Available in size XL.",
            "featured": false,
            "badge": "Sale",
            "rating": 4.9,
            "tags": [
                "casual",
                "floral",
                "formal",
                "jeans"
            ],
            "images": [
                2,
                4
            ],
            "price": 180.67,
            "totalComments": 57,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 20,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "0117446e-29d0-4e3a-87f2-02b5106cf097",
            "name": "Classic Cardigan",
            "slug": "classic-cardigan_b509b03d-179e-4c32-87bf-827e66ee45b9",
            "description": "This women classic cardigan features a black color and floral pattern. Available in size S.",
            "featured": true,
            "badge": "Sale",
            "rating": 3.5,
            "tags": [
                "shorts",
                "jacket",
                "pants",
                "casual",
                "t-shirt"
            ],
            "images": [
                1,
                4
            ],
            "price": 202.73,
            "totalComments": 82,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 64,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "011a74b2-d98f-4def-90a2-4129930ef1d3",
            "name": "Black Straight Nylon Vest",
            "slug": "black-straight-nylon-vest_c05da463-4c3c-4ada-8ffd-09bfef749d6b",
            "description": "This men black straight nylon vest features a pink color and solid pattern. Available in size XS.",
            "featured": false,
            "badge": "",
            "rating": 3.6,
            "tags": [
                "polo",
                "shorts",
                "casual",
                "cotton",
                "formal"
            ],
            "images": [
                2,
                5,
                1
            ],
            "price": 101.73,
            "totalComments": 23,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 30,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "name": "Elegant White Denim Maxi Dress",
            "slug": "elegant-white-denim-maxi-dress_83fcad44-e571-4400-acda-656d183593ac",
            "description": "This women elegant white denim maxi dress features a yellow color and striped pattern. Available in size L.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 2.2,
            "tags": [
                "jeans",
                "skirt",
                "casual",
                "floral",
                "silk"
            ],
            "images": [
                2,
                1,
                5
            ],
            "price": 112.31,
            "totalComments": 26,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 91,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "name": "Elegant White Lace Evening Dress",
            "slug": "elegant-white-lace-evening-dress_9e72f187-c5da-49fa-8042-654cf7b7631c",
            "description": "This unisex elegant white lace evening dress features a red color and patterned pattern. Available in size XL.",
            "featured": true,
            "badge": "Sale",
            "rating": 2.7,
            "tags": [
                "floral",
                "top",
                "sweater",
                "summer"
            ],
            "images": [
                5,
                2,
                1,
                4
            ],
            "price": 158.99,
            "totalComments": 37,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 74,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "01c8ddb1-2270-4b9b-9ded-62d0d8242b36",
            "name": "Modern Camo Slim Fit Vest",
            "slug": "modern-camo-slim-fit-vest_1d0e0c72-683e-4efe-a13c-6f2e368654b3",
            "description": "This kids' modern camo slim fit vest features a pink color and polka dot pattern. Available in size L.",
            "featured": false,
            "badge": "",
            "rating": 1.1,
            "tags": [
                "cotton",
                "shirt",
                "casual",
                "jacket",
                "shorts"
            ],
            "images": [
                4,
                5,
                3
            ],
            "price": 57.61,
            "totalComments": 59,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 53,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "02002d5c-056e-4712-b022-ba7de170734e",
            "name": "Casual Solid Tunic",
            "slug": "casual-solid-tunic_1553499d-c1c0-4e6f-8739-c37459e75645",
            "description": "This unisex casual solid tunic features a white color and cable knit pattern. Available in size M.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 2.4,
            "tags": [
                "skirt",
                "jeans",
                "top"
            ],
            "images": [
                4,
                3,
                2
            ],
            "price": 35.82,
            "totalComments": 80,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 46,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "0216d200-92ba-441a-89ea-f0b3a38b7eb6",
            "name": "Comfortable Argyle Jeans",
            "slug": "comfortable-argyle-jeans_ab452807-b7a8-4bfd-9624-e095123de345",
            "description": "This kids' comfortable argyle jeans features a green color and cable knit pattern. Available in size XS.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 3.2,
            "tags": [
                "jeans",
                "playful",
                "shorts"
            ],
            "images": [
                4,
                2,
                1
            ],
            "price": 222.34,
            "totalComments": 48,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 151,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "027652ab-7cd0-42c1-aaeb-1b09604d06c3",
            "name": "Elegant Pink Lace Sports Dress",
            "slug": "elegant-pink-lace-sports-dress_63fce902-9676-48ac-a98b-9e1b2f8766d0",
            "description": "This men elegant pink lace sports dress features a geometric color and cable knit pattern. Available in size M.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1,
            "tags": [
                "top",
                "sweater",
                "summer",
                "dress",
                "formal"
            ],
            "images": [
                3,
                1
            ],
            "price": 102.6,
            "totalComments": 64,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 156,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "03040814-3579-4eaf-8222-f95d3d0b2ebe",
            "name": "Playful Red T-Shirt",
            "slug": "playful-red-t-shirt_aa7d7402-a624-4d01-9b15-6c13c9a4cf4e",
            "description": "This men playful red t-shirt features a white color and striped pattern. Available in size XL.",
            "featured": false,
            "badge": "",
            "rating": 1.8,
            "tags": [
                "shorts",
                "cotton",
                "colorful"
            ],
            "images": [
                1,
                3
            ],
            "price": 203.56,
            "totalComments": 91,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 81,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "034038cd-b987-409d-8b7f-1dd1f48e36db",
            "name": "Classic Sweater",
            "slug": "classic-sweater_c7a25041-63cd-412f-95f7-30e7ebe09ec1",
            "description": "This kids' classic sweater features a white color and striped pattern. Available in size XS.",
            "featured": true,
            "badge": "",
            "rating": 2.4,
            "tags": [
                "pants",
                "shirt"
            ],
            "images": [
                2,
                1
            ],
            "price": 246.78,
            "totalComments": 29,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 95,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "036059e7-fb00-418a-acde-05ee48b60db9",
            "name": "Beige Relaxed Fit Denim A-line Dress",
            "slug": "beige-relaxed-fit-denim-a-line-dress_2d2e0f4e-3192-4ed2-90fa-ce721b48e9d0",
            "description": "This unisex beige relaxed fit denim a-line dress features a geometric color and polka dot pattern. Available in size XXL.",
            "featured": false,
            "badge": "",
            "rating": 3.9,
            "tags": [
                "jeans",
                "casual",
                "pants",
                "shirt"
            ],
            "images": [
                3,
                5,
                2,
                1
            ],
            "price": 241.87,
            "totalComments": 71,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 81,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "03673460-f61a-4f4d-9e42-6c148388c045",
            "name": "Casual Paisley Tunic",
            "slug": "casual-paisley-tunic_17945314-f638-4457-84b7-0775a06fe916",
            "description": "This women casual paisley tunic features a blue color and striped pattern. Available in size XL.",
            "featured": true,
            "badge": "",
            "rating": 1.4,
            "tags": [
                "summer",
                "dress",
                "casual"
            ],
            "images": [
                5,
                2,
                3
            ],
            "price": 70.38,
            "totalComments": 18,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 47,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "03993fd9-84b9-451d-8825-870e2002d11a",
            "name": "Classic Dress",
            "slug": "classic-dress_36aa2af3-a6c3-4683-9ee2-8bf1712d8e01",
            "description": "This men classic dress features a beige color and solid pattern. Available in size XXL.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 1.2,
            "tags": [
                "shirt",
                "polo",
                "pants",
                "jacket"
            ],
            "images": [
                1,
                5,
                3,
                2
            ],
            "price": 104.45,
            "totalComments": 67,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 165,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "03a68da0-c3ef-4e69-940b-99c3c780c957",
            "name": "Casual Solid Halter Top",
            "slug": "casual-solid-halter-top_becb5767-e23a-49fa-a252-cc11e98f6801",
            "description": "This women casual solid halter top features a geometric color and floral pattern. Available in size XXL.",
            "featured": true,
            "badge": "",
            "rating": 4.5,
            "tags": [
                "top",
                "dress"
            ],
            "images": [
                5,
                2,
                4
            ],
            "price": 100.13,
            "totalComments": 58,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 161,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "03c57718-39d5-4117-a814-8485732895de",
            "name": "Comfortable Maxi Beige Wool Shoes",
            "slug": "comfortable-maxi-beige-wool-shoes_82a02251-e0fe-4a27-b1c8-ec3db9d62806",
            "description": "This kids' comfortable maxi beige wool shoes features a maroon color and solid pattern. Available in size S.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 4.5,
            "tags": [
                "formal",
                "boots"
            ],
            "images": [
                2,
                5,
                1,
                3
            ],
            "price": 199.37,
            "totalComments": 34,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 147,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "03cba77e-3522-45cc-bc91-099afb0176eb",
            "name": "Modern Solid Regular Fit Top",
            "slug": "modern-solid-regular-fit-top_0ebe9e2c-0f72-43ef-b407-7dfac4e3da3a",
            "description": "This men modern solid regular fit top features a brown color and patterned pattern. Available in size M.",
            "featured": false,
            "badge": "Sale",
            "rating": 3.3,
            "tags": [
                "cotton",
                "linen",
                "polo",
                "casual"
            ],
            "images": [
                4,
                3,
                2,
                1
            ],
            "price": 161.94,
            "totalComments": 63,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 60,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "040f3603-9e0e-4ada-b0fd-f0c8307a88bd",
            "name": "Stylish Black Cargo Pants",
            "slug": "stylish-black-cargo-pants_5a4626f0-9a61-40e9-91f7-d2216bac6cdb",
            "description": "This unisex stylish black cargo pants features a yellow color and striped pattern. Available in size XXL.",
            "featured": true,
            "badge": "",
            "rating": 4.7,
            "tags": [
                "dress",
                "floral",
                "sweater",
                "casual"
            ],
            "images": [
                2,
                4,
                3,
                1
            ],
            "price": 49.42,
            "totalComments": 85,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 116,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "042d9e4f-34fe-4fa8-8e97-8418f07ed84f",
            "name": "Statement Bracelet",
            "slug": "statement-bracelet_1ddbeb84-b238-4c52-9a97-1ed535b90314",
            "description": "This women statement bracelet features a green color and cable knit pattern. Available in size M.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 4.2,
            "tags": [
                "gloves",
                "bracelet",
                "jewelry",
                "belt"
            ],
            "images": [
                2,
                4,
                5,
                3
            ],
            "price": 141.68,
            "totalComments": 90,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 130,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "04b27d53-0a05-4868-ad53-617f5b9445b6",
            "name": "Blue Relaxed Fit Linen Pants",
            "slug": "blue-relaxed-fit-linen-pants_4fb18a79-79d8-48ba-963f-d0ff6c1d70fb",
            "description": "This women blue relaxed fit linen pants features a red color and striped pattern. Available in size S.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 3,
            "tags": [
                "pants",
                "t-shirt"
            ],
            "images": [
                2,
                3,
                5,
                4
            ],
            "price": 116.28,
            "totalComments": 44,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 62,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "04dd65c8-8a3b-486c-803f-aa6bc0402a1a",
            "name": "Designer Sports Shoes with Charm",
            "slug": "designer-sports-shoes-with-charm_90f352d5-6d29-4c80-b06a-7a66ba3eead2",
            "description": "This women designer sports shoes with charm features a black color and polka dot pattern. Available in size XS.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 3.6,
            "tags": [
                "sunglasses",
                "ring",
                "scarf",
                "jewelry",
                "hat"
            ],
            "images": [
                3,
                4,
                1,
                2
            ],
            "price": 185.89,
            "totalComments": 1,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 44,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "05301503-a537-449f-b875-8fc3b2c6cb5d",
            "name": "Statement Anklet",
            "slug": "statement-anklet_9f0a2e8a-84a1-4dfc-b61f-e0588e3e22d9",
            "description": "This unisex statement anklet features a black color and patterned pattern. Available in size M.",
            "featured": false,
            "badge": "",
            "rating": 2.6,
            "tags": [
                "jewelry",
                "wallet",
                "ring",
                "bracelet",
                "hat"
            ],
            "images": [
                4,
                3
            ],
            "price": 39.07,
            "totalComments": 98,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 185,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "0538cd95-d19b-48d7-b950-030cedcc352b",
            "name": "Brown Tailored Leather Vest",
            "slug": "brown-tailored-leather-vest_8005b5dd-f4df-4308-a67d-5a92a5cfe567",
            "description": "This unisex brown tailored leather vest features a pink color and striped pattern. Available in size L.",
            "featured": false,
            "badge": "",
            "rating": 3.1,
            "tags": [
                "linen",
                "shirt"
            ],
            "images": [
                4,
                5,
                1,
                2
            ],
            "price": 243.87,
            "totalComments": 58,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 127,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "053fbbd7-d449-4ab0-b5bb-a5cf0956ead4",
            "name": "Sporty Adidas Sneakers",
            "slug": "sporty-adidas-sneakers_f8e8f180-fe18-4ef2-8201-0ee77077fce0",
            "description": "This unisex sporty adidas sneakers features a yellow color and cable knit pattern. Available in size M.",
            "featured": false,
            "badge": "",
            "rating": 3.7,
            "tags": [
                "boots",
                "leather",
                "casual",
                "sports",
                "heels"
            ],
            "images": [
                3,
                2
            ],
            "price": 222.25,
            "totalComments": 67,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 26,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "05558d4d-c8a1-487b-b627-d09725be5573",
            "name": "Classic Shorts",
            "slug": "classic-shorts_200738e9-a954-44c1-ad05-261e187fb706",
            "description": "This women classic shorts features a brown color and solid pattern. Available in size XXL.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 3.2,
            "tags": [
                "shirt",
                "jeans"
            ],
            "images": [
                4,
                3,
                2
            ],
            "price": 205.2,
            "totalComments": 76,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 172,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "055fd0ea-dffb-4e2c-9cf6-76799b6eb372",
            "name": "Classic Nylon Shirt",
            "slug": "classic-nylon-shirt_b1bed509-8f78-491e-abd0-f228d4c1a3a1",
            "description": "This unisex classic nylon shirt features a green color and solid pattern. Available in size XXL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 3.1,
            "tags": [
                "hat",
                "earrings",
                "belt",
                "bag",
                "ring"
            ],
            "images": [
                3,
                4,
                2
            ],
            "price": 188.75,
            "totalComments": 90,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 144,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "05af38a7-36cb-4dab-a141-c4590ce62f08",
            "name": "Maroon Regular Fit Cotton Jeans",
            "slug": "maroon-regular-fit-cotton-jeans_f9acc963-af39-4956-ab67-7b826670e32f",
            "description": "This women maroon regular fit cotton jeans features a grey color and solid pattern. Available in size L.",
            "featured": false,
            "badge": "Sale",
            "rating": 1.7,
            "tags": [
                "jeans",
                "jacket",
                "t-shirt",
                "shirt",
                "formal"
            ],
            "images": [
                4,
                1
            ],
            "price": 166.25,
            "totalComments": 66,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 79,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "05c29ace-72a4-43ac-8abb-5bfaac393ecb",
            "name": "Pink Relaxed Fit Nylon Jeans",
            "slug": "pink-relaxed-fit-nylon-jeans_3056e57a-6a75-41f1-be4a-cde784700ccb",
            "description": "This men pink relaxed fit nylon jeans features a maroon color and cable knit pattern. Available in size XXL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1,
            "tags": [
                "linen",
                "polo"
            ],
            "images": [
                1,
                4,
                5,
                3
            ],
            "price": 176.07,
            "totalComments": 2,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 181,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "05d0113c-19e9-40bd-8ad1-37fa9354f04e",
            "name": "Modern Plaid Slim Fit Coat",
            "slug": "modern-plaid-slim-fit-coat_f92f48af-76e1-4f9c-a397-a33a1dbb57e3",
            "description": "This men modern plaid slim fit coat features a blue color and polka dot pattern. Available in size XS.",
            "featured": false,
            "badge": "",
            "rating": 2.7,
            "tags": [
                "linen",
                "jeans",
                "shirt"
            ],
            "images": [
                1,
                3,
                5
            ],
            "price": 59.39,
            "totalComments": 72,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 130,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "05db475a-d56b-4826-a9c0-59df8522b827",
            "name": "Elegant Green Silk Summer Dress",
            "slug": "elegant-green-silk-summer-dress_659b9480-c3f2-4ba5-bd45-b9de838b118c",
            "description": "This kids' elegant green silk summer dress features a black color and striped pattern. Available in size XL.",
            "featured": true,
            "badge": "",
            "rating": 2.8,
            "tags": [
                "sweater",
                "floral"
            ],
            "images": [
                3,
                4
            ],
            "price": 148.8,
            "totalComments": 52,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 193,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "05e2610d-4173-419c-8308-8dd3e6c1e039",
            "name": "Comfortable Evening Maroon Cotton Shoes",
            "slug": "comfortable-evening-maroon-cotton-shoes_cee1e09c-a544-4736-b64d-fa3aa519a48f",
            "description": "This kids' comfortable evening maroon cotton shoes features a yellow color and floral pattern. Available in size XS.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 2.4,
            "tags": [
                "formal",
                "casual",
                "leather",
                "heels",
                "boots"
            ],
            "images": [
                2,
                4,
                5
            ],
            "price": 87.41,
            "totalComments": 77,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 115,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "05f9bf57-0088-470b-aff2-4e7a0ab53ad1",
            "name": "Classic Denim A-line Dress",
            "slug": "classic-denim-a-line-dress_a38d1964-0977-4e0a-96e8-88950eb45ff6",
            "description": "This men classic denim a-line dress features a red color and floral pattern. Available in size L.",
            "featured": true,
            "badge": "Sale",
            "rating": 1.8,
            "tags": [
                "bag",
                "necklace",
                "hat",
                "scarf",
                "jewelry"
            ],
            "images": [
                1,
                2
            ],
            "price": 105.35,
            "totalComments": 60,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 53,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "0604102c-1e1b-42b2-ba55-8d937e5366cd",
            "name": "Statement Anklet",
            "slug": "statement-anklet_e37d7978-644e-4ec3-a603-1397272c3601",
            "description": "This unisex statement anklet features a black color and solid pattern. Available in size M.",
            "featured": false,
            "badge": "Sale",
            "rating": 4.1,
            "tags": [
                "ring",
                "jewelry",
                "gloves",
                "belt"
            ],
            "images": [
                3,
                5,
                2
            ],
            "price": 185.03,
            "totalComments": 14,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 9,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "0617d524-322f-4dfa-8c8e-64481d5ddbb5",
            "name": "Green Oversized Leather Sweater",
            "slug": "green-oversized-leather-sweater_6d42da48-1a80-48a5-bfb9-0a626ebc6e65",
            "description": "This unisex green oversized leather sweater features a green color and solid pattern. Available in size XS.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 3.4,
            "tags": [
                "linen",
                "shirt",
                "jacket",
                "polo"
            ],
            "images": [
                4,
                5
            ],
            "price": 118.49,
            "totalComments": 41,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 129,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "062c4aa9-1e27-4194-a096-117978fd8b54",
            "name": "Classic Top",
            "slug": "classic-top_d7ce3346-a095-4d5e-9438-c44ae04f8778",
            "description": "This women classic top features a blue color and patterned pattern. Available in size XXL.",
            "featured": false,
            "badge": "Sale",
            "rating": 2.2,
            "tags": [
                "shorts",
                "t-shirt",
                "formal"
            ],
            "images": [
                2,
                4,
                5
            ],
            "price": 170.38,
            "totalComments": 70,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 82,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "063cf377-05e0-4f36-9229-6c152131e024",
            "name": "Cute Bear Dress",
            "slug": "cute-bear-dress_df99ced2-679b-4428-b5c4-7400603b3b34",
            "description": "This men cute bear dress features a grey color and solid pattern. Available in size XL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1.6,
            "tags": [
                "playful",
                "shorts",
                "leggings",
                "colorful",
                "cotton"
            ],
            "images": [
                1,
                4
            ],
            "price": 47.26,
            "totalComments": 13,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 198,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "065fe184-a9f3-411a-974f-d9d4792f57a3",
            "name": "Comfortable Striped Shorts",
            "slug": "comfortable-striped-shorts_f0fd50da-e240-4b70-93b0-02cb96f957e8",
            "description": "This men comfortable striped shorts features a black color and patterned pattern. Available in size M.",
            "featured": true,
            "badge": "",
            "rating": 1.3,
            "tags": [
                "colorful",
                "shorts",
                "dress"
            ],
            "images": [
                5,
                4,
                2,
                1
            ],
            "price": 115.83,
            "totalComments": 0,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 107,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "06660a34-467e-4228-8317-44f77037673f",
            "name": "Classic Sports Shoes",
            "slug": "classic-sports-shoes_749595e3-ddab-4e87-b5b3-43779217a188",
            "description": "This men classic sports shoes features a white color and solid pattern. Available in size XXL.",
            "featured": true,
            "badge": "Sale",
            "rating": 2.1,
            "tags": [
                "t-shirt",
                "shirt",
                "formal",
                "linen"
            ],
            "images": [
                3,
                5,
                4,
                1
            ],
            "price": 124.95,
            "totalComments": 19,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 12,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0678cffe-b0a1-4357-944f-0d1723cd9b40",
            "name": "Stylish Geometric Jeans",
            "slug": "stylish-geometric-jeans_f0c20e0f-52bf-4bed-9af4-182061fb4a6d",
            "description": "This men stylish geometric jeans features a geometric color and striped pattern. Available in size XL.",
            "featured": true,
            "badge": "Sale",
            "rating": 4.4,
            "tags": [
                "jeans",
                "skirt",
                "formal"
            ],
            "images": [
                4,
                5
            ],
            "price": 80.44,
            "totalComments": 58,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 153,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "068d394c-75ba-452b-8645-f2c0eecb2c6a",
            "name": "Modern Solid Tailored Vest",
            "slug": "modern-solid-tailored-vest_0a31e187-51f1-46e7-9475-a0af3812be78",
            "description": "This women modern solid tailored vest features a blue color and cable knit pattern. Available in size XXL.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 3.3,
            "tags": [
                "polo",
                "shorts",
                "shirt",
                "cotton",
                "pants"
            ],
            "images": [
                5,
                1,
                2,
                4
            ],
            "price": 109.16,
            "totalComments": 56,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 120,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "06a269e9-5021-41c5-8abd-c39a751887b1",
            "name": "Casual Geometric Halter Top",
            "slug": "casual-geometric-halter-top_d11c4c22-98f3-43d9-b229-7c618a52d2c8",
            "description": "This unisex casual geometric halter top features a white color and patterned pattern. Available in size S.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1.2,
            "tags": [
                "silk",
                "blouse",
                "dress",
                "formal",
                "floral"
            ],
            "images": [
                4,
                1
            ],
            "price": 172.45,
            "totalComments": 50,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 45,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "06c27b14-5606-47e2-823c-8280615b1c54",
            "name": "Stylish White Coat",
            "slug": "stylish-white-coat_5b6ed854-fac2-435a-b104-c0d6ea5fc4d6",
            "description": "This kids' stylish white coat features a pink color and striped pattern. Available in size XXL.",
            "featured": false,
            "badge": "",
            "rating": 2.5,
            "tags": [
                "sweater",
                "top"
            ],
            "images": [
                2,
                4
            ],
            "price": 132.42,
            "totalComments": 71,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 103,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "06d6270d-153b-4fce-88b5-7273c7e6848e",
            "name": "Reebok Dress",
            "slug": "reebok-dress_33f0ed39-1354-4a6d-b490-76ec48d278c4",
            "description": "This unisex reebok dress features a white color and polka dot pattern. Available in size M.",
            "featured": true,
            "badge": "Sale",
            "rating": 4.5,
            "tags": [
                "shirt",
                "t-shirt"
            ],
            "images": [
                3,
                5,
                2,
                4
            ],
            "price": 207.23,
            "totalComments": 16,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 39,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "071e4d43-2125-4112-bf68-fafc9db70f86",
            "name": "Playful Beige Coat",
            "slug": "playful-beige-coat_d49df361-73f2-4806-8dbc-14225677e4a1",
            "description": "This women playful beige coat features a brown color and polka dot pattern. Available in size XXL.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 1.3,
            "tags": [
                "leggings",
                "top",
                "playful",
                "t-shirt",
                "jeans"
            ],
            "images": [
                1,
                4,
                5,
                2
            ],
            "price": 165.7,
            "totalComments": 57,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 4,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "075062df-a0f2-4617-8bc1-e0a546551b42",
            "name": "Sporty Zara Sneakers",
            "slug": "sporty-zara-sneakers_43fa247c-6fd1-43e1-933d-c02073028398",
            "description": "This kids' sporty zara sneakers features a grey color and solid pattern. Available in size S.",
            "featured": false,
            "badge": "",
            "rating": 3.8,
            "tags": [
                "formal",
                "leather"
            ],
            "images": [
                4,
                2
            ],
            "price": 61.51,
            "totalComments": 33,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 128,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "077a6502-3a65-4e14-90e2-328eb640afa7",
            "name": "Nike Coat",
            "slug": "nike-coat_6e631e8f-4b44-4a05-abb8-3242bf1f36c9",
            "description": "This women nike coat features a pink color and patterned pattern. Available in size XS.",
            "featured": false,
            "badge": "Sale",
            "rating": 1.4,
            "tags": [
                "casual",
                "polo"
            ],
            "images": [
                1,
                4,
                2
            ],
            "price": 116,
            "totalComments": 21,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 17,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0789ada2-1ba0-4874-bd66-5da36bf2a304",
            "name": "White Loose Linen Polo Shirt",
            "slug": "white-loose-linen-polo-shirt_beeb44a1-acac-4987-8556-e1a049299e03",
            "description": "This women white loose linen polo shirt features a white color and cable knit pattern. Available in size XL.",
            "featured": false,
            "badge": "",
            "rating": 3,
            "tags": [
                "casual",
                "t-shirt",
                "polo",
                "jeans",
                "cotton"
            ],
            "images": [
                3,
                2
            ],
            "price": 37.38,
            "totalComments": 9,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 12,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0789f7cb-996e-4bcc-a892-29522e34c9df",
            "name": "Playful Yellow Dress",
            "slug": "playful-yellow-dress_5ac7429b-610f-46a0-8050-450e52b99e61",
            "description": "This men playful yellow dress features a brown color and solid pattern. Available in size XL.",
            "featured": false,
            "badge": "Sale",
            "rating": 2.7,
            "tags": [
                "t-shirt",
                "leggings",
                "jeans",
                "playful",
                "shorts"
            ],
            "images": [
                5,
                1,
                3
            ],
            "price": 165.54,
            "totalComments": 43,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 97,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "078e8aef-6888-40f0-ad4a-fb3dad902e6d",
            "name": "Stylish Platform Beige Heels",
            "slug": "stylish-platform-beige-heels_7893b6f9-c958-4e44-8328-aedf5ba71d2a",
            "description": "This unisex stylish platform beige heels features a brown color and floral pattern. Available in size XS.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 3.5,
            "tags": [
                "heels",
                "sneakers"
            ],
            "images": [
                5,
                2,
                4,
                1
            ],
            "price": 92.85,
            "totalComments": 22,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 123,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "079f1b47-9df0-4781-8932-fcb09733b80d",
            "name": "Designer Long Dress with Studs",
            "slug": "designer-long-dress-with-studs_2095288e-1b94-4a9f-8268-367f4414bfe4",
            "description": "This men designer long dress with studs features a brown color and solid pattern. Available in size S.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1.3,
            "tags": [
                "belt",
                "earrings",
                "hat",
                "scarf",
                "bag"
            ],
            "images": [
                4,
                3,
                2,
                1
            ],
            "price": 167.53,
            "totalComments": 26,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 35,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "07ec320e-692e-4e86-b7a9-69c22ff38328",
            "name": "Statement Ring",
            "slug": "statement-ring_c0359235-6748-4bc9-9b4c-3357763c6af9",
            "description": "This women statement ring features a white color and patterned pattern. Available in size M.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 1.4,
            "tags": [
                "sunglasses",
                "bracelet"
            ],
            "images": [
                1,
                4
            ],
            "price": 103.56,
            "totalComments": 58,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 52,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "07fbb1ac-8974-4b4a-9b59-44ba6eff4711",
            "name": "Casual Floral Tunic",
            "slug": "casual-floral-tunic_ea37bd7e-171a-4127-9ca9-8e235447612e",
            "description": "This women casual floral tunic features a green color and solid pattern. Available in size XXL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1.4,
            "tags": [
                "formal",
                "jeans"
            ],
            "images": [
                4,
                5
            ],
            "price": 204.48,
            "totalComments": 67,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 75,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "08162d9d-a05b-4bad-8af2-5e93b66d5354",
            "name": "Comfortable Argyle Vest",
            "slug": "comfortable-argyle-vest_c7f59b06-3f8f-44e8-9af7-cb6b5ffbfbf7",
            "description": "This kids' comfortable argyle vest features a blue color and patterned pattern. Available in size XXL.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 4.3,
            "tags": [
                "cotton",
                "top",
                "jeans"
            ],
            "images": [
                4,
                2,
                5
            ],
            "price": 151.74,
            "totalComments": 93,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 68,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "0853709c-dfe8-4202-9297-02c58c14a749",
            "name": "Comfortable Striped Blouse",
            "slug": "comfortable-striped-blouse_850684ab-e4f0-4f82-aaeb-8cc5552efbb9",
            "description": "This kids' comfortable striped blouse features a geometric color and polka dot pattern. Available in size XL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1.8,
            "tags": [
                "cotton",
                "dress",
                "colorful",
                "leggings",
                "shorts"
            ],
            "images": [
                4,
                3,
                2
            ],
            "price": 205.3,
            "totalComments": 64,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 126,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "08588082-6608-48e3-9be2-86e67e5f5d03",
            "name": "Green Straight Denim T-Shirt",
            "slug": "green-straight-denim-t-shirt_b996c174-e04e-4ac9-9129-0189228cec02",
            "description": "This women green straight denim t-shirt features a maroon color and polka dot pattern. Available in size XS.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 2.2,
            "tags": [
                "cotton",
                "linen",
                "formal",
                "shorts",
                "polo"
            ],
            "images": [
                1,
                3,
                5,
                4
            ],
            "price": 237.74,
            "totalComments": 83,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 153,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0861da82-1387-4cab-a0a7-7c5240eada71",
            "name": "Elegant Black Denim Formal Dress",
            "slug": "elegant-black-denim-formal-dress_b494c41e-807b-4fcc-9d96-ce0a62826ebb",
            "description": "This women elegant black denim formal dress features a brown color and patterned pattern. Available in size L.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 4.4,
            "tags": [
                "summer",
                "floral",
                "formal",
                "cotton",
                "jeans"
            ],
            "images": [
                3,
                1,
                2,
                4
            ],
            "price": 51.61,
            "totalComments": 58,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 60,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "08676ee0-9ab7-446e-8886-2107099a44fa",
            "name": "Elegant Red Lace Summer Dress",
            "slug": "elegant-red-lace-summer-dress_e73ed1b0-4d96-4c8e-aaee-51318083a011",
            "description": "This kids' elegant red lace summer dress features a green color and patterned pattern. Available in size XL.",
            "featured": true,
            "badge": "",
            "rating": 2.6,
            "tags": [
                "silk",
                "floral"
            ],
            "images": [
                5,
                4
            ],
            "price": 163.3,
            "totalComments": 29,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 151,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "08695992-caa0-426d-ba26-4d5cdc9cd93f",
            "name": "Cute Elephant A-line Dress",
            "slug": "cute-elephant-a-line-dress_ac88d7b9-d5cd-453a-8244-4a773e237353",
            "description": "This unisex cute elephant a-line dress features a white color and floral pattern. Available in size S.",
            "featured": false,
            "badge": "",
            "rating": 2.2,
            "tags": [
                "colorful",
                "jeans"
            ],
            "images": [
                2,
                3,
                5
            ],
            "price": 142.56,
            "totalComments": 2,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 146,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "086a0788-26dc-458b-8215-7f8bc818fce1",
            "name": "Blue Straight Cashmere Cargo Pants",
            "slug": "blue-straight-cashmere-cargo-pants_13316ac8-6c06-4244-9d88-dbd3c8230e6f",
            "description": "This men blue straight cashmere cargo pants features a geometric color and patterned pattern. Available in size L.",
            "featured": false,
            "badge": "Sale",
            "rating": 1.9,
            "tags": [
                "casual",
                "linen",
                "formal"
            ],
            "images": [
                1,
                4,
                3
            ],
            "price": 38.67,
            "totalComments": 64,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 150,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "087e668e-ddb3-485c-bc10-3c2781a4b49b",
            "name": "Casual Paisley Halter Top",
            "slug": "casual-paisley-halter-top_78eece21-b99c-4fdd-9930-7621b6ee1761",
            "description": "This men casual paisley halter top features a geometric color and patterned pattern. Available in size XL.",
            "featured": false,
            "badge": "",
            "rating": 4.2,
            "tags": [
                "formal",
                "blouse"
            ],
            "images": [
                1,
                5,
                2
            ],
            "price": 149.34,
            "totalComments": 5,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 32,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "088f6ed1-9ab6-4925-a5ba-8a8656422eaf",
            "name": "Comfortable Casual Blue Denim Shoes",
            "slug": "comfortable-casual-blue-denim-shoes_a9863bed-0440-4c6d-9371-22b781fdd0fa",
            "description": "This women comfortable casual blue denim shoes features a maroon color and cable knit pattern. Available in size XS.",
            "featured": false,
            "badge": "",
            "rating": 1.3,
            "tags": [
                "casual",
                "loafers",
                "leather",
                "sports",
                "boots"
            ],
            "images": [
                2,
                1,
                4
            ],
            "price": 96.67,
            "totalComments": 24,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 52,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0896808c-6ee8-4d9f-bee0-6921f54240bd",
            "name": "Playful Beige Jeans",
            "slug": "playful-beige-jeans_2bbcb36f-195f-4256-a099-2f684fedad61",
            "description": "This unisex playful beige jeans features a white color and striped pattern. Available in size M.",
            "featured": true,
            "badge": "Sale",
            "rating": 4.1,
            "tags": [
                "shorts",
                "dress",
                "colorful",
                "playful",
                "cotton"
            ],
            "images": [
                5,
                3,
                4,
                2
            ],
            "price": 158.11,
            "totalComments": 86,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 89,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "08c0c0fa-1fb7-43ee-8922-f47a816a192a",
            "name": "Grey Straight Cotton Jeans",
            "slug": "grey-straight-cotton-jeans_c7e2a5ec-b245-4af3-8412-274ca7bcab87",
            "description": "This unisex grey straight cotton jeans features a red color and cable knit pattern. Available in size L.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 4.1,
            "tags": [
                "formal",
                "cotton",
                "linen"
            ],
            "images": [
                4,
                2
            ],
            "price": 176.99,
            "totalComments": 55,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 157,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "08c24619-24d7-4cd3-b228-a8bda212a540",
            "name": "Playful Geometric Blouse",
            "slug": "playful-geometric-blouse_2d65d6c7-4c56-46be-8838-b978e1436dfa",
            "description": "This men playful geometric blouse features a maroon color and floral pattern. Available in size S.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 3.6,
            "tags": [
                "playful",
                "jeans",
                "dress"
            ],
            "images": [
                2,
                4,
                1,
                5
            ],
            "price": 207.41,
            "totalComments": 3,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 41,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "08cbc0df-2918-495d-833f-88eb076c2ea1",
            "name": "Modern Polka Dot Straight Sports Shoes",
            "slug": "modern-polka-dot-straight-sports-shoes_97a86df9-1dd1-4158-ae00-ffd9940a93e3",
            "description": "This unisex modern polka dot straight sports shoes features a black color and patterned pattern. Available in size M.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 3.7,
            "tags": [
                "cotton",
                "formal",
                "pants",
                "shirt"
            ],
            "images": [
                5,
                4,
                1,
                3
            ],
            "price": 194.63,
            "totalComments": 36,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 151,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "090ed56c-7c5f-43d1-a57b-ba8ddd9cefec",
            "name": "Casual Polka Dot Halter Top",
            "slug": "casual-polka-dot-halter-top_3d067cc3-0c07-4e1b-b14c-a6d4ce6621ed",
            "description": "This unisex casual polka dot halter top features a green color and solid pattern. Available in size XL.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 2.3,
            "tags": [
                "dress",
                "jeans",
                "skirt",
                "formal"
            ],
            "images": [
                4,
                2,
                1,
                3
            ],
            "price": 195.38,
            "totalComments": 51,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 4,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "090f23f5-03e6-43f8-b899-3a7f43f9003b",
            "name": "Playful Yellow Coat",
            "slug": "playful-yellow-coat_00d38529-53a7-4060-9da6-ad6d9d434b9c",
            "description": "This kids' playful yellow coat features a red color and solid pattern. Available in size M.",
            "featured": false,
            "badge": "Sale",
            "rating": 2.9,
            "tags": [
                "colorful",
                "t-shirt",
                "top",
                "jeans",
                "leggings"
            ],
            "images": [
                2,
                1,
                4,
                3
            ],
            "price": 243.57,
            "totalComments": 3,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 71,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "0911d8ff-72b2-4e72-a6e8-df9b34ff049a",
            "name": "Casual Paisley Halter Top",
            "slug": "casual-paisley-halter-top_ddb0a6c8-070c-4b29-acbd-76e29e1cb053",
            "description": "This kids' casual paisley halter top features a pink color and floral pattern. Available in size S.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 1.9,
            "tags": [
                "sweater",
                "silk",
                "summer",
                "formal",
                "skirt"
            ],
            "images": [
                5,
                3,
                1
            ],
            "price": 60.91,
            "totalComments": 48,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 156,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "093e22ff-8172-44d0-9865-1b0212e9580d",
            "name": "Elegant Black Silk Sports Dress",
            "slug": "elegant-black-silk-sports-dress_25245fac-a28e-4277-abe5-ad489b5ad3c9",
            "description": "This unisex elegant black silk sports dress features a black color and striped pattern. Available in size XS.",
            "featured": true,
            "badge": "Sale",
            "rating": 1.2,
            "tags": [
                "jeans",
                "dress",
                "cotton",
                "formal"
            ],
            "images": [
                3,
                5
            ],
            "price": 67.11,
            "totalComments": 26,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 188,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "09df279c-0cb5-4097-9fec-eb0b043b9f7f",
            "name": "Stylish Yellow Pants",
            "slug": "stylish-yellow-pants_4f7fd259-1c3a-477c-9374-76f50c482f93",
            "description": "This men stylish yellow pants features a blue color and striped pattern. Available in size XL.",
            "featured": false,
            "badge": "",
            "rating": 4.4,
            "tags": [
                "floral",
                "cotton",
                "silk",
                "dress",
                "sweater"
            ],
            "images": [
                2,
                1,
                3,
                4
            ],
            "price": 188.01,
            "totalComments": 27,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 186,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "0a172379-2660-423e-ac4e-bd76254955c7",
            "name": "Classic Sweater",
            "slug": "classic-sweater_0574123f-d3ac-4527-9fe9-e8880f715e24",
            "description": "This unisex classic sweater features a red color and floral pattern. Available in size S.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 4.2,
            "tags": [
                "cotton",
                "linen",
                "formal"
            ],
            "images": [
                2,
                4
            ],
            "price": 171.04,
            "totalComments": 64,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 107,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0a49e093-8261-4580-b820-ff94831fecb8",
            "name": "Under Armour Cargo Pants",
            "slug": "under-armour-cargo-pants_481cc6ac-532c-48be-9ad3-a7ec27bf82ca",
            "description": "This kids' under armour cargo pants features a geometric color and cable knit pattern. Available in size XXL.",
            "featured": false,
            "badge": "",
            "rating": 3.2,
            "tags": [
                "shorts",
                "polo",
                "jacket",
                "casual"
            ],
            "images": [
                2,
                5,
                3,
                1
            ],
            "price": 133.95,
            "totalComments": 27,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 12,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0a63c627-5749-42fa-98ef-b2d1157924de",
            "name": "Elegant Red Chiffon Maxi Dress",
            "slug": "elegant-red-chiffon-maxi-dress_057dcff5-5154-4657-b092-6ffd560ed24a",
            "description": "This unisex elegant red chiffon maxi dress features a grey color and patterned pattern. Available in size XXL.",
            "featured": true,
            "badge": "Sale",
            "rating": 2.6,
            "tags": [
                "floral",
                "formal",
                "dress",
                "blouse",
                "summer"
            ],
            "images": [
                2,
                5
            ],
            "price": 169.43,
            "totalComments": 33,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 62,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "0a6e05ec-b2f5-4b91-838b-9f53f5c19a23",
            "name": "Yellow Relaxed Fit Polyester Pants",
            "slug": "yellow-relaxed-fit-polyester-pants_6f750fbf-0478-4c8f-b61b-9ff73fd6ac0d",
            "description": "This unisex yellow relaxed fit polyester pants features a green color and polka dot pattern. Available in size L.",
            "featured": true,
            "badge": "Sale",
            "rating": 4.3,
            "tags": [
                "polo",
                "t-shirt",
                "jacket",
                "pants"
            ],
            "images": [
                2,
                3,
                5,
                1
            ],
            "price": 135.05,
            "totalComments": 13,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 108,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0abac6c0-a04b-4cd9-b763-8b13b958e766",
            "name": "Elegant Yellow Chiffon Evening Dress",
            "slug": "elegant-yellow-chiffon-evening-dress_b6316f08-3505-40b1-b6eb-64b923d79326",
            "description": "This men elegant yellow chiffon evening dress features a white color and striped pattern. Available in size XL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 2.8,
            "tags": [
                "silk",
                "casual",
                "summer",
                "jeans",
                "cotton"
            ],
            "images": [
                3,
                4,
                2
            ],
            "price": 232.09,
            "totalComments": 76,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 46,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "0abb9e28-43c2-4c71-a30a-a2ecdd8e7d17",
            "name": "Sporty Gucci Sneakers",
            "slug": "sporty-gucci-sneakers_60c2bb58-0dc8-4013-a2ed-4e108d2f8d49",
            "description": "This women sporty gucci sneakers features a pink color and patterned pattern. Available in size XS.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 2.9,
            "tags": [
                "formal",
                "sneakers",
                "leather",
                "boots",
                "sports"
            ],
            "images": [
                2,
                1,
                4
            ],
            "price": 56.16,
            "totalComments": 16,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 143,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0acbc74d-5724-4a49-92bc-7c313e702cec",
            "name": "Modern Solid Straight Pants",
            "slug": "modern-solid-straight-pants_28dc66f2-056b-46fb-98d1-a1249f6863dd",
            "description": "This kids' modern solid straight pants features a yellow color and patterned pattern. Available in size M.",
            "featured": false,
            "badge": "Sale",
            "rating": 4.7,
            "tags": [
                "jeans",
                "cotton",
                "formal"
            ],
            "images": [
                3,
                4,
                2,
                1
            ],
            "price": 98.14,
            "totalComments": 75,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 138,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0ad79219-90e7-4f80-b41c-d45826db5056",
            "name": "Sporty Puma Sneakers",
            "slug": "sporty-puma-sneakers_775dfc78-aafe-4b9b-9586-64923cf4f652",
            "description": "This unisex sporty puma sneakers features a beige color and patterned pattern. Available in size XL.",
            "featured": false,
            "badge": "Sale",
            "rating": 4.1,
            "tags": [
                "casual",
                "leather",
                "loafers",
                "sports"
            ],
            "images": [
                2,
                4
            ],
            "price": 210.94,
            "totalComments": 9,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 88,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "name": "Stylish Cone Maroon Heels",
            "slug": "stylish-cone-maroon-heels_8a7d5868-f597-408c-8b45-a9899baceb33",
            "description": "This kids' stylish cone maroon heels features a beige color and patterned pattern. Available in size XXL.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 3,
            "tags": [
                "boots",
                "heels",
                "formal",
                "sneakers",
                "casual"
            ],
            "images": [
                5,
                1
            ],
            "price": 77.22,
            "totalComments": 29,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 15,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "name": "Sporty Puma Sneakers",
            "slug": "sporty-puma-sneakers_87356b79-45ed-418a-a74b-907e64a47d4f",
            "description": "This unisex sporty puma sneakers features a geometric color and cable knit pattern. Available in size XL.",
            "featured": true,
            "badge": "",
            "rating": 2.4,
            "tags": [
                "sandals",
                "formal",
                "leather"
            ],
            "images": [
                3,
                5
            ],
            "price": 94.87,
            "totalComments": 44,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 72,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0b10eb0c-fda5-4ece-9158-8cea27dc8e8e",
            "name": "Playful Grey Cargo Pants",
            "slug": "playful-grey-cargo-pants_30b7e199-d483-4f9a-b50c-dd9bac30546b",
            "description": "This unisex playful grey cargo pants features a geometric color and patterned pattern. Available in size XS.",
            "featured": false,
            "badge": "Sale",
            "rating": 2.9,
            "tags": [
                "jeans",
                "colorful"
            ],
            "images": [
                3,
                4
            ],
            "price": 88.68,
            "totalComments": 68,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 89,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "0b1ddc76-0a25-4fe4-b276-89016fcbf6ca",
            "name": "Stylish Stiletto Grey Heels",
            "slug": "stylish-stiletto-grey-heels_1f46559f-b0ea-4bfc-b324-9619f81d571f",
            "description": "This unisex stylish stiletto grey heels features a geometric color and solid pattern. Available in size L.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 4.3,
            "tags": [
                "sports",
                "heels",
                "sandals"
            ],
            "images": [
                5,
                1,
                2
            ],
            "price": 76.17,
            "totalComments": 58,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 74,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0b1de6c8-6a79-4246-8e21-871468f8fe59",
            "name": "Classic Shirt",
            "slug": "classic-shirt_e72bda6d-090c-4505-82ff-08e4b57b8a32",
            "description": "This unisex classic shirt features a blue color and striped pattern. Available in size S.",
            "featured": false,
            "badge": "Sale",
            "rating": 3.5,
            "tags": [
                "shirt",
                "polo",
                "t-shirt",
                "formal",
                "pants"
            ],
            "images": [
                2,
                5,
                3
            ],
            "price": 206.11,
            "totalComments": 4,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 163,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "name": "Stylish Blue Cardigan",
            "slug": "stylish-blue-cardigan_40eacabd-f086-485c-ab82-3acff2ad7f77",
            "description": "This unisex stylish blue cardigan features a red color and polka dot pattern. Available in size S.",
            "featured": true,
            "badge": "Sale",
            "rating": 2.8,
            "tags": [
                "cotton",
                "formal"
            ],
            "images": [
                4,
                2
            ],
            "price": 61.29,
            "totalComments": 49,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 65,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "0b5b918d-6dc3-4951-a3af-535a0294f7f6",
            "name": "Statement Ring",
            "slug": "statement-ring_b42f41f7-8751-4218-a482-c885ddcba305",
            "description": "This men statement ring features a green color and polka dot pattern. Available in size M.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 2.5,
            "tags": [
                "gloves",
                "sunglasses",
                "bracelet",
                "hat"
            ],
            "images": [
                5,
                4
            ],
            "price": 192.37,
            "totalComments": 21,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 102,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "0be45f24-1c25-4eea-948e-538c633ce443",
            "name": "Cute Bear Jeans",
            "slug": "cute-bear-jeans_732cee39-8f75-4358-be3d-1aa3ac34921d",
            "description": "This unisex cute bear jeans features a yellow color and solid pattern. Available in size S.",
            "featured": true,
            "badge": "",
            "rating": 3.4,
            "tags": [
                "shorts",
                "cotton",
                "jeans",
                "dress",
                "leggings"
            ],
            "images": [
                2,
                3,
                5,
                1
            ],
            "price": 239.03,
            "totalComments": 6,
            "created_at": "2025-03-08 15:25:04.437905+00",
            "stock": 64,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "0bf0d41d-29a2-49d2-b877-9ae5b79af1f7",
            "name": "Cute Elephant Dress",
            "slug": "cute-elephant-dress_144a8fdd-7f08-4212-9488-d699a63a523d",
            "description": "This unisex cute elephant dress features a grey color and polka dot pattern. Available in size S.",
            "featured": false,
            "badge": "",
            "rating": 3.3,
            "tags": [
                "colorful",
                "leggings",
                "t-shirt"
            ],
            "images": [
                1,
                3
            ],
            "price": 41.17,
            "totalComments": 0,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 88,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "0c2e2fe9-dfe0-4622-a90f-de9f8a267100",
            "name": "Stylish Maroon A-line Dress",
            "slug": "stylish-maroon-a-line-dress_cbe85751-63fb-48a0-a414-fb821e04d0b2",
            "description": "This women stylish maroon a-line dress features a blue color and striped pattern. Available in size L.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 1.9,
            "tags": [
                "summer",
                "silk",
                "blouse"
            ],
            "images": [
                5,
                4,
                3,
                1
            ],
            "price": 128.88,
            "totalComments": 93,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 101,
            "collection_id": 2,
            "featured_image_id": 2
        },
        {
            "id": "0c6fd909-e317-4986-80ef-426f6a5fba71",
            "name": "Cute Bear Skirt",
            "slug": "cute-bear-skirt_5923910f-a619-44bf-8076-dd958f0965c7",
            "description": "This men cute bear skirt features a black color and floral pattern. Available in size M.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 2.8,
            "tags": [
                "cotton",
                "playful",
                "shorts"
            ],
            "images": [
                3,
                2,
                5,
                4
            ],
            "price": 136.94,
            "totalComments": 85,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 103,
            "collection_id": 3,
            "featured_image_id": 3
        },
        {
            "id": "0c81759c-ee29-4af0-9e7b-2ffcf549f941",
            "name": "Sporty Gucci Sneakers",
            "slug": "sporty-gucci-sneakers_0e41de19-959a-4af3-819b-42ceb6693ff0",
            "description": "This unisex sporty gucci sneakers features a white color and floral pattern. Available in size M.",
            "featured": true,
            "badge": "Sale",
            "rating": 4.5,
            "tags": [
                "boots",
                "sports",
                "heels",
                "sneakers",
                "casual"
            ],
            "images": [
                4,
                5,
                3
            ],
            "price": 164.32,
            "totalComments": 20,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 194,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0c972c9b-1fd7-4409-8f61-48ade89644e8",
            "name": "Designer Skirt with Charm",
            "slug": "designer-skirt-with-charm_dc05682a-98ed-4503-8862-f539fd8d9e40",
            "description": "This kids' designer skirt with charm features a beige color and solid pattern. Available in size XL.",
            "featured": true,
            "badge": "Sale",
            "rating": 1.8,
            "tags": [
                "sunglasses",
                "ring",
                "wallet",
                "necklace",
                "earrings"
            ],
            "images": [
                2,
                3,
                1
            ],
            "price": 211.67,
            "totalComments": 83,
            "created_at": "2025-03-08 15:25:05.553739+00",
            "stock": 84,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "0d60be9e-79ec-4bdf-98f8-6745d5ff865e",
            "name": "Under Armour Sweater",
            "slug": "under-armour-sweater_2fab70ee-65b6-423e-ae99-572e8193c9b2",
            "description": "This men under armour sweater features a brown color and solid pattern. Available in size XXL.",
            "featured": true,
            "badge": "New Arrival",
            "rating": 1.1,
            "tags": [
                "jacket",
                "shorts",
                "casual",
                "cotton",
                "pants"
            ],
            "images": [
                5,
                1,
                4,
                2
            ],
            "price": 199.49,
            "totalComments": 12,
            "created_at": "2025-03-08 15:25:02.22273+00",
            "stock": 162,
            "collection_id": 1,
            "featured_image_id": 1
        },
        {
            "id": "0d8fa6f3-aa6a-469e-b39e-90219b1217df",
            "name": "Classic Cotton Polo Shirt",
            "slug": "classic-cotton-polo-shirt_ee0d544f-5d6f-47a5-a58f-fdb9f136dcfa",
            "description": "This men classic cotton polo shirt features a pink color and floral pattern. Available in size XS.",
            "featured": false,
            "badge": "New Arrival",
            "rating": 2.6,
            "tags": [
                "ring",
                "belt"
            ],
            "images": [
                3,
                4
            ],
            "price": 230.51,
            "totalComments": 88,
            "created_at": "2025-03-08 15:25:06.697495+00",
            "stock": 191,
            "collection_id": 4,
            "featured_image_id": 4
        },
        {
            "id": "0db45751-6598-429f-908e-d8992462ac6c",
            "name": "Comfortable Cocktail Black Nylon Shoes",
            "slug": "comfortable-cocktail-black-nylon-shoes_983b0287-7e2e-42b7-b9cf-787f6c4e93fa",
            "description": "This women comfortable cocktail black nylon shoes features a green color and striped pattern. Available in size XS.",
            "featured": false,
            "badge": "Sale",
            "rating": 1.4,
            "tags": [
                "leather",
                "sports",
                "loafers",
                "sneakers"
            ],
            "images": [
                5,
                1
            ],
            "price": 51.33,
            "totalComments": 92,
            "created_at": "2025-03-08 15:25:08.800832+00",
            "stock": 15,
            "collection_id": 5,
            "featured_image_id": 5
        },
        {
            "id": "0df43805-418e-4eb2-97e1-5fb7f80f9c6e",
            "name": "Elegant Beige Chiffon Sports Dress",
            "slug": "elegant-beige-chiffon-sports-dress_8849c338-1364-408d-8d16-b166b818ae9c",
            "description": "This men elegant beige chiffon sports dress features a geometric color and solid pattern. Available in size M.",
            "featured": false,
            "badge": "Sale",
            "rating": 4.8,
            "tags": [
                "blouse",
                "cotton",
                "floral"
            ],
            "images": [
                5,
                1,
                3,
                4
            ],
            "price": 235.55,
            "totalComments": 8,
            "created_at": "2025-03-08 15:25:03.358291+00",
            "stock": 34,
            "collection_id": 2,
            "featured_image_id": 2
        }
    ];

    const order_lines: OrderLine[] = [
        {
            "id": 1,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1001",
            "quantity": 2,
            "price": 112.31,
            "created_at": "2023-10-15 09:30:45+00"
        },
        {
            "id": 10,
            "product_id": "0b1de6c8-6a79-4246-8e21-871468f8fe59",
            "orderId": "ORD-1004",
            "quantity": 1,
            "price": 206.11,
            "created_at": "2023-10-22 08:55:18+00"
        },
        {
            "id": 11,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1005",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2023-10-25 10:20:15+00"
        },
        {
            "id": 12,
            "product_id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "orderId": "ORD-1005",
            "quantity": 2,
            "price": 61.29,
            "created_at": "2023-10-25 10:20:15+00"
        },
        {
            "id": 13,
            "product_id": "0b1ddc76-0a25-4fe4-b276-89016fcbf6ca",
            "orderId": "ORD-1006",
            "quantity": 3,
            "price": 76.17,
            "created_at": "2023-10-29 09:45:30+00"
        },
        {
            "id": 14,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1006",
            "quantity": 1,
            "price": 77.22,
            "created_at": "2023-10-29 09:45:30+00"
        },
        {
            "id": 15,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1007",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2023-11-02 14:50:25+00"
        },
        {
            "id": 16,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1007",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2023-11-02 14:50:25+00"
        },
        {
            "id": 17,
            "product_id": "0b5b918d-6dc3-4951-a3af-535a0294f7f6",
            "orderId": "ORD-1007",
            "quantity": 1,
            "price": 192.37,
            "created_at": "2023-11-02 14:50:25+00"
        },
        {
            "id": 18,
            "product_id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "orderId": "ORD-1008",
            "quantity": 2,
            "price": 94.87,
            "created_at": "2023-11-06 16:30:15+00"
        },
        {
            "id": 19,
            "product_id": "0b1de6c8-6a79-4246-8e21-871468f8fe59",
            "orderId": "ORD-1008",
            "quantity": 1,
            "price": 206.11,
            "created_at": "2023-11-06 16:30:15+00"
        },
        {
            "id": 2,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1001",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2023-10-15 09:30:45+00"
        },
        {
            "id": 20,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1009",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2023-11-10 13:40:35+00"
        },
        {
            "id": 21,
            "product_id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "orderId": "ORD-1009",
            "quantity": 2,
            "price": 61.29,
            "created_at": "2023-11-10 13:40:35+00"
        },
        {
            "id": 22,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1010",
            "quantity": 3,
            "price": 77.22,
            "created_at": "2023-11-14 15:20:10+00"
        },
        {
            "id": 23,
            "product_id": "0b1ddc76-0a25-4fe4-b276-89016fcbf6ca",
            "orderId": "ORD-1010",
            "quantity": 1,
            "price": 76.17,
            "created_at": "2023-11-14 15:20:10+00"
        },
        {
            "id": 24,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1011",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2023-11-18 12:45:30+00"
        },
        {
            "id": 25,
            "product_id": "0b5b918d-6dc3-4951-a3af-535a0294f7f6",
            "orderId": "ORD-1011",
            "quantity": 1,
            "price": 192.37,
            "created_at": "2023-11-18 12:45:30+00"
        },
        {
            "id": 26,
            "product_id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "orderId": "ORD-1012",
            "quantity": 2,
            "price": 94.87,
            "created_at": "2023-11-22 09:25:40+00"
        },
        {
            "id": 27,
            "product_id": "0b1de6c8-6a79-4246-8e21-871468f8fe59",
            "orderId": "ORD-1012",
            "quantity": 1,
            "price": 206.11,
            "created_at": "2023-11-22 09:25:40+00"
        },
        {
            "id": 28,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1013",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2023-11-26 11:15:35+00"
        },
        {
            "id": 29,
            "product_id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "orderId": "ORD-1013",
            "quantity": 2,
            "price": 61.29,
            "created_at": "2023-11-26 11:15:35+00"
        },
        {
            "id": 3,
            "product_id": "0b1ddc76-0a25-4fe4-b276-89016fcbf6ca",
            "orderId": "ORD-1002",
            "quantity": 1,
            "price": 76.17,
            "created_at": "2023-10-16 14:22:10+00"
        },
        {
            "id": 30,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1014",
            "quantity": 3,
            "price": 77.22,
            "created_at": "2023-11-30 09:45:10+00"
        },
        {
            "id": 31,
            "product_id": "0b1ddc76-0a25-4fe4-b276-89016fcbf6ca",
            "orderId": "ORD-1014",
            "quantity": 1,
            "price": 76.17,
            "created_at": "2023-11-30 09:45:10+00"
        },
        {
            "id": 32,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1015",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2023-12-04 10:35:30+00"
        },
        {
            "id": 33,
            "product_id": "0b5b918d-6dc3-4951-a3af-535a0294f7f6",
            "orderId": "ORD-1015",
            "quantity": 1,
            "price": 192.37,
            "created_at": "2023-12-04 10:35:30+00"
        },
        {
            "id": 34,
            "product_id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "orderId": "ORD-1016",
            "quantity": 2,
            "price": 94.87,
            "created_at": "2023-12-08 08:15:40+00"
        },
        {
            "id": 35,
            "product_id": "0b1de6c8-6a79-4246-8e21-871468f8fe59",
            "orderId": "ORD-1016",
            "quantity": 1,
            "price": 206.11,
            "created_at": "2023-12-08 08:15:40+00"
        },
        {
            "id": 36,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1017",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2023-12-12 14:25:50+00"
        },
        {
            "id": 37,
            "product_id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "orderId": "ORD-1017",
            "quantity": 2,
            "price": 61.29,
            "created_at": "2023-12-12 14:25:50+00"
        },
        {
            "id": 38,
            "product_id": "6a210eab-4a0f-43e7-971c-3cbc86c5f688",
            "orderId": "ORD-1017",
            "quantity": 1,
            "price": 58.88,
            "created_at": "2023-12-12 14:25:50+00"
        },
        {
            "id": 39,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1018",
            "quantity": 2,
            "price": 77.22,
            "created_at": "2023-12-16 09:40:20+00"
        },
        {
            "id": 4,
            "product_id": "0b1de6c8-6a79-4246-8e21-871468f8fe59",
            "orderId": "ORD-1002",
            "quantity": 2,
            "price": 206.11,
            "created_at": "2023-10-16 14:22:10+00"
        },
        {
            "id": 40,
            "product_id": "6a22e66d-52f3-4f8c-a0ad-d69a3a70fcd9",
            "orderId": "ORD-1018",
            "quantity": 1,
            "price": 177.71,
            "created_at": "2023-12-16 09:40:20+00"
        },
        {
            "id": 41,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1019",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2023-12-20 11:55:45+00"
        },
        {
            "id": 42,
            "product_id": "6a50943b-ddec-4aaf-b665-ce649e91b805",
            "orderId": "ORD-1019",
            "quantity": 1,
            "price": 160.55,
            "created_at": "2023-12-20 11:55:45+00"
        },
        {
            "id": 43,
            "product_id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "orderId": "ORD-1020",
            "quantity": 1,
            "price": 94.87,
            "created_at": "2023-12-24 16:10:30+00"
        },
        {
            "id": 44,
            "product_id": "6a6e9738-1385-4090-a4f7-719450025763",
            "orderId": "ORD-1020",
            "quantity": 1,
            "price": 187.66,
            "created_at": "2023-12-24 16:10:30+00"
        },
        {
            "id": 45,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1021",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2023-12-28 13:25:15+00"
        },
        {
            "id": 46,
            "product_id": "6a722d5d-9a4f-45f7-b097-b4334e9c855c",
            "orderId": "ORD-1021",
            "quantity": 1,
            "price": 88.53,
            "created_at": "2023-12-28 13:25:15+00"
        },
        {
            "id": 47,
            "product_id": "6ab7c9b9-e43e-490d-83a4-74a8f85140db",
            "orderId": "ORD-1021",
            "quantity": 1,
            "price": 37.76,
            "created_at": "2023-12-28 13:25:15+00"
        },
        {
            "id": 48,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1022",
            "quantity": 2,
            "price": 77.22,
            "created_at": "2024-01-01 10:40:55+00"
        },
        {
            "id": 49,
            "product_id": "69e40293-0a95-4e78-ab77-6792cdc9e21c",
            "orderId": "ORD-1022",
            "quantity": 1,
            "price": 225.8,
            "created_at": "2024-01-01 10:40:55+00"
        },
        {
            "id": 5,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1003",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2023-10-18 11:15:30+00"
        },
        {
            "id": 50,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1023",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2024-01-05 15:55:40+00"
        },
        {
            "id": 51,
            "product_id": "69f33837-f7a1-444d-9d91-998cbdefd37e",
            "orderId": "ORD-1023",
            "quantity": 1,
            "price": 190.85,
            "created_at": "2024-01-05 15:55:40+00"
        },
        {
            "id": 52,
            "product_id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "orderId": "ORD-1024",
            "quantity": 1,
            "price": 94.87,
            "created_at": "2024-01-09 08:10:25+00"
        },
        {
            "id": 53,
            "product_id": "6a0f1583-ca78-48d2-9065-2d4f4017195a",
            "orderId": "ORD-1024",
            "quantity": 1,
            "price": 204.38,
            "created_at": "2024-01-09 08:10:25+00"
        },
        {
            "id": 54,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1025",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2024-01-13 12:25:10+00"
        },
        {
            "id": 55,
            "product_id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "orderId": "ORD-1025",
            "quantity": 1,
            "price": 61.29,
            "created_at": "2024-01-13 12:25:10+00"
        },
        {
            "id": 56,
            "product_id": "0b10eb0c-fda5-4ece-9158-8cea27dc8e8e",
            "orderId": "ORD-1025",
            "quantity": 1,
            "price": 88.68,
            "created_at": "2024-01-13 12:25:10+00"
        },
        {
            "id": 57,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1026",
            "quantity": 1,
            "price": 77.22,
            "created_at": "2024-01-17 17:40:35+00"
        },
        {
            "id": 58,
            "product_id": "0b1ddc76-0a25-4fe4-b276-89016fcbf6ca",
            "orderId": "ORD-1026",
            "quantity": 1,
            "price": 76.17,
            "created_at": "2024-01-17 17:40:35+00"
        },
        {
            "id": 59,
            "product_id": "0be45f24-1c25-4eea-948e-538c633ce443",
            "orderId": "ORD-1026",
            "quantity": 1,
            "price": 239.03,
            "created_at": "2024-01-17 17:40:35+00"
        },
        {
            "id": 6,
            "product_id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "orderId": "ORD-1003",
            "quantity": 3,
            "price": 61.29,
            "created_at": "2023-10-18 11:15:30+00"
        },
        {
            "id": 60,
            "product_id": "01b64bdf-d9fc-45d9-abbc-48f044589064",
            "orderId": "ORD-1027",
            "quantity": 1,
            "price": 158.99,
            "created_at": "2024-01-21 09:55:50+00"
        },
        {
            "id": 61,
            "product_id": "0b5b918d-6dc3-4951-a3af-535a0294f7f6",
            "orderId": "ORD-1027",
            "quantity": 1,
            "price": 192.37,
            "created_at": "2024-01-21 09:55:50+00"
        },
        {
            "id": 62,
            "product_id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "orderId": "ORD-1028",
            "quantity": 1,
            "price": 94.87,
            "created_at": "2024-01-25 14:10:15+00"
        },
        {
            "id": 63,
            "product_id": "0b1de6c8-6a79-4246-8e21-871468f8fe59",
            "orderId": "ORD-1028",
            "quantity": 1,
            "price": 206.11,
            "created_at": "2024-01-25 14:10:15+00"
        },
        {
            "id": 64,
            "product_id": "01563173-755c-4ccc-bdf8-e2f250352d72",
            "orderId": "ORD-1029",
            "quantity": 1,
            "price": 112.31,
            "created_at": "2024-01-29 11:25:40+00"
        },
        {
            "id": 65,
            "product_id": "0b44c59c-183d-4cf1-a1fb-0a6f55c4e5ee",
            "orderId": "ORD-1029",
            "quantity": 1,
            "price": 61.29,
            "created_at": "2024-01-29 11:25:40+00"
        },
        {
            "id": 66,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1030",
            "quantity": 1,
            "price": 77.22,
            "created_at": "2024-02-02 16:40:25+00"
        },
        {
            "id": 67,
            "product_id": "0b1ddc76-0a25-4fe4-b276-89016fcbf6ca",
            "orderId": "ORD-1030",
            "quantity": 1,
            "price": 76.17,
            "created_at": "2024-02-02 16:40:25+00"
        },
        {
            "id": 68,
            "product_id": "01c8ddb1-2270-4b9b-9ded-62d0d8242b36",
            "orderId": "ORD-1030",
            "quantity": 1,
            "price": 57.61,
            "created_at": "2024-02-02 16:40:25+00"
        },
        {
            "id": 7,
            "product_id": "0b5b918d-6dc3-4951-a3af-535a0294f7f6",
            "orderId": "ORD-1003",
            "quantity": 1,
            "price": 192.37,
            "created_at": "2023-10-18 11:15:30+00"
        },
        {
            "id": 8,
            "product_id": "0ae10edd-d358-419a-ab73-fc14a0d55c96",
            "orderId": "ORD-1004",
            "quantity": 2,
            "price": 77.22,
            "created_at": "2023-10-22 08:55:18+00"
        },
        {
            "id": 9,
            "product_id": "0af250c0-a056-43de-aa8f-3cb4df85025e",
            "orderId": "ORD-1004",
            "quantity": 1,
            "price": 94.87,
            "created_at": "2023-10-22 08:55:18+00"
        },
        {
            "id": "i3mo8539fpbt0govwbgodn9h",
            "product_id": "5107ec31-edd9-4626-9081-3cd1934190ed",
            "orderId": "bexh0n0ktvj06daqu5ja6ptd",
            "quantity": 1,
            "price": 153.28,
            "created_at": "2025-03-08 18:04:05.6013+00"
        },
        {
            "id": "s59rrv99gtdrq45lnxm1d92e",
            "product_id": "0015642b-3ac6-4047-ad6b-a690a8297a0c",
            "orderId": "h5c8opibdh0vwtx77wk5dkmv",
            "quantity": 1,
            "price": 186.68,
            "created_at": "2025-03-08 18:02:53.583052+00"
        },
        {
            "id": "ten0bcmxo68mywkln0a4xq0g",
            "product_id": "0015642b-3ac6-4047-ad6b-a690a8297a0c",
            "orderId": "ot7qhilurpb0w6y3zvpsrgfj",
            "quantity": 1,
            "price": 186.68,
            "created_at": "2025-03-08 18:03:01.183012+00"
        },
        {
            "id": "xoa2jz2jq6k1ifuo6i40twfu",
            "product_id": "0015642b-3ac6-4047-ad6b-a690a8297a0c",
            "orderId": "zdfpzuz1pon9lmunuzucqx27",
            "quantity": 1,
            "price": 186.68,
            "created_at": "2025-03-08 18:03:09.213095+00"
        }
    ];

    // Find the current product
    const currentProduct = products.find((p) => p.id === productId);

    // If product not found, provide special promotional discounts
    if (!currentProduct) {
        // Check current month for seasonal promotions
        const currentMonth = new Date().getMonth();
        const currentDate = new Date().getDate();

        // March 8th - International Women's Day
        if (currentMonth === 2 && currentDate === 8) {
            return {
                product_id: productId,
                discountPercentage: 20,
                discountReason: "International Women's Day Special",
                eligibleForDiscount: true,
            };
        }

        // Valentine's Day
        if (currentMonth === 1 && currentDate === 14) {
            return {
                product_id: productId,
                discountPercentage: 15,
                discountReason: "Valentine's Day Special",
                eligibleForDiscount: true,
            };
        }

        // Black Friday (4th Thursday of November)
        if (currentMonth === 10 && isBlackFriday()) {
            return {
                product_id: productId,
                discountPercentage: 30,
                discountReason: "Black Friday Special",
                eligibleForDiscount: true,
            };
        }

        // End of Season Sale (January and July)
        if (currentMonth === 0 || currentMonth === 6) {
            return {
                product_id: productId,
                discountPercentage: 25,
                discountReason: "End of Season Sale",
                eligibleForDiscount: true,
            };
        }

        // New Collection Launch
        return {
            product_id: productId,
            discountPercentage: 10,
            discountReason: "New Collection Launch Promotion",
            eligibleForDiscount: true,
        };
    }

    // Get all order lines for this product
    const productOrders = order_lines.filter(
        (ol) => ol.product_id === productId
    );

    // If no orders exist for this product, apply a new product discount
    if (productOrders.length === 0) {
        // Check if it's a new arrival based on the badge
        if (currentProduct.badge === "New Arrival") {
            return {
                product_id: productId,
                discountPercentage: 15,
                discountReason: "New arrival celebration discount",
                eligibleForDiscount: true,
            };
        }

        // Check if it has high stock and no orders (potential overstock)
        if (currentProduct.stock && currentProduct.stock > 100) {
            return {
                product_id: productId,
                discountPercentage: 18,
                discountReason: "Early bird special for new inventory",
                eligibleForDiscount: true,
            };
        }

        // Check if it's a women's product (based on description)
        if (currentProduct.description?.toLowerCase().includes("women")) {
            const isWomensDay = new Date().getMonth() === 2 && new Date().getDate() === 8;
            if (isWomensDay) {
                return {
                    product_id: productId,
                    discountPercentage: 20,
                    discountReason: "Women's Day Special Offer",
                    eligibleForDiscount: true,
                };
            }

            return {
                product_id: productId,
                discountPercentage: 12,
                discountReason: "Women's Collection Spotlight",
                eligibleForDiscount: true,
            };
        }

        return {
            product_id: productId,
            discountPercentage: 8,
            discountReason: "First purchase incentive",
            eligibleForDiscount: true,
        };
    }

    // Calculate metrics for this product
    const totalOrderCount = productOrders.length;
    const totalQuantitySold = productOrders.reduce(
        (sum, order) => sum + order.quantity,
        0
    );
    const averageOrderSize = totalQuantitySold / totalOrderCount;
    const totalRevenue = productOrders.reduce(
        (sum, order) => sum + order.quantity * order.price,
        0
    );

    // Sort orders by date to analyze trends
    const sortedOrders = [...productOrders].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Get the most recent order date
    const mostRecentOrderDate = new Date(
        sortedOrders[sortedOrders.length - 1].created_at
    );
    const daysSinceLastOrder = Math.floor(
        (new Date().getTime() - mostRecentOrderDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Calculate sales velocity (orders per month)
    const firstOrderDate = new Date(sortedOrders[0].created_at);
    const monthsBetweenFirstAndLastOrder =
        (mostRecentOrderDate.getTime() - firstOrderDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30) || 1; // Avoid division by zero
    const salesVelocity = totalOrderCount / monthsBetweenFirstAndLastOrder;

    // Initialize discount calculation
    let discountPercentage = 0;
    const discountReasons: string[] = [];

    // DISCOUNT LOGIC BASED ON ANALYSIS

    // 1. Stock level analysis
    if (currentProduct.stock) {
        if (currentProduct.stock > 150) {
            discountPercentage += 12;
            discountReasons.push("High inventory reduction");
        } else if (currentProduct.stock > 100) {
            discountPercentage += 8;
            discountReasons.push("Moderate inventory reduction");
        } else if (currentProduct.stock < 20 && currentProduct.stock > 0) {
            // Limited stock might actually warrant a premium in some cases
            // But we'll skip discounts for low stock items
            discountPercentage += 0;
        }
    }

    // 2. Slow-moving inventory discount
    if (daysSinceLastOrder > 60 && totalOrderCount > 0) {
        discountPercentage += 15;
        discountReasons.push("Slow-moving inventory (60+ days without orders)");
    } else if (daysSinceLastOrder > 30 && totalOrderCount > 0) {
        discountPercentage += 8;
        discountReasons.push("Inventory promotion (30+ days without orders)");
    }

    // 3. Rating-based discount (lower ratings might need more incentive)
    if (currentProduct.rating) {
        if (currentProduct.rating < 3.5) {
            discountPercentage += 10;
            discountReasons.push("Rating improvement incentive");
        } else if (currentProduct.rating > 4.5) {
            // Highly rated products might get a smaller discount as they're already popular
            discountPercentage += 3;
            discountReasons.push("Popular highly-rated item promotion");
        }
    }

    // 4. Price tier discounting
    if (currentProduct.price > 150) {
        discountPercentage += 7;
        discountReasons.push("Premium price tier discount");
    } else if (currentProduct.price < 50) {
        discountPercentage += 3;
        discountReasons.push("Budget item promotion");
    }

    // 5. Collection-based discounting
    if (currentProduct.collection_id === 5) {
        discountPercentage += 5;
        discountReasons.push("Collection #5 promotion");
    }

    // 6. Tag-based discounting
    if (currentProduct.tags) {
        if (currentProduct.tags.includes("casual")) {
            discountPercentage += 5;
            discountReasons.push("Casual wear promotion");
        }
        if (currentProduct.tags.includes("boots") && isWinterSeason()) {
            discountPercentage += 8;
            discountReasons.push("Seasonal winter boots promotion");
        }
    }

    // 7. Comment volume incentive
    if (currentProduct.totalComments && currentProduct.totalComments < 10) {
        discountPercentage += 5;
        discountReasons.push("Review generation incentive");
    }

    // 8. Special day promotions
    if (isSpecialShoppingDay()) {
        discountPercentage += 10;
        discountReasons.push(getSpecialDayName() + " Special");
    }

    // 9. Women's product special (if applicable)
    if (currentProduct.description?.toLowerCase().includes("women")) {
        const isWomensDay = new Date().getMonth() === 2 && new Date().getDate() === 8;
        if (isWomensDay) {
            discountPercentage += 15;
            discountReasons.push("Women's Day Celebration");
        }
    }

    // Cap maximum discount
    discountPercentage = Math.min(discountPercentage, 30);

    return {
        product_id: productId,
        discountPercentage: discountPercentage,
        discountReason: discountReasons.join(", "),
        eligibleForDiscount: discountPercentage > 0,
        metrics: {
            totalOrders: totalOrderCount,
            totalQuantity: totalQuantitySold,
            averageOrderSize: averageOrderSize,
            totalRevenue: totalRevenue,
            daysSinceLastOrder: daysSinceLastOrder,
            salesVelocity: salesVelocity,
        },
    };
}

// Helper function to determine if it's winter season
function isWinterSeason(): boolean {
    const month = new Date().getMonth();
    // Northern hemisphere winter: December (11), January (0), February (1)
    return month === 11 || month === 0 || month === 1;
}

// Helper function to check if today is Black Friday
function isBlackFriday(): boolean {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    // If it's not November, it's not Black Friday
    if (month !== 10) return false;

    // Black Friday is the day after the 4th Thursday in November
    // Find the first day of November
    const firstDay = new Date(today.getFullYear(), 10, 1);
    // Find the first Thursday
    const firstThursday = firstDay.getDay() === 4 ? 1 : (5 - firstDay.getDay() + 7) % 7 + 1;
    // The 4th Thursday
    const fourthThursday = firstThursday + 21;
    // Black Friday is the day after
    const blackFriday = fourthThursday + 1;

    return day === blackFriday;
}

// Helper function to check if today is a special shopping day
function isSpecialShoppingDay(): boolean {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    // Valentine's Day
    if (month === 1 && day === 14) return true;

    // International Women's Day
    if (month === 2 && day === 8) return true;

    // Mother's Day (second Sunday in May)
    if (month === 4 && isSecondSunday(today)) return true;

    // Father's Day (third Sunday in June)
    if (month === 5 && isThirdSunday(today)) return true;

    // Black Friday
    if (month === 10 && isBlackFriday()) return true;

    // Cyber Monday (Monday after Black Friday)
    if (month === 10 && isCyberMonday()) return true;

    // Christmas season
    if (month === 11 && day >= 1 && day <= 24) return true;

    // New Year sales
    if (month === 0 && day <= 15) return true;

    return false;
}

// Helper function to get the name of the special day
function getSpecialDayName(): string {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    if (month === 1 && day === 14) return "Valentine's Day";
    if (month === 2 && day === 8) return "International Women's Day";
    if (month === 4 && isSecondSunday(today)) return "Mother's Day";
    if (month === 5 && isThirdSunday(today)) return "Father's Day";
    if (month === 10 && isBlackFriday()) return "Black Friday";
    if (month === 10 && isCyberMonday()) return "Cyber Monday";
    if (month === 11 && day >= 1 && day <= 24) return "Christmas";
    if (month === 0 && day <= 15) return "New Year";

    return "Special Shopping Day";
}

// Helper function to check if a date is the second Sunday of the month
function isSecondSunday(date: Date): boolean {
    return date.getDay() === 0 && Math.floor((date.getDate() - 1) / 7) === 1;
}

// Helper function to check if a date is the third Sunday of the month
function isThirdSunday(date: Date): boolean {
    return date.getDay() === 0 && Math.floor((date.getDate() - 1) / 7) === 2;
}

// Helper function to check if today is Cyber Monday
function isCyberMonday(): boolean {
    const today = new Date();
    // If it's not November, it's not Cyber Monday
    if (today.getMonth() !== 10) return false;

    // Find Black Friday first
    const firstDay = new Date(today.getFullYear(), 10, 1);
    const firstThursday = firstDay.getDay() === 4 ? 1 : (5 - firstDay.getDay() + 7) % 7 + 1;
    const fourthThursday = firstThursday + 21;
    const blackFriday = fourthThursday + 1;

    // Cyber Monday is the Monday after Black Friday
    const cyberMonday = blackFriday + 3;

    return today.getDate() === cyberMonday;
}

// Example usage:
// const discountInfo = calculateDiscount("0015642b-3ac6-4047-ad6b-a690a8297a0c");
// console.log(discountInfo);
export default calculateDiscount