import prisma from "../utils/prisma.js";

export const createAnimal = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("FILES:", req.files);

    if (!req.user?.id) {
      return res.status(401).json({ error: "No user" });
    }

    const data = req.body;

    const files = req.files || [];

    const images = [];
    let video = null;

    files.forEach((file) => {
      const url = `${process.env.BASE_URL}/uploads/${file.filename}`;

      if (file.mimetype.startsWith("image/")) {
        images.push(url);
      }

      if (file.mimetype.startsWith("video/")) {
        video = url;
      }
    });

    const animal = await prisma.animal.create({
      data: {
        title: data.title,
        category: data.category || "animals",

        type: data.type || null,
        breed: data.breed || null,
        age: data.age ? Number(data.age) : null,
        weight: data.weight ? Number(data.weight) : null,

        price: data.price ? Number(data.price) : null,
        location: data.location,
        description: data.description || "",
        phone: data.phone,

        // 🔥 CORREGIDO
        images: images,
        video: video,

        userId: req.user.id,
      },
    });

    res.json(animal);

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ error: "Error creating animal" });
  }
};

// -------------------------

export const getAnimals = async (req, res) => {
  try {
    const { type, location, minWeight, category } = req.query;

    const now = new Date();

    await prisma.animal.updateMany({
      where: {
        featuredUntil: { lt: now },
        isFeatured: true,
      },
      data: { isFeatured: false },
    });

    const where = {};

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
    console.error("ERROR getAnimals:", error);
    res.status(500).json({ error: "Error fetching listings" });
  }
};

// -------------------------

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

// -------------------------

export const getStats = async (req, res) => {
  try {
    const total = await prisma.animal.count();

    res.json({ totalAnimals: total });
  } catch (error) {
    res.status(500).json({ error: "Error fetching stats" });
  }
};

// -------------------------

export const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await prisma.animal.findUnique({
      where: { id },
    });

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

// -------------------------

export const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    const animal = await prisma.animal.findUnique({
      where: { id },
    });

    if (animal.userId !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const updated = await prisma.animal.update({
      where: { id },
      data: {
        ...req.body,
        weight: req.body.weight ? Number(req.body.weight) : null,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error updating animal" });
  }
};

// -------------------------

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

// -------------------------

export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const now = new Date();
    const featuredUntil = new Date();
    featuredUntil.setDate(now.getDate() + 7);

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

// -------------------------

export const markAsSold = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const animal = await prisma.animal.findUnique({
      where: { id },
    });

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