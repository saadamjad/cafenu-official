// Transcribed from "CAFÉ U Menu 07.10.2026.pdf". Prices are in PKR exactly as printed.
// Spelling fixes vs. the printed menu are listed in README.md.

export type MenuItem = { name: string; price: number; description?: string; image?: string };
export type MenuCategory = { id: string; title: string; kind: "food" | "drink"; note?: string; items: MenuItem[] };

export const menu: MenuCategory[] = [
  {
    id: "breakfast",
    title: "Breakfast",
    kind: "food",
    items: [
      {
        name: "Cafe Nu All Day Breakfast",
        price: 1450,
        description:
          "Your favourite breakfast any time of the day: brown bread, sautéed mushrooms, cream cheese, mixed salad with cherry tomato, halloumi, chicken sausages and fluffy eggs.",
        image: "/images/cafe-nu-all-day-breakfast-latte.jpg",
      },
      {
        name: "Scrambled Egg in Croissant",
        price: 1645,
        description:
          "Fluffy, creamy scrambled eggs with cream cheese, a flaky buttery croissant and sautéed mushrooms, served with mixed salad.",
        image: "/images/cafe-nu-scrambled-egg-croissant.jpg",
      },
      {
        name: "Traditional Pakistani Omelette",
        price: 900,
        description:
          "A fluffy omelette with fresh eggs, onions, tomatoes, green chillies and coriander, seasoned with traditional Pakistani spices and served with white bread.",
      },
      {
        name: "Baked Egg with Pepperoni",
        price: 1350,
        description:
          "Perfectly baked eggs topped with savoury pepperoni, zesty chilli oil and a runny yolk, served with brown bread.",
      },
    ],
  },
  {
    id: "starters",
    title: "Starters",
    kind: "food",
    items: [
      { name: "Rustic Beef Bruschetta", price: 1650, description: "Rustic croissant slice topped with tender beef slices, Dijon mayo, parmesan and pickled cucumber." },
      { name: "Rustic Chicken Bruschetta", price: 1550, description: "Rustic croissant slice topped with tender buttery chicken, Dijon mayo, parmesan and pickled cucumber." },
      { name: "Almond Crust Chicken Strips with Fries", price: 1245, description: "Panko-fried, almond-crusted chicken strips with honey mustard mayo, served with French fries." },
      { name: "Potato Wedges", price: 450, description: "Premium potato wedges, lightly seasoned, served with your choice of dip." },
      { name: "Loaded Fries", price: 1100, description: "Crispy fries topped with melted cheese, grilled chicken chunks, in-house sauce, black olives and a jalapeño drizzle." },
      { name: "Plain Fries", price: 500, description: "Crispy golden fries, lightly salted, served with your choice of dip." },
      { name: "Parmesan Truffle Crinkle Fries", price: 995, description: "Crispy crinkle fries topped with freshly grated parmesan, aromatic truffle mayo and a touch of herbs." },
    ],
  },
  {
    id: "soups-salads",
    title: "Soups & Salads",
    kind: "food",
    items: [
      { name: "Cream of Chicken Mushroom Soup", price: 990, description: "A rich, creamy soup with tender chicken and mushrooms, finished with parsley oil. Served with garlic bread." },
      { name: "Tomato Bisque", price: 890, description: "Velvety tomato soup blended with fragrant basil and a touch of cream. Served with garlic bread." },
      { name: "Quinoa with Seasonal Fruit Salad", price: 1290, description: "Wholesome quinoa with fresh seasonal fruit, crisp iceberg and a light mustard vinaigrette." },
      {
        name: "Caesar Salad with Grilled Chicken",
        price: 1350,
        description: "Crisp iceberg, rocket, parmesan, boiled egg, beef bacon, black olives and croutons, topped with grilled chicken and a rich creamy dressing.",
        image: "/images/cafe-nu-caesar-salad.jpg",
      },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    kind: "food",
    items: [
      {
        name: "Creamy Tuscan Chicken Pasta",
        price: 1650,
        description: "Tomato-cream sauce with sun-dried tomato and parmesan, served with grilled chicken and our classic garlic bread.",
        image: "/images/cafe-nu-creamy-tuscan-chicken-pasta.jpg",
      },
      { name: "Fettuccine Alfredo", price: 1450, description: "Fettuccine in a luxurious cream sauce with mushroom and parmesan, served with grilled chicken." },
    ],
  },
  {
    id: "sandwiches",
    title: "Sandwiches",
    kind: "food",
    items: [
      { name: "Grilled Chicken with Focaccia Bread", price: 1250, description: "Warm grilled chicken with crisp lettuce, fresh tomatoes, tangy spicy mayo and a cheese slice. Served with French fries." },
      {
        name: "Cafe Nu Club Sandwich (Brown Bread)",
        price: 1445,
        description: "A triple-decker on toasted brown bread with chicken, beef bacon, fried egg, lettuce, cucumber, tomato, cheese and spicy mustard mayo. Served with fries.",
        image: "/images/cafe-nu-club-sandwich.jpg",
      },
      { name: "The Gourmet Croissant Chicken Sandwich", price: 1545, description: "Grilled chicken, crisp lettuce, fresh tomatoes and creamy house sauce in a buttery, flaky croissant." },
      { name: "Grilled Beef Steak with Multi-Seed Bread", price: 1645, description: "Premium grilled beef steak with green lettuce and chimichurri salsa on multi-seed bread with a savoury sauce and mustard mayo." },
      { name: "Pulled Beef Baguette Melt", price: 1445, description: "Slow-cooked pulled beef layered with cheese and house sauce in a crispy toasted baguette." },
    ],
  },
  {
    id: "burgers",
    title: "Burgers",
    kind: "food",
    items: [
      { name: "Cafe Nu Gourmet Beef Burger", price: 1350, description: "Seasoned premium beef patty on a buttery potato bun with lettuce, tomato, sautéed mushrooms, caramelised onions, cheese and Dijon mayo. Served with potato wedges." },
      { name: "Grilled Chicken Burger", price: 1250, description: "Flame-grilled chicken on a buttery potato bun with lettuce, tomato and a cheese slice. Served with French fries." },
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    kind: "food",
    items: [
      { name: "Alla Regina Pizza", price: 1450, description: "Classic Italian pizza with mozzarella and rich tomato sauce on a perfectly baked crust." },
      { name: "Meat Lover Pizza", price: 1650, description: "Beef pepperoni and chicken sausage with mozzarella, tangy tomato sauce, mushrooms and capsicum." },
      { name: "Beef Pepperoni Pizza", price: 1550, description: "Zesty beef pepperoni and mozzarella on a golden, crispy crust." },
    ],
  },
  {
    id: "chicken-meat",
    title: "Chicken & Meat",
    kind: "food",
    items: [
      { name: "Grilled Chicken with Sambal Oelek Sauce", price: 1650, description: "Grilled chicken fillet over fragrant garlic rice with sautéed vegetables and sambal cream sauce." },
      { name: "Tex-Mex Fried Chicken with Garlic Rice", price: 1550, description: "Crispy fried chicken over buttered garlic rice with creamy Tex-Mex sauce and fresh vegetables." },
      { name: "Beef Medallion Steak", price: 2845, description: "Tender centre-cut beef with buttery mashed potatoes, vegetables and a rich creamy mushroom sauce." },
      { name: "Chimichurri Beef Steak", price: 2645, description: "Seared beef with buttery mashed potatoes and a bright chimichurri of parsley, garlic, olive oil and chilli." },
    ],
  },
  {
    id: "hot-coffee",
    title: "Hot Coffee",
    kind: "drink",
    note: "Add a flavour: hazelnut, vanilla or caramel",
    items: [
      { name: "Cafe Nu Special Espresso", price: 595 },
      { name: "Cappuccino", price: 645 },
      { name: "Hot Americano", price: 645 },
      { name: "Mocha", price: 690 },
      { name: "Spanish Latte", price: 695 },
      { name: "Hot Matcha", price: 745 },
      { name: "Cafe Latte", price: 750 },
      { name: "Doppio", price: 795 },
    ],
  },
  {
    id: "iced-coffee",
    title: "Iced Coffee",
    kind: "drink",
    items: [
      { name: "Caramel Iced Latte", price: 795 },
      { name: "Vanilla Iced Latte", price: 795 },
      { name: "Hazelnut Iced Latte", price: 795 },
      { name: "Mocha Iced Latte", price: 795 },
      { name: "Spanish Iced Latte", price: 795 },
    ],
  },
  {
    id: "iced-matcha",
    title: "Iced Matcha",
    kind: "drink",
    items: [
      { name: "Iced Matcha", price: 895 },
      { name: "Blueberry Iced Matcha", price: 995 },
      { name: "Strawberry Iced Matcha", price: 995 },
      { name: "Mango Iced Matcha", price: 995 },
      { name: "Popcorn Iced Matcha", price: 995 },
    ],
  },
  {
    id: "frappe",
    title: "Frappé",
    kind: "drink",
    items: [
      { name: "Vanilla Frappé", price: 645 },
      { name: "Brownie Frappé", price: 795 },
      { name: "Hazelnut Frappé", price: 795 },
      { name: "Caramel Frappé", price: 795 },
      { name: "Mocha Frappé", price: 795 },
    ],
  },
  {
    id: "tea",
    title: "Iced Tea & Tea",
    kind: "drink",
    items: [
      { name: "Peach Iced Tea", price: 645 },
      { name: "Lemon Iced Tea", price: 595 },
      { name: "Green Tea", price: 345 },
      { name: "Ginger Tea", price: 345 },
      { name: "Honey Lemon Tea", price: 395 },
    ],
  },
  {
    id: "mocktails",
    title: "Mocktails & Margaritas",
    kind: "drink",
    items: [
      { name: "Nu Azure", price: 645 },
      { name: "Nu Passion", price: 645 },
      { name: "Nu Rouge", price: 645 },
      { name: "Mint Margarita", price: 545 },
      { name: "Blue Lagoon Margarita", price: 645 },
      { name: "Passion Fruit Margarita", price: 645 },
    ],
  },
  {
    id: "soft-drinks",
    title: "Soft Drinks",
    kind: "drink",
    items: [
      { name: "Mineral Water (Small)", price: 120 },
      { name: "Mineral Water (Large)", price: 250 },
      { name: "Soft Drink", price: 250 },
    ],
  },
  {
    id: "dessert",
    title: "Dessert",
    kind: "food",
    items: [
      { name: "Chocolate Cookies", price: 245 },
      { name: "Dark Chocolate Brownie", price: 395 },
    ],
  },
];

const allPrices = menu.flatMap((c) => c.items.map((i) => i.price));
export const priceRange = { min: Math.min(...allPrices), max: Math.max(...allPrices) };

export const formatPrice = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
