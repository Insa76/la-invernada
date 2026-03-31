import prisma from "../utils/prisma.js";
import cloudinary from "../utils/cloudinary.js";

export const createAnimal = async (req, res) => {
  try {
    const files = req.files;

    let imageUrls = [];

    // 📸 subir imágenes
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "ruralmarket" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

        imageUrls.push(result.secure_url);
      }
    }

    // 🧠 preparar datos
    const data = {
      ...req.body,
      age: Number(req.body.age || 0),
      weight: Number(req.body.weight),
      price: req.body.price ? Number(req.body.price) : null,
      images: imageUrls,
    };

    // 🔥 ACA VA LO QUE ME PREGUNTASTE
    const animal = await prisma.animal.create({
      data: {
        ...data,
        userId: req.user.id, // 👈 usuario logueado
      },
    });

    res.json(animal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating animal" });
  }
};

export const getAnimals = async (req, res) => {
  try {
    const { type, location, minWeight, category } = req.query;

    const now = new Date();

    // 🔥 limpiar destacados vencidos
    await prisma.animal.updateMany({
      where: {
        featuredUntil: { lt: now },
        isFeatured: true,
      },
      data: { isFeatured: false },
    });

    const where = {};

    // 🔹 filtros seguros
    if (category) where.category = category;
    if (type) where.type = type;
    if (location) where.location = location;
    if (minWeight) where.weight = { gte: Number(minWeight) };

    const animals = await prisma.animal.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.json(animals ?? []);
  } catch (error) {
    console.error("ERROR getAnimals:", error); // 🔥 IMPORTANTE
    res.status(500).json({ error: "Error fetching listings" });
  }
};

export const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await prisma.animal.findUnique({
      where: { id },
    });

    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: "Error fetching animal" });
  }
};

export const getStats = async (req, res) => {
  try {
    const total = await prisma.animal.count();

    res.json({
      totalAnimals: total,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching stats" });
  }
};

export const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await prisma.animal.findUnique({
      where: { id },
    });

    // 🔒 validar dueño
    if (animal.userId !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await prisma.animal.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting animal" });
  }
};

export const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await prisma.animal.findUnique({
      where: { id },
    });

    // 🔒 validar dueño
    if (animal.userId !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        ...req.body,
        weight: Number(req.body.weight),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error updating animal" });
  }
};

export const getMyAnimals = async (req, res) => {
  try {
    const animals = await prisma.animal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Error fetching my animals" });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const now = new Date();

    const featuredUntil = new Date();
    featuredUntil.setDate(now.getDate() + 7); // 7 días

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        isFeatured: true,
        featuredUntil,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error setting featured" });
  }
};

export const markAsSold = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const animal = await prisma.animal.findUnique({
      where: { id },
    });

    // 🔒 validar dueño
    if (animal.userId !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        isSold: true,
        soldAt: new Date(),
        soldPrice: price ? Number(price) : null,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error marking as sold" });
  }
};