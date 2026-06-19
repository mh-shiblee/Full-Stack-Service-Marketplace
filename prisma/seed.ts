import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@marketplace.com" },
    update: {},
    create: {
      email: "admin@marketplace.com",
      password: hashedPassword,
      role: "ADMIN",
      userProfile: { create: { name: "Admin User" } },
    },
  });

  // Create Categories
  const categories = [
    { name: "Home Cleaning", slug: "home-cleaning" },
    { name: "Plumbing", slug: "plumbing" },
    { name: "Electrical", slug: "electrical" },
    { name: "Painting", slug: "painting" },
    { name: "Moving & Packing", slug: "moving-packing" },
    { name: "Home Decorating", slug: "home-decorating" },
    { name: "Carpentry", slug: "carpentry" },
    { name: "Gardening", slug: "gardening" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create Vendors
  const vendors = [
    {
      email: "john@services.com",
      password: "vendor123",
      name: "John Smith",
      businessName: "John's Home Services",
      description: "Professional home services with 10+ years experience",
    },
    {
      email: "sarah@clean.com",
      password: "vendor123",
      name: "Sarah Johnson",
      businessName: "Sparkle Clean Co",
      description: "Eco-friendly cleaning solutions for your home",
    },
    {
      email: "mike@movers.com",
      password: "vendor123",
      name: "Mike Brown",
      businessName: "Swift Movers",
      description: "Reliable moving and packing services across the city",
    },
    {
      email: "lisa@decor.com",
      password: "vendor123",
      name: "Lisa Martinez",
      businessName: "Elite Interiors",
      description: "Transform your space with professional interior design",
    },
  ];

  const createdVendors = [];
  for (const v of vendors) {
    const hashedPwd = await bcrypt.hash(v.password, 10);
    const vendor = await prisma.user.upsert({
      where: { email: v.email },
      update: {},
      create: {
        email: v.email,
        password: hashedPwd,
        role: "VENDOR",
        userProfile: { create: { name: v.name } },
        vendorProfile: {
          create: {
            businessName: v.businessName,
            description: v.description,
          },
        },
      },
      include: { vendorProfile: true },
    });
    createdVendors.push(vendor);
  }

  // Get categories
  const allCategories = await prisma.category.findMany();

  // Create Services
  const services = [
    {
      title: "Deep Home Cleaning",
      description:
        "Complete deep cleaning of your entire home including kitchen, bathrooms, and living spaces",
      price: 99.99,
      category: "home-cleaning",
      vendorEmail: "sarah@clean.com",
    },
    {
      title: "Kitchen Pipe Repair",
      description:
        "Expert plumbing repair for kitchen sinks, pipes, and drainage systems",
      price: 149.5,
      category: "plumbing",
      vendorEmail: "john@services.com",
    },
    {
      title: "Electrical Wiring Installation",
      description:
        "Safe and certified electrical wiring for new construction or renovation",
      price: 299.0,
      category: "electrical",
      vendorEmail: "john@services.com",
    },
    {
      title: "Interior Wall Painting",
      description: "Professional interior painting with premium quality paints",
      price: 199.99,
      category: "painting",
      vendorEmail: "john@services.com",
    },
    {
      title: "Full House Moving Service",
      description:
        "Complete moving service with packing, loading, transport, and unpacking",
      price: 499.0,
      category: "moving-packing",
      vendorEmail: "mike@movers.com",
    },
    {
      title: "Office Relocation",
      description: "Professional office moving with minimal downtime",
      price: 899.0,
      category: "moving-packing",
      vendorEmail: "mike@movers.com",
    },
    {
      title: "Living Room Makeover",
      description:
        "Complete interior design and decoration for your living room",
      price: 799.0,
      category: "home-decorating",
      vendorEmail: "lisa@decor.com",
    },
    {
      title: "Modern Kitchen Design",
      description:
        "Transform your kitchen with contemporary design and smart storage",
      price: 1299.0,
      category: "home-decorating",
      vendorEmail: "lisa@decor.com",
    },
    {
      title: "Custom Furniture Making",
      description:
        "Handcrafted wooden furniture tailored to your specifications",
      price: 599.0,
      category: "carpentry",
      vendorEmail: "john@services.com",
    },
    {
      title: "Garden Landscaping",
      description:
        "Beautiful garden design with plants, lawn, and decorative elements",
      price: 399.0,
      category: "gardening",
      vendorEmail: "sarah@clean.com",
    },
    {
      title: "Bathroom Deep Clean",
      description: "Thorough bathroom sanitization and cleaning service",
      price: 59.99,
      category: "home-cleaning",
      vendorEmail: "sarah@clean.com",
    },
    {
      title: "Exterior House Painting",
      description:
        "Weather-resistant exterior painting to protect and beautify your home",
      price: 899.0,
      category: "painting",
      vendorEmail: "john@services.com",
    },
  ];

  for (const service of services) {
    const category = allCategories.find((c) => c.slug === service.category);
    const vendor = createdVendors.find((v) => v.email === service.vendorEmail);

    if (category && vendor?.vendorProfile) {
      await prisma.service.create({
        data: {
          title: service.title,
          description: service.description,
          price: service.price,
          categoryId: category.id,
          vendorId: vendor.vendorProfile.id,
        },
      });
    }
  }

  console.log("✅ Seed completed with vendors and services!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
