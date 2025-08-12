const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Matier = require('./models/matier');

// Middleware to parse JSON
app.use(express.json());

app.use(express.json()); // 👈 this is important for JSON parsing

const cors = require('cors');

// أو لو تريد تحديد إعدادات CORS:
app.use(cors({
  origin: 'http://localhost:3000', // أو دومين الفرونت إند
  methods: ['GET', 'POST', 'OPTIONS'], // السماح بالطرق المطلوبة
  allowedHeaders: ['Content-Type', 'Authorization'], // السماح بالرؤوس المطلوبة
}));
const connectDB = async () => {
  try {
    const uri =
      "mongodb+srv://calculfac6:iPyBFRLx1KXAphrO@cluster0.h4w57kq.mongodb.net/";
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB();
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// POST route to add new Matier
// Route لإضافة عدة matières دفعة واحدة

function generateRandomId() {
  return Math.floor(10000 + Math.random() * 90000).toString(); // رقم من 5 أرقام
}


app.post('/matiers/multiple', async (req, res) => {
  try {
    const { matieres } = req.body;

    if (!Array.isArray(matieres) || matieres.length === 0) {
      return res.status(400).json({ message: 'Matières manquantes' });
    }

    // إنشاء رقم فريد
    let uniqueId;
    let exists = true;

    while (exists) {
      const randomId = generateRandomId();
      const existingDoc = await Matier.findOne({ parentId: randomId });
      if (!existingDoc) {
        uniqueId = randomId;
        exists = false;
      }
    }

    // حفظ في وثيقة واحدة
    const newDoc = await Matier.create({
      parentId: uniqueId,
      matieres
    });

    res.status(201).json({
      message: 'Matières enregistrées dans un seul document avec succès',
      parentId: uniqueId, // نرجع الرقم للمستخدم
      data: newDoc
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


app.get('/matiers/byParentId/:parentId', async (req, res) => {
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
app.get('/matier', async (req, res) => {
  try {
    const matiers = await Matier.find(); // fetch all documents
    res.status(200).json(matiers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// DELETE route to delete all Matiers
app.delete('/matier', async (req, res) => {
  try {
    await Matier.deleteMany({}); // يحذف كل المستندات في مجموعة Matier
    res.status(200).json({ message: 'All matiers deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE a Matier by ID
app.delete('/matier/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Matier.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Matier not found' });
    }

    res.status(200).json({ message: 'Matier deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// تحديث مادة حسب ID
app.put("/matier/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // البيانات التي سيتم تحديثها (تأتي من الـ body)
    const updateData = req.body;

    // تحديث المادة
    const updatedMatier = await Matier.findByIdAndUpdate(id, updateData, {
      new: true, // إرجاع البيانات بعد التحديث
      runValidators: true, // التحقق من القيم
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
