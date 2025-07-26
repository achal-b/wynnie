import { PrismaClient } from "@prisma/xxx-client";

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "fruits" },
        update: {},
        create: {
          name: "Fruits",
          slug: "fruits",
          description: "Fresh fruits and vegetables",
        },
      }),
      prisma.category.upsert({
        where: { slug: "dairy" },
        update: {},
        create: {
          name: "Dairy",
          slug: "dairy",
          description: "Milk and dairy products",
        },
      }),
      prisma.category.upsert({
        where: { slug: "bakery" },
        update: {},
        create: {
          name: "Bakery",
          slug: "bakery",
          description: "Fresh bread and baked goods",
        },
      }),
    ]);

    console.log("Created categories:", categories.length);

    // Create sample products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { slug: "organic-bananas" },
        update: {},
        create: {
          name: "Organic Bananas",
          slug: "organic-bananas",
          description:
            "Fresh organic bananas, perfect for smoothies and snacks",
          price: 45,
          originalPrice: 60,
          stock: 100,
          images: ["/Home.png"],
          categoryId: categories[0].id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "whole-wheat-bread" },
        update: {},
        create: {
          name: "Whole Wheat Bread",
          slug: "whole-wheat-bread",
          description: "Freshly baked whole wheat bread, rich in fiber",
          price: 35,
          stock: 50,
          images: ["/Home.png"],
          categoryId: categories[2].id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "fresh-milk" },
        update: {},
        create: {
          name: "Fresh Milk",
          slug: "fresh-milk",
          description: "Pure cow milk, rich in calcium and protein",
          price: 28,
          stock: 200,
          images: ["/Home.png"],
          categoryId: categories[1].id,
        },
      }),
    ]);

    console.log("Created products:", products.length);

    // Create a sample user
    const user = await prisma.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: {
        name: "Demo User",
        email: "demo@example.com",
        emailVerified: true,
      },
    });

    console.log("Created demo user:", user.id);

    // Create sample address
    await prisma.userAddress.upsert({
      where: { id: "demo-address" },
      update: {},
      create: {
        id: "demo-address",
        userId: user.id,
        type: "Home",
        name: "Demo User",
        address: "123 Main Street, Apt 4B",
        city: "Mumbai, MH 400001",
        phone: "+91 98765 43210",
        isDefault: true,
      },
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
