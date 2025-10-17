const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { nanoid } = require("nanoid"); // ✨ 1. استيراد nanoid
const Matier = require("./models/matier");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✨ 2. إزالة السطر المكرر

// Database Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("❌ MONGODB_URI not found in environment variables");
      process.exit(1);
    }
    // ✨ 3. إزالة الخيارات القديمة
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB();

// --- Routes ---

app.get("/", (req, res) => {
  res.send("Hello from Express 10/17/2025!");
});

// POST route to add multiple Matiers
// Before (in the original code):
// const { matieres } = req.body;

// Corrected version:
app.post("/matiers/multiple", async (req, res) => {
  try {
    const { matieres, isPublic, collegeName } = req.body; // لا يلزم إضافة 'status' هنا

    if (!Array.isArray(matieres) || matieres.length === 0) {
      return res.status(400).json({ message: "Matières manquantes" });
    }

    const uniqueId = nanoid(5);

    const newDoc = await Matier.create({
      parentId: uniqueId,
      matieres,
      isPublic,
      // ملاحظة: لن تحتاج لتمرير status هنا، Mongoose ستقوم بتعيينه إلى false تلقائيًا.
      collegeName: isPublic ? collegeName : undefined,
    });

    res.status(201).json({
      message: "Matières enregistrées avec succès",
      parentId: uniqueId,
      data: newDoc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Erreur serveur" });
  }
});


// Assuming 'app' is your Express application instance and 'Matier' is your Mongoose model

app.get("/matiers/multiple", async (req, res) => {
  try {
    // Find all documents in the Matier collection
    const allMatierGroups = await Matier.find({}); 

    // Check if any groups were found
    if (!allMatierGroups || allMatierGroups.length === 0) {
      // Respond with 404 Not Found if no groups exist
      return res.status(404).json({ message: "Aucun groupe de matières trouvé" });
    }

    // Respond with 200 OK and the retrieved data
    res.status(200).json({
      message: "Groupes de matières récupérés avec succès",
      count: allMatierGroups.length,
      data: allMatierGroups,
    });
  } catch (error) {
    // Log the error and send a 500 Server Error response
    console.error(error);
    res.status(500).json({ message: error.message || "Erreur serveur lors de la récupération des groupes de matières" });
  }
});

app.get('/matiers/public', async (req, res) => {
    try {
        // البحث عن جميع المستندات حيث isPublic تساوي true و status تساوي true
        const publicMatierGroups = await Matier.find({
            isPublic: true, // الشرط الأصلي
            status: true     // ✅ إضافة شرط status = true
        }).select('parentId collegeName matieres');

        // إذا لم يتم العثور على أي مجموعات
        if (!publicMatierGroups || publicMatierGroups.length === 0) {
            return res.status(200).json([]);
        }

        // إرجاع القائمة
        return res.status(200).json(publicMatierGroups);

    } catch (error) {
        console.error("Erreur lors de la récupération des matières publiques:", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// GET Matiers by parentId
app.get("/matiers/byParentId/:parentId", async (req, res) => {
  try {
    const { parentId } = req.params;
    const doc = await Matier.findOne({ parentId });
    if (!doc) {
      return res.status(404).json({ message: "المواد غير موجودة لهذا الكود" });
    }
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
});

// GET all Matiers
app.get("/matier", async (req, res) => {
  try {
    const matiers = await Matier.find();
    res.status(200).json(matiers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// ✅ ROUTE: Toggle status
app.put("/matiers/toggle-status/:id", async (req, res) => {
  try {
    const matierId = req.params.id;

    const matier = await Matier.findById(matierId, "status isPublic");

    if (!matier) {
      return res.status(404).json({ message: "Groupe de matière non trouvé." });
    }

    if (!matier.isPublic) {
      return res.status(403).json({
        message: "Seuls les groupes publics peuvent avoir leur statut basculé.",
      });
    }

    const newStatus = !matier.status;

    const updatedMatier = await Matier.findByIdAndUpdate(
      matierId,
      { $set: { status: newStatus } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedMatier,
      message: `Le statut a été mis à jour à: ${newStatus ? "Actif" : "Inactif"}`,
    });
  } catch (error) {
    console.error("Erreur lors de la bascule du statut:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "ID de groupe invalide." });
    }
    res.status(500).json({ message: "Erreur serveur." });
  }
});



// DELETE a Matier by ID
app.delete("/matier/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Matier.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Matier not found" });
    }
    res.status(200).json({ message: "Matier deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE a Matier by ID
app.put("/matier/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedMatier = await Matier.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedMatier) {
      return res.status(404).json({ message: "Matier not found" });
    }
    res.json({
      message: "Matier updated successfully",
      matier: updatedMatier,
    });
  } catch (error) {
    console.error("Error updating Matier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DANGEROUS: DELETE all Matiers (Consider protecting or removing this in production)
app.delete("/matier", async (req, res) => {
  try {
    await Matier.deleteMany({});
    res.status(200).json({ message: "All matiers deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Server Listening Logic
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});



// Export for Vercel
module.exports = app;
