const mongoose = require('mongoose');

const MatierSchema = new mongoose.Schema({
    parentId: {
        type: String,
        required: true
    },
    // ⭐️ حقول إضافية للمشاركة ⭐️
    isPublic: {
        type: Boolean,
        default: true,
        required: true
    },
    // ✅ الحقل الجديد: status
    status: {
        type: Boolean,
        default: false // القيمة الافتراضية المطلوبة
    },
    collegeName: {
        type: String,
        // يكون مطلوبًا فقط إذا كانت isPublic = true
        required: function() {
            return this.isPublic === true;
        },
        trim: true,
        maxlength: 100
    },
    // ملاحظة: تم حذف تكرار حقل collegeName
    // ⭐️ نهاية الحقول الإضافية ⭐️
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