const mongoose = require('mongoose');

const MatierSchema = new mongoose.Schema({
  parentId: {
    type: String,
    required: true
  },
  matieres: [
    {
      nom: { type: String, required: true, trim: true },
      coef: { type: Number, required: true, min: 0, max: 20 },
      formul: {
        coef_ds: { type: Number, default: 0 },
        coef_ds1: { type: Number, default: 0 },
        coef_ds2: { type: Number, default: 0 },
        coef_tp: { type: Number, default: 0 },
        coef_examen: { type: Number, default: 0 }
      }
    }
  ]
});

const Matier = mongoose.model('Matier', MatierSchema);
module.exports = Matier;
