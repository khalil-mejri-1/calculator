import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import img from "../../img/img.jpg";
import {
  Plus,
  Trash2,
  Share2,
  X,
  Target,
  Calculator,
  TrendingUp,
  GraduationCap,
  Search,
  Code,
  Heart,
  Mail,
  Facebook,
  Grid,
  ListOrdered
} from "lucide-react";

import { Link, NavLink } from "react-router-dom";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [modifier, setModifier] = useState(false);
  const [calculdialog, setCalculdialog] = useState(false);
  const [localMatiers, setLocalMatiers] = React.useState([]);
  const [isSending, setIsSending] = useState(false);
  const [nbMatiers, setNbMatiers] = useState(0);
  const [publicMatiersList, setPublicMatiersList] = useState([]); // 👈 حالة جديدة لتخزين المواد العامة

  const [isCodeValid, setIsCodeValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [code2, setcode2] = useState(false);

  const [evaluationType, setEvaluationType] = useState("");
  const [nom, setNom] = useState("");
  const [coef, setCoef] = useState("");
  const [code, setCode] = useState("");
  const [coefValues, setCoefValues] = React.useState({});
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);
  const [message, setMessage] = useState("");
  const [toutDialogVisible, setToutDialogVisible] = useState(false);

  const [formul, setFormul] = useState({
    coef_ds: "",
    coef_ds1: "",
    coef_ds2: "",
    coef_tp: "",
    coef_examen: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [currentMatier, setCurrentMatier] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    coef: 0,
    formul: {
      coef_ds: 0,
      coef_ds1: 0,
      coef_ds2: 0,
      coef_tp: 0,
      coef_examen: 0,
    },
  });

  const [notes, setNotes] = useState({});

  const [matiers, setMatiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // ⭐️⭐️⭐️ حالات جديدة مطلوبة ⭐️⭐️⭐️
  const [isPublic, setIsPublic] = useState(true); // افتراضي Public
  const [collegeName, setCollegeName] = useState("");
  const [shareError, setShareError] = useState(""); // ⬅️ إضافة حالة جديدة لعرض الأخطاء في الديالوج

  // ⭐️⭐️⭐️ نهاية الحالات الجديدة ⭐️⭐️⭐️

  // 🟢 استرجاع القيم المخزنة عند تحميل الصفحة
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || {};
    setNotes(savedNotes);
  }, []);

  const toast = useRef(null);
  const toast2 = useRef(null);
  const toast3 = useRef(null);
  const toast4 = useRef(null);
  const toast5 = useRef(null);

  const showSuccess = () => {
    toast5.current.show({
      severity: "success",
      summary: "Succès",
      detail: "La matière a été modifiée avec succès",
      life: 3000,
    });
  };

  const confirm_delet_id = (id) => {
    confirmDialog({
      message: "Voulez-vous vraiment supprimer la matière ?",
      header: "Confirmation de suppression",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => accept_delet(id),
      reject_delet: reject_delet,
    });
  };

  const accept_delet = (id) => {
    const updatedMatiers = localMatiers.filter((m) => m.id !== id);

    // حفظ القائمة الجديدة
    localStorage.setItem("matiers", JSON.stringify(updatedMatiers));
    localStorage.setItem("nbMatiers", updatedMatiers.length);
    setLocalMatiers(updatedMatiers);

    // Toast نجاح
    toast4.current.show({
      severity: "success",
      summary: "Succès",
      detail: "La matière a été supprimée",
      life: 3000,
    });
  };

  const reject_delet = () => {
    toast4.current.show({
      severity: "warn",
      summary: "Annulé",
      detail: "La suppression a été annulée",
      life: 3000,
    });
  };

  var nb = localStorage.getItem("nbMatiers")|0;

  const accept = () => {
    // حذف كل البيانات المتعلقة بالمواد
    localStorage.removeItem("matiers");

    // إعادة تعيين nbMatiers إلى 0
    localStorage.setItem("nbMatiers", "0");

    // تفريغ الحالة
    setLocalMatiers([]);

    // إظهار Toast مؤقت قبل إعادة التحميل
    toast2.current.show({
      severity: "success",
      summary: "Succès",
      detail: "Toutes les matières ont été supprimées",
      life: 3000,
    });

    // إعادة تحميل الصفحة بعد نصف ثانية
  };

  const reject = () => {
    toast2.current.show({
      severity: "warn",
      summary: "Annulé",
      detail: "La suppression a été annulée",
      life: 3000,
    });
  };
  const confirm2 = () => {
    confirmDialog({
      message: "Voulez-vous vraiment supprimer toutes les matières ?",
      header: "Confirmation de suppression",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Oui", // ← زر الموافقة
      rejectLabel: "Non", // ← زر الرفض
      accept,
      reject,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code2).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Copié",
        detail: "Le code a été copié !",
        life: 3000,
      });
    });
  };

  useEffect(() => {
    setLoading(true);
    const storedMatiers = localStorage.getItem("matiers");
    if (storedMatiers) {
      setMatiers(JSON.parse(storedMatiers));
    } else {
      setMatiers([]); // لو ما فيش بيانات، خليها مصفوفة فارغة
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("matiers")) || [];
    setLocalMatiers(stored);
  }, []);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || {};
    setNotes(savedNotes);
  }, []);





















  if (loading)
    return (
      <>

      </>
    );





  if (error) return <p>Error: {error}</p>;

  const handleSubmit = () => {
    if (!nom.trim()) {
      setErrorMessage("Veuillez saisir le nom de la matière.");
      return;
    }
    if (coef === "" || isNaN(coef) || coef < 0 || coef > 20) {
      setErrorMessage("Veuillez saisir un coefficient valide entre 0 et 20.");
      return;
    }
    if (!evaluationType) {
      setErrorMessage("Veuillez sélectionner un type d'évaluation.");
      return;
    }

    let dataFormul = {
      coef_ds: 0,
      coef_ds1: 0,
      coef_ds2: 0,
      coef_tp: 0,
      coef_examen: 0,
    };

    let requiredCoeffs = [];
    switch (evaluationType) {
      case "ds-tp-exam":
        requiredCoeffs = ["coef_ds", "coef_tp", "coef_examen"];
        break;
      case "ds-exam":
        requiredCoeffs = ["coef_ds", "coef_examen"];
        break;
      case "ds1-ds2":
        requiredCoeffs = ["coef_ds1", "coef_ds2"];
        break;
      case "exam":
        requiredCoeffs = ["coef_examen"];
        break;
    }

    for (let key of requiredCoeffs) {
      if (evaluationType === "exam" && key === "coef_examen") {
        dataFormul.coef_examen = 1;
        continue;
      }
      const val = formul[key];
      if (val === "" || isNaN(Number(val)) || Number(val) < 0) {
        setErrorMessage(`Veuillez saisir un coefficient valide pour ${key}.`);
        return;
      }
      dataFormul[key] = Number(val);
    }

    const sumCoeffs = Object.values(dataFormul).reduce(
      (acc, val) => acc + val,
      0
    );
    if (sumCoeffs !== 1) {
      setErrorMessage(
        `La somme des coefficients doit être exactement 100%. (Actuellement: ${(
          sumCoeffs * 100
        ).toFixed(2)}%)`
      );
      return;
    }

    const newMatier = {
      id: Date.now().toString(),
      nom: nom.trim(),
      coef: Number(coef),
      formul: dataFormul,
    };

    // تحديث state وعرضها مباشرة
    setLocalMatiers((prevMatiers) => {
      const updatedList = [...prevMatiers, newMatier];
      localStorage.setItem("matiers", JSON.stringify(updatedList));
      localStorage.setItem("nbMatiers", updatedList.length);

      // ⚡ تحديث localMatiers هنا

      return updatedList;
    });

    // إظهار Toast نجاح
    toast3.current.show({
      severity: "success",
      summary: "Succès",
      detail: "Matière ajoutée avec succès !",
      life: 3000,
    });
    // إعادة تعيين الحقول بعد الإضافة
    setNom("");
    setCoef("");
    setEvaluationType("");
    setFormul({
      coef_ds: "",
      coef_ds1: "",
      coef_ds2: "",
      coef_tp: "",
      coef_examen: "",
    });
    setErrorMessage("");
    setVisible(false);
  };

  // زر إرسال جميع المواد
  // في ملف Home.js

  // زر إرسال جميع المواد
  const sendAllMatiers = async () => {
    const storedMatiers = JSON.parse(localStorage.getItem("matiers")) || [];

    if (storedMatiers.length === 0) {
      return;
    }

    // 🌟🌟🌟 التعديل: نكتفي فقط بفتح الديالوج وإظهار سبينر 🌟🌟🌟
    setCopied(true); // 👈 افتح الـ dialog
    setcode2(null); // 👈 اجعل الكود فارغًا لإظهار spinner
    setCollegeName(""); // تفريغ اسم الكلية عند فتح الـ dialog
    setIsPublic(true); // تعيين الافتراضي إلى Public عند الفتح
  };
  // في ملف Home.js


  const handleShareAndSend = async () => {
    const storedMatiers = JSON.parse(localStorage.getItem("matiers")) || [];

    // 🛑 التحقق من اسم الكلية في الواجهة الأمامية
    if (isPublic && !collegeName.trim()) {
      setShareError("Veuillez saisir le nom de la faculté pour un partage public.");
      return;
    }

    setcode2(null); // عرض Spinner عند إعادة الإرسال
    setShareError("");
    setIsSending(true);

    const payload = {
      matieres: storedMatiers,
      isPublic: isPublic,
      collegeName: isPublic ? collegeName.trim() : null,
    };

    try {
      const res = await fetch(
        "http://localhost:3000/matiers/multiple",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setcode2(data.parentId); // عرض الكود
        // يمكنك إضافة copyToClipboard(data.parentId); للنسخ التلقائي
      } else {
        // عرض رسالة الخطأ الواردة من السيرفر (مثل validation error)
        setShareError(data.message || "Erreur lors de l'enregistrement des matières.");
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setShareError("Erreur de connexion au serveur.");
    } finally {
      setIsSending(false);
    }
  };

  const footerContent = (
    <div className="flex gap-4 pt-4">
      {/* زر إلغاء (Annuler) */}
      <button
        type="button"
        onClick={() => setVisible(false)}
        // إضافة flex لترتيب الأيقونة والنص
        className="button-annuler-matier flex items-center justify-center space-x-2"
      >
        {/* أيقونة إلغاء/إغلاق (X) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span>Annuler</span>
      </button>

      {/* زر إضافة (Ajouter) */}
      <button
        type="submit"
        onClick={() => handleSubmit()}
        // إضافة flex لترتيب الأيقونة والنص
        className="button-ajouter-matier flex items-center justify-center space-x-2"
      >
        {/* أيقونة إضافة (+) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        <span>Ajouter</span>
      </button>
    </div>
  );

  const handleUpdateMatier = () => {
    if (!currentMatier) return;

    // تحقق من حقل nom و coef
    if (!formData.nom.trim()) {
      setErrorMsg("Le champ 'Nom' ne peut pas être vide.");
      return;
    }

    if (
      formData.coef === "" ||
      formData.coef === null ||
      isNaN(Number(formData.coef))
    ) {
      setErrorMsg("Le champ 'Coef' ne peut pas être vide.");
      return;
    }

    const totalCoef = Object.values(formData.formul).reduce((acc, val) => {
      const numVal = Number(val);
      return acc + (isNaN(numVal) || val === "" ? 0 : numVal);
    }, 0);

    if (totalCoef < 1) {
      setErrorMsg(
        `La somme des coefficients ne doit pas être inférieure à 100%. (Actuellement: ${totalCoef * 100
        }%)`
      );
      return;
    }

    if (totalCoef > 1) {
      setErrorMsg(
        `La somme des coefficients ne doit pas dépasser 100%. (Actuellement: ${totalCoef * 100
        }%)`
      );
      return;
    }

    // ✅ تحقق إذا تغيرت البيانات فعلاً
    const isChanged =
      JSON.stringify(currentMatier) !==
      JSON.stringify({ ...currentMatier, ...formData });

    if (!isChanged) {
      // لا تغيير، فقط اغلق الدايالوج بدون رسالة
      setModifier(false);
      return;
    }

    // إذا المجموع تمام
    setErrorMsg("");

    setLocalMatiers((prev) => {
      const updated = prev.map((m) =>
        m.id === currentMatier.id ? { ...m, ...formData } : m
      );
      localStorage.setItem("matiers", JSON.stringify(updated));
      return updated;
    });

    setModifier(false);
    showSuccess(); // ✅ تظهر فقط إذا كان هناك تغيير
  };

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const inputLabels = {
    coef_ds: "DS",
    coef_ds1: "DS1",
    coef_ds2: "DS2",
    coef_tp: "TP",
    coef_examen: "Examen",
  };

  // دالة لتعديل النوتة المدخلة لأي مادة ونوع تقييم
  // دالة لتعديل النوتة المدخلة لأي مادة ونوع تقييم
  const handleNoteChange = (matierId, key, value) => {
    setNotes((prev) => {
      const updated = {
        ...prev,
        [matierId]: {
          ...prev[matierId],
          [key]: value === "" ? "" : Number(value),
        },
      };

      // 🟢 حفظ في localStorage
      localStorage.setItem("notes", JSON.stringify(updated));

      return updated;
    });
  };

  // دالة لحساب معدل المادة
  const calculateMoyenne = (matier) => {
    const formul = matier.formul || {};
    const matierNotes = notes[matier.id] || {};

    let sum = 0;
    let totalCoef = 0;

    Object.keys(formul).forEach((key) => {
      const coef = formul[key];
      // إذا الخانة فاضية أو ليست رقم، اعتبرها 0
      const note =
        typeof matierNotes[key] === "number" && !isNaN(matierNotes[key])
          ? matierNotes[key]
          : 0;

      if (coef > 0) {
        sum += note * coef;
        totalCoef += coef;
      }
    });

    if (totalCoef === 0) return "--/20";

    const moyenne = sum / totalCoef;
    return moyenne.toFixed(2) + "/20";
  };

  const calculateGeneralAverage = () => {
    if (localMatiers.length === 0) return "--/20";

    let weightedSum = 0;
    let totalCoef = 0;

    localMatiers.forEach((matier) => {
      const val = calculateMoyenne(matier);
      const num = parseFloat(val);
      if (!isNaN(num)) {
        weightedSum += num * (matier.coef || 0);
        totalCoef += matier.coef || 0;
      }
    });

    if (totalCoef === 0) return "--/20";

    const generalAverage = weightedSum / totalCoef;

    return generalAverage.toFixed(2) + "  / 20";
  };

  const totalCoef = localMatiers.reduce(
    (acc, matier) => acc + (matier.coef || 0),
    0
  );
const handleRecherche = async (searchCode) => {
    // 💡 الحل: تحويل القيمة إلى سلسلة نصية باستخدام String() قبل محاولة trim.
    //    هذا يضمن أن الدالة .trim() ستعمل بأمان حتى لو كانت القيمة null أو undefined.
    
    // 1. تحديد الكود المراد البحث به، مع التأكد من أنه سلسلة نصية وغير فارغ.
    const codeToSearch = String(searchCode || code).trim();
    
    // 2. التحقق من أن الكود بعد عملية trim ليس فارغًا
    if (!codeToSearch) {
        setError2("Veuillez saisir le code");
        return;
    }

    setHasSearched(true);
    setLoading(true);
    setError(null);
    setMatiers([]);
    setIsCodeValid(false);

    try {
        const res = await fetch(
            `http://localhost:3000/matiers/byParentId/${codeToSearch}`
        );
        const data = await res.json();

        // 💡 إضافة تحقق إضافي لحالة فشل API
        if (res.status !== 200) {
             throw new Error(data.message || "فشل في جلب البيانات من الخادم.");
        }

        setMatiers(data.matieres || []);

        if (data.matieres && data.matieres.length > 0) {
            setIsCodeValid(true);
            setCalculdialog(true);
        } else {
            setIsCodeValid(false);
            setError2("لم يتم العثور على مواد بهذا الكود."); // رسالة خطأ عند عدم وجود مواد
            setCalculdialog(false);
        }
    } catch (err) {
        setError2(err.message || "حدث خطأ في البحث");
        setCalculdialog(false);
    } finally {
        setLoading(false);
    }
};

  const labelMap = {
    coef_ds: "DS",
    coef_ds1: "DS1",
    coef_ds2: "DS2",
    coef_tp: "TP",
    coef_examen: "Examen",
    // أضف أي مفتاح آخر تحتاجه هنا
  };

  const handleDeleteAll_bd = async () => {
    if (!window.confirm("Are you sure you want to delete all matiers?")) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:3000/matier",
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete all matiers");
      }

      const data = await response.json();
      setMessage(data.message || "All matiers deleted successfully");
    } catch (error) {
      setMessage(error.message || "Error deleting matiers");
    } finally {
      setLoading(false);
    }
  };

  // ⭐️⭐️⭐️ منطق تعطيل زر النسخ ⭐️⭐️⭐️
  // يتم تعطيل الزر إذا كان: (عام AND اسم الكلية فارغ) AND (الكود تم توليده بالفعل)
  const isCopyButtonDisabled = isPublic && !collegeName.trim() && code2;
  // ⭐️⭐️⭐️ نهاية منطق التعطيل ⭐️⭐️⭐️



  const fetchPublicMatiers = async () => {
    setLoading(true);
    try {
      // نستخدم نفس endpoint المستخدم في البحث، ولكن بدون parentId
      const res = await fetch("http://localhost:3000/matiers/public"); // 👈 نقطة النهاية الجديدة
      const data = await res.json();

      if (res.ok) {
        setPublicMatiersList(data); // تخزين المواد العامة
      } else {
        console.error("Erreur de récupération des matières publiques:", data.message);
        setPublicMatiersList([]);
      }
    } catch (error) {
      console.error("Erreur de connexion lors de la récupération des matières publiques:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="body">
      <div className="buttno_delete_all_bd">
        <button onClick={handleDeleteAll_bd} disabled={loading}>
          {loading ? "Deleting..." : "Delete All Matiers"}
        </button>
        {message && <p>{message}</p>}
      </div>

      <div className="bloc_navbar">
        <div className="container">
          <div className="header">
            <div className="icon-box">
              {/* GraduationCap Icon */}
              <i
                className="pi pi-graduation-cap"
                style={{
                  fontSize: "1.6rem",
                  padding: "5px",
                  color: "#fcfcfcff",
                }}
              ></i>
            </div>
            <div>
              <h1 className="title">Calculateur de Moyenne</h1>
              <p className="subtitle">
                Gestion des notes et calcul automatique
              </p>
            </div>
            <br />
            <br />
          </div>
        </div>

        <div className="btn-group">
          <button className="btn btn-blue" onClick={() => setVisible(true)}>
            <Plus className="icon-sm" />
            <span className="span1">Ajouter Matière</span>
            <span className="span2">Ajouter Mat</span>
            <span className="span3">Ajouter</span>
          </button>

          <button
            className={`btn btn-red  ${nb === "0" ? "btn-disabled" : ""}`}
            onClick={confirm2}
          >
            <Trash2 className="icon-sm" />
            <span className="span1">Tout Effacer</span>
            <span className="span2">Tout Eff</span>
            <span className="span3">Effacer</span>
          </button>

          <button
            className={`btn btn-green ${nb === "0" ? "btn-disabled" : ""}`}
            onClick={sendAllMatiers}
          >
            <Share2 className="icon-sm" />
            <span className="span1">Partage Matiers</span>
            <span className="span2">Partage Mat</span>
            <span className="span3">Partage</span>
          </button>

          <button
            className="btn btn-tout"
            onClick={() => {
              setToutDialogVisible(true);
              fetchPublicMatiers(); // 👈 جلب المواد عند فتح الـ Dialog
            }}
          >
            <Grid className="icon-sm" />
            <span className="span1">Tout</span>
                   <span className="span2">Tout</span>
            <span className="span3">Tout</span>
          </button>


        </div>
      </div>

      <div className="stats-container">
        {/* Total Coef */}
        <div className="card purple-blue">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Target className="icon-md" />
                <p className="text-sm">Total des Coefficients</p>
              </div>
              <p className="card-value">{totalCoef}</p>
            </div>
            <div className="card-icon">
              <Calculator className="icon-lg" />
            </div>
          </div>
        </div>

        {/* Moyenne Générale */}
        <div className="card emerald-teal">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp className="icon-md" />
                <p className="text-sm">Moyenne Générale</p>
              </div>
              <p className="card-value"> {calculateGeneralAverage()}</p>
            </div>
            <div className="card-icon">
              <GraduationCap className="icon-lg" />
            </div>
          </div>
        </div>

        {/* Nombre de Matières */}
    <div className="card orange-pink">
  <div className="card-header">
    <div>
      <div className="card-title">
        {/* 👈 تم تغيير الأيقونة هنا */}
        <ListOrdered className="icon-md" /> 
        <p className="text-sm">Nombre de Matières</p>
      </div>
      <p className="card-value">{nb}</p>
    </div>
    <div className="card-icon">
      <Calculator className="icon-lg" />
    </div>
  </div>
</div>
      </div>

      <div className="search-wrapper">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            placeholder="Code Matier"
            className="search-input"

            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (!e.target.value) {
                setHasSearched(false); // مسح الرسالة إذا الحقل فاضي
              }
              if (e.target.value) {
                setError2(null); // Clear the error when input is empty
              }
            }}
          />

       <button className="search-btn" onClick={() => handleRecherche()}>
  Recherche
</button>
          
        </div>
        {hasSearched && !isCodeValid && (
          <>
            <p className="erreur_2">
              {" "}
              Le code est incorrect ou aucun élément à afficher .
            </p>
          </>
        )}
      </div>

      {isCodeValid ? (
        <>
          <Dialog
            header={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
                className="header_dialog_moy"
              >
                <div style={{ display: "flex" }}>
                  <div className="icon-box">
                    {/* GraduationCap Icon */}
                    <i
                      className="pi pi-graduation-cap"
                      style={{
                        fontSize: "1.6rem",
                        padding: "5px",
                        color: "#fcfcfcff",
                      }}
                    ></i>
                  </div>
                  <div>
                    <p className="title2">
                      <span className="titre11">Calculateur de Moyenne</span>

                      <span className="titre22">Calcul Moyenne</span>
                    </p>
                    <p className="subtitle2">
                      <span className="sub1">
                        Gestion des notes et calcul automatique
                      </span>

                      <span className="sub2">Gestion & Calcul des notes</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCalculdialog(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    padding: "0px",
                  }}
                >
                  <X
                    color="black"
                    style={{
                      borderRadius: "50px",
                      backgroundColor: "white",
                      width: "30px",
                      height: "30px",
                      padding: "4px",
                    }}
                    size={20}
                  />
                </button>
              </div>
            }
            visible={calculdialog}
            closable={false}
            className="custom-dialog matierbd"
            contentStyle={{
              height: "calc(100vh - 50px)", // مساحة لمحتوى الـ Dialog مع ترك مكان للهيدر
              overflowY: "auto",
            }}
            onHide={() => window.location.reload()}
            draggable={false} // <- هذا يمنع تحريك الـ dialog
          >
            <div className="bloc_all_red_dialog">
              {/* Moyenne générale */}
              <div className="bloc_res_dialog">
                <p className="mg_dialog">
                  <i
                    className="pi pi-calculator"
                    style={{
                      fontSize: "1.2rem",
                      color: "#caa81c",
                      position: "relative",
                      top: "2px",
                    }}
                  ></i>{" "}
                  Moyenne Générale
                </p>
                <p
                  className="moy_dialog"
                  style={{
                    fontSize: "33px",
                    fontWeight: "bold",
                    marginRight: "20px",
                    marginBottom: "40px",
                  }}
                >
                  {(() => {
                    let totalGeneral = 0;
                    let totalCoefGeneral = 0;

                    matiers.forEach((m, i) => {
                      const values = coefValues[i] || {};
                      let total = 0;
                      let totalCoef = 0;

                      Object.entries(m.formul).forEach(([key, coef]) => {
                        if (coef > 0) {
                          const note = values[key] ? Number(values[key]) : 0;
                          total += note * coef;
                          totalCoef += coef;
                        }
                      });

                      if (totalCoef > 0) {
                        totalGeneral += (total / totalCoef) * m.coef;
                        totalCoefGeneral += m.coef;
                      }
                    });

                    const moyGen =
                      totalCoefGeneral === 0
                        ? NaN
                        : totalGeneral / totalCoefGeneral;

                    if (isNaN(moyGen)) return "00/20";
                    return moyGen.toFixed(2) + "/20";
                  })()}
                </p>
              </div>

              {hasSearched && matiers.length > 0 && (
                <div className="bloc_matiers_bd">
                  {matiers.map((m, i) => (
                    <div key={i} className="card_matier_dialog" >
                      <span onClick={() => {
        const parentId = group.parentId; // حفظ الكود
        setCode(parentId); // تحديث حقل البحث
        setToutDialogVisible(false); // إغلاق الدايالوج
        handleRecherche(parentId); // استدعاء فوري مع تمرير الكود
    }}>
<div className="nav_matier">
                        <p className="titre_mat">
                          <i
                            className="pi pi-book"
                            style={{
                              fontSize: "1.5rem",
                              color: "#60a5fa",
                              position: "relative",
                              top: "5px",
                              marginRight: "5px",
                            }}
                          ></i>{" "}
                          <strong>{m.nom}</strong>
                        </p>
                        <p className="coef">Coef :{m.coef}</p>
                      </div>


                      </span>
                      

                      {/* هنا نعرض input لكل مفتاح قيمته > 0 */}
                      <div className="bloc_input">
                        {Object.entries(m.formul)
                          .filter(([key, value]) => value > 0)
                          .map(([key, value]) => (
                            <div key={key} style={{ marginBottom: "8px" }}>
                              <label
                                htmlFor={`${key}-${i}`}
                                style={{
                                  display: "block",
                                  marginBottom: "4px",
                                }}
                                className="label_dialog_bd"
                              >
                                {labelMap[key] || key} ({value * 100} %)
                              </label>
                              <input
                                onWheel={(e) => e.target.blur()}
                                id={`${key}-${i}`}
                                type="number"
                                placeholder="Ex"
                                value={
                                  coefValues[i]?.[key] === undefined ||
                                    coefValues[i]?.[key] === ""
                                    ? ""
                                    : coefValues[i][key]
                                }
                                onChange={(e) => {
                                  let val = e.target.value;
                                  if (val === "" || isNaN(val)) {
                                    setCoefValues((prev) => ({
                                      ...prev,
                                      [i]: {
                                        ...prev[i],
                                        [key]: "",
                                      },
                                    }));
                                    return;
                                  }
                                  val = Number(val);
                                  if (val < 0) val = 0;
                                  if (val > 20) val = 20;
                                  setCoefValues((prev) => ({
                                    ...prev,
                                    [i]: {
                                      ...prev[i],
                                      [key]: val,
                                    },
                                  }));
                                }}
                              />
                            </div>
                          ))}
                      </div>

                      {/* Moyenne matière */}
                      {(() => {
                        const values = coefValues[i] || {};
                        let total = 0;
                        let totalCoef = 0;

                        Object.entries(m.formul).forEach(([key, coef]) => {
                          if (coef > 0) {
                            const note =
                              values[key] === "" || values[key] === undefined
                                ? 0
                                : Number(values[key]);
                            total += note * coef;
                            totalCoef += coef;
                          }
                        });

                        const num = totalCoef === 0 ? NaN : total / totalCoef;
                        const color = isNaN(num)
                          ? "#e36e66"
                          : num < 8
                            ? "#e36e66"
                            : num <= 11.99
                              ? "#5b9cf1"
                              : "#48d77d";

                        return (
                          <div className="bloc_moyenne_mat">
                            <p className="moy_mat">
                              <i
                                className="pi pi-calculator"
                                style={{
                                  fontSize: "1.0rem",
                                  color: "#caa81c",
                                  position: "relative",
                                  top: "2px",
                                  marginRight: "7px",
                                }}
                              ></i>{" "}
                              Moyenne:
                            </p>
                            <p
                              className="res_mou_mat"
                              style={{
                                color,
                                marginLeft: "auto",
                                float: "right",
                                fontSize: "20px",
                                position: "relative",
                                top: "2px",
                                fontWeight: "700",
                              }}
                            >
                              {isNaN(num)
                                ? "00/20"
                                : num.toFixed(2) + "/20"}
                            </p>
                          </div>
                        );
                      })()}

                      <p className="type_mat">
                        Type :{" "}
                        {Object.entries(m.formul)
                          .filter(([key, value]) => value > 0)
                          .map(([key, value], index, arr) => (
                            <span key={key} style={{ marginLeft: "5px" }}>
                              {labelMap[key] || key} ({value})
                              {/* أضف + إلا إذا كان العنصر الأخير */}
                              {index < arr.length - 1 ? " + " : ""}
                            </span>
                          ))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Dialog>

          {localMatiers.length === 0 ? (
            <div className="bloc_vide_mat">
              <i className="pi pi-plus" style={{ fontSize: "2rem" }}></i>
              <h1 className="acune_titre">Aucune matière ajoutée </h1>
              <h2 className="acune_titre2">
                Commencez par ajouter vos matières pour calculer votre moyenne
              </h2>
            </div>
          ) : (
            //matier de localstorega
            <div>
              <div className="bloc_matiers">
                {localMatiers.map((matier) => {
                  const formul = matier.formul || {};
                  // جلب المفاتيح التي قيمتها أكبر من 0
                  const activeInputs = Object.keys(formul).filter(
                    (key) => formul[key] > 0
                  );

                  return (
                    <div key={matier._id} className="card_matier">
                      <div className="button_remove_id">
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",

                            marginRight: "20px",
                            marginLeft: "-35px",
                          }}
                        >
                          <i
                            className="pi pi-trash button_rem"
                            style={{ fontSize: "1rem" }}
                            onClick={() => confirm_delet_id(matier.id)}
                          ></i>
                          <i
                            className="pi pi-file-edit button_rem"
                            style={{
                              fontSize: "1rem",
                              color: "white",
                              marginLeft: "10px",
                            }}
                            onClick={() => {
                              setCurrentMatier(matier); // تعيين المادة التي تريد تعديلها
                              setFormData({
                                nom: matier.nom,
                                coef: matier.coef,
                                formul: { ...matier.formul },
                              });
                              setModifier(true);
                            }}
                          ></i>
                        </div>
                      </div>
                      <div className="nav_matier">
                        <p className="titre_mat">
                          <i
                            className="pi pi-book"
                            style={{
                              fontSize: "1.5rem",
                              color: "#60a5fa",
                              position: "relative",
                              top: "5px",
                              marginRight: "5px",
                            }}
                          ></i>{" "}
                          <strong>{capitalizeFirstLetter(matier.nom)}</strong>
                        </p>
                        <p className="coef">Coef : {matier.coef}</p>
                      </div>

                      <div className="bloc_input">
                        {activeInputs.map((key) => (
                          <div key={key}>
                            <label className="label">
                              {inputLabels[key] || key} (
                              {matier.formul[key] * 100 + " %"})
                            </label>
                            <br />
                            <input
                              type="number"
                              placeholder={`Note ${inputLabels[key] || key
                                }`}
                              min={0}
                              max={20}
                              step={0.01}
                              value={notes[matier._id]?.[key] ?? ""}
                              onWheel={(e) => e.target.blur()} // لمنع تغيير القيمة بالماوس
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "") {
                                  handleNoteChange(matier._id, key, "");
                                  return;
                                }
                                const numVal = Number(val);
                                if (numVal >= 0 && numVal <= 20) {
                                  handleNoteChange(matier._id, key, numVal);
                                }
                                // لو خارج النطاق لا يتم التحديث (تجاهل)
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <br />

                      <div className="bloc_moyenne_mat">
                        <p className="moy_mat">
                          <i
                            className="pi pi-calculator"
                            style={{
                              fontSize: "1.0rem",
                              color: "#caa81c",
                              position: "relative",
                              top: "2px",
                              marginRight: "7px",
                            }}
                          ></i>{" "}
                          Moyenne:
                        </p>
                        <p
                          className="res_mou_mat"
                          style={{
                            color: (() => {
                              // نحاول الحصول على الرقم فقط
                              const val = calculateMoyenne(matier);
                              const num = parseFloat(val);
                              if (isNaN(num)) return "white"; // لون افتراضي لو ما في قيمة

                              if (num < 7.99) return "#e36e66";
                              else if (num >= 8 && num <= 11.99)
                                return "#5b9cf1";
                              else return "#48d77d";
                            })(),
                          }}
                        >
                          {calculateMoyenne(matier)}
                        </p>
                      </div>

                      <p className="type_mat">
                        Type :{" "}
                        {activeInputs
                          .map(
                            (key) =>
                              `${inputLabels[key] || key}(${matier.formul[key]
                              })`
                          )
                          .join(" + ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {localMatiers.length === 0 ? (
            <div className="bloc_vide_mat">
              <i className="pi pi-plus" style={{ fontSize: "2rem" }}></i>
              <h1 className="acune_titre">Aucune matière ajoutée </h1>
              <h2 className="acune_titre2">
                Commencez par ajouter vos matières pour calculer votre moyenne
              </h2>
            </div>
          ) : (
            //matier de localstorega
            <div>
              <div className="bloc_matiers">
                {localMatiers.map((matier, i) => {
                  const formul = matier.formul || {};
                  const activeInputs = Object.keys(formul).filter(
                    (key) => formul[key] > 0
                  );

                  return (
                    <div key={matier._id} className="card_matier">
                      <div className="button_remove_id">
                        <div
                          style={{
                            display: "flex",
                            gap: "19px",
                            marginTop: "10px",
                            marginLeft: "-31px",
                          }}
                        >
                          <i
                            className="pi pi-trash button_rem"
                            style={{ fontSize: "1rem" }}
                            onClick={() => confirm_delet_id(matier.id)}
                          ></i>

                          <i
                            className="pi pi-file-edit button_apdate"
                            onClick={() => {
                              setCurrentMatier(matier); // تعيين المادة التي تريد تعديلها
                              setFormData({
                                nom: matier.nom,
                                coef: matier.coef,
                                formul: { ...matier.formul },
                              });
                              setModifier(true);
                            }}
                          ></i>
                        </div>
                      </div>
                      <div className="nav_matier">
                        <p className="titre_mat">
                          <i
                            className="pi pi-book"
                            style={{
                              fontSize: "1.5rem",
                              color: "#60a5fa",
                              position: "relative",
                              top: "5px",
                              marginRight: "5px",
                            }}
                          ></i>{" "}
                          <strong>{capitalizeFirstLetter(matier.nom)}</strong>
                        </p>
                        <p className="coef">Coef : {matier.coef}</p>
                      </div>

                      <div className="bloc_input">
                        {activeInputs.map((key) => (
                          <div key={key}>
                            <label className="label">
                              {inputLabels[key] || key} (
                              {matier.formul[key] * 100 + " %"})
                            </label>
                            <br />
                            <input
                              type="number"
                              placeholder="Ex :10"
                              min={0}
                              max={20}
                              step={0.01}
                              value={notes[matier.id]?.[key] ?? ""}
                              onChange={(e) => {
                                let val = e.target.value;
                                // Convert to number for validation
                                let num = Number(val);

                                // If empty, allow (so user can delete)
                                if (val === "") {
                                  handleNoteChange(matier.id, key, "");
                                  return;
                                }

                                // If num is a valid number and in range, update
                                if (
                                  !isNaN(num) &&
                                  num >= 0 &&
                                  num <= 20
                                ) {
                                  handleNoteChange(matier.id, key, val);
                                }
                              }}
                              onWheel={(e) => e.target.blur()}
                            />
                          </div>
                        ))}
                      </div>

                      <br />

                      <div className="bloc_moyenne_mat">
                        <p className="moy_mat">
                          <i
                            className="pi pi-calculator"
                            style={{
                              fontSize: "1.0rem",
                              color: "#caa81c",
                              position: "relative",
                              top: "2px",
                              marginRight: "7px",
                            }}
                          ></i>{" "}
                          Moyenne:
                        </p>
                        <p
                          className="res_mou_mat"
                          style={{
                            color: (() => {
                              // نحاول الحصول على الرقم فقط
                              const val = calculateMoyenne(matier);
                              const num = parseFloat(val);
                              if (isNaN(num)) return "white"; // لون افتراضي لو ما في قيمة

                              if (num < 7.99) return "#e36e66";
                              else if (num >= 8 && num <= 11.99)
                                return "#5b9cf1";
                              else return "#48d77d";
                            })(),
                          }}
                        >
                          {calculateMoyenne(matier)}
                        </p>
                      </div>

                      <p className="type_mat">
                        Type :{" "}
                        {activeInputs
                          .map(
                            (key) =>
                              `${inputLabels[key] || key}(${matier.formul[key]
                              })`
                          )
                          .join(" + ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
      <Toast ref={toast3} />

      <Dialog
        maskClassName="custom-blur"
        header={
          <div
            className="herder_dialog"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
 marginBottom: "30px",
              paddingBottom: "10px",
                            borderBottom: "1px solid #EEEEEE"

            }}
          >
            <span style={{ fontSize: "25px" }}>Ajouter une matière</span>
            <button
              onClick={() => setVisible(false)}
              style={{
                 background: "none", // جعل الخلفية شفافة
                border: "1px solid #CCCCCC", // إضافة حدود خفيفة
                borderRadius: "50%",
                cursor: "pointer",
                padding: "6px",
                transition: "all 0.2s",
              }}
            >
              <X className="buttonx"  size={18} />
            </button>
          </div>
        }
        visible={visible}
        closable={false}
        className="custom-dialog"
        style={{ width: "500px", margin: "12px" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
        draggable={false} // <- هذا يمنع تحريك الـ dialog
      >
        <div className="main_dialog">
          {/* Nom */}
          <label>Nom de la matière</label>
          <br />
          <input
            type="text"
            onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
            placeholder="Ex : Algorithme"
            className="input_dialog"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />{" "}
          <br />
          <br />
          {/* Coefficient */}
          <label>Coefficient</label>
          <br />
          <input
            onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
            type="number"
            placeholder="Ex : 1"
            className="input_dialog"
            value={coef}
            min={0}
            max={20}
            onChange={(e) => {
              let val = e.target.value;

              // إذا الإدخال فارغ نسمح (عشان المستخدم يقدر يمسح ويكتب جديد)
              if (val === "") {
                setCoef(val);
                return;
              }

              // تحويل إلى رقم
              val = Number(val);

              // تصحيح القيمة لتكون بين 0 و 20
              if (val < 0) val = 0;
              if (val > 20) val = 20;

              setCoef(val);
            }}
          />
          <br />
          <br />
          {/* Type d'évaluation */}
          <label>Type d'évaluation</label>
          <br />
          <select
            className="select_dialog"
            value={evaluationType}
            onChange={(e) => setEvaluationType(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            <option value="ds-tp-exam">DS + TP + Examen</option>
            <option value="ds-exam">DS + Examen</option>
            <option value="ds1-ds2">DS 1 + DS 2</option>
            <option value="exam">Examen</option>
          </select>
          {/* Conditional extra inputs */}
          {/* ds-tp-exam */}
          {evaluationType === "ds-tp-exam" && (
            <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
              <div style={{ flex: 1 }}>
                <label>Coef DS</label>
                <input
                  onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
                  type="number"
                  placeholder="Ex : 0.15"
                  className="input_dialog"
                  value={formul.coef_ds}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setFormul({ ...formul, coef_ds: "" });
                      return;
                    }
                    val = Number(val);
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    setFormul({ ...formul, coef_ds: val });
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Coef TP</label>
                <input
                  onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
                  type="number"
                  placeholder="Ex : 0.15"
                  className="input_dialog"
                  value={formul.coef_tp}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setFormul({ ...formul, coef_tp: "" });
                      return;
                    }
                    val = Number(val);
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    setFormul({ ...formul, coef_tp: val });
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="coef1">Coef Examen</label>
                <label className="coef2">Coef Ex</label>
                <input
                  onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
                  type="number"
                  placeholder="Ex : 0.7"
                  className="input_dialog"
                  value={formul.coef_examen}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setFormul({ ...formul, coef_examen: "" });
                      return;
                    }
                    val = Number(val);
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    setFormul({ ...formul, coef_examen: val });
                  }}
                />
              </div>
            </div>
          )}
          {evaluationType === "ds-exam" && (
            <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
              <div style={{ flex: 1 }}>
                <label>Coef DS</label>
                <input
                  onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
                  type="number"
                  placeholder="Ex : 0.3"
                  className="input_dialog"
                  value={formul.coef_ds}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setFormul({ ...formul, coef_ds: "" });
                      return;
                    }
                    val = Number(val);
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    setFormul({ ...formul, coef_ds: val });
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Coef Examen</label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
                  placeholder="Ex : 0.7"
                  className="input_dialog"
                  value={formul.coef_examen}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setFormul({ ...formul, coef_examen: "" });
                      return;
                    }
                    val = Number(val);
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    setFormul({ ...formul, coef_examen: val });
                  }}
                />
              </div>
            </div>
          )}
          {evaluationType === "ds1-ds2" && (
            <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
              <div style={{ flex: 1 }}>
                <label>Coef DS 1</label>
                <input
                  onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
                  type="number"
                  placeholder="Ex : 0.5"
                  className="input_dialog"
                  value={formul.coef_ds1}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setFormul({ ...formul, coef_ds1: "" });
                      return;
                    }
                    val = Number(val);
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    setFormul({ ...formul, coef_ds1: val });
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Coef DS 2</label>
                <input
                  onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
                  type="number"
                  placeholder="Ex : 0.5"
                  className="input_dialog"
                  value={formul.coef_ds2}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setFormul({ ...formul, coef_ds2: "" });
                      return;
                    }
                    val = Number(val);
                    if (val < 0) val = 0;
                    if (val > 10) val = 10;
                    setFormul({ ...formul, coef_ds2: val });
                  }}
                />
              </div>
            </div>
          )}
          {evaluationType === "exam" && (
            <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
              {/* No coefficients needed, assumed 100% already */}
              <p >Coefficient de l'examen est de 100%.</p>
            </div>
          )}
          {errorMessage && (
            <div
              style={{ color: "#f74f4fff", marginTop: 10, fontSize: "15px" }}
            >
              {errorMessage}
            </div>
          )}
        </div>
      </Dialog>
      <Toast ref={toast5} />


      <Dialog
        maskClassName="custom-blur"
        header={
          <div
            className="herder_dialog"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",

              marginBottom: "50px",
            }}
          >
            <span>Modifer une matière</span>
            <button
              onClick={() => setModifier(false)}
              style={{
                background: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              <X color="black" size={20} />
            </button>
          </div>
        }
        visible={modifier}
        closable={false}
        className="custom-dialog"
        style={{ width: "500px", margin: "10px" }}
        onHide={() => setModifier(false)}
        draggable={false} // <- هذا يمنع تحريك الـ dialog
      >
        <div className="main_dialog">
          <label>Nom</label>
          <input
            onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
            type="text"
            value={formData.nom}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nom: e.target.value }))
            }
          />
          <br />
          <br />
          {/* حقل coef (معامل المادة) */}
          <label>Coef</label>
          <input
            onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
            type="number"
            min={0}
            max={20}
            value={formData.coef}
            onChange={(e) => {
              let val = e.target.value;

              // السماح للحقل أن يكون فارغ (للسماح بالمسح)
              if (val === "") {
                setFormData((prev) => ({ ...prev, coef: val }));
                return;
              }

              val = Number(val);

              if (val < 0) val = 0;
              if (val > 20) val = 20;

              setFormData((prev) => ({ ...prev, coef: val }));
            }}
          />
          <br />
          <br />
          {/* حقول formul مع إخفاء القيم التي تساوي 0 */}
          {Object.keys(formData.formul).map((key) =>
            formData.formul[key] !== 0 ? (
              <div key={key}>
                <label>{key}</label>
                <input
                  onWheel={(e) => e.target.blur()}
                  type="number"
                  min={0}
                  max={10}
                  value={formData.formul[key]}
                  onChange={(e) => {
                    let val = e.target.value;

                    // السماح بحقل فارغ أثناء التحرير
                    if (val === "") {
                      setFormData((prev) => ({
                        ...prev,
                        formul: { ...prev.formul, [key]: val },
                      }));
                      return;
                    }

                    // تحقق إذا القيمة هي رقم صالح (أو تبدأ بـ 0.)
                    const regex = /^(\d+)?\.?\d*$/; // يسمح بكتابة أرقام وعشرية جزئية مثل "0.", "1.2"
                    if (!regex.test(val)) {
                      // تجاهل القيم الغير صالحة مثل الحروف أو رموز غير رقمية
                      return;
                    }

                    // تحويل إلى رقم فقط إذا القيمة صالحة بالكامل
                    const numVal = Number(val);

                    // حد أدنى وأقصى فقط عند القيمة رقم
                    if (!isNaN(numVal)) {
                      if (numVal < 0.1) {
                        // لا تغير القيمة مباشرة حتى لا تقطع كتابة المستخدم
                        // فقط قم بضبطها إذا تجاوزت الحد عند blur أو زر حفظ
                      }
                      if (numVal > 10) {
                        return; // أو قم بالتعديل هنا
                      }
                    }

                    setFormData((prev) => ({
                      ...prev,
                      formul: { ...prev.formul, [key]: val },
                    }));
                  }}
                  onBlur={(e) => {
                    let val = e.target.value;

                    if (val === "") {
                      // لا تغيّر شيء، خليه فارغ لحين الحفظ
                      setFormData((prev) => ({
                        ...prev,
                        formul: { ...prev.formul, [key]: "" },
                      }));
                      return;
                    }

                    let numVal = Number(val);

                    if (isNaN(numVal)) {
                      // إذا القيمة غير صالحة، عدلها أو تجاهل
                      return;
                    }

                    if (numVal < 0.1) {
                      numVal = 0.1;
                    } else if (numVal > 10) {
                      numVal = 10;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      formul: { ...prev.formul, [key]: numVal },
                    }));
                  }}
                />
                <br />
                <br />
              </div>
            ) : null
          )}
          {errorMsg && <div className="erreur">{errorMsg}</div>}

          <button
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                       text-white px-6 py-3 rounded-lg font-medium transition-all duration-200
                       shadow-lg hover:shadow-xl transform hover:scale-105 button_ajout_dialog_ajout_mat"
            onClick={handleUpdateMatier}
          >
            Valider
          </button>
        </div>
      </Dialog>

      <Toast ref={toast} />

      {/* ⭐️⭐️⭐️ Dialog المشاركة المعدل ⭐️⭐️⭐️ */}
      <Dialog
        maskClassName="custom-blur"
        draggable={false}
        visible={copied}
        closable={false}
        style={{ width: "550px", margin: "12px", borderRadius: "12px" }}

        onHide={() => setCopied(false)}

        header={
          <div
            className="herder_dialog"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // تقليل الهامش لتقليل المساحة البيضاء
              marginBottom: "30px",
              paddingBottom: "10px",
              // إضافة خط فاصل خفيف أسفل العنوان
              borderBottom: "1px solid #EEEEEE"
            }}
          >
            <span className="titre_code " style={{ fontSize: "25px", fontWeight: "600" }}>
              Code du groupe de matières
            </span>
            <button
              onClick={() => setCopied(false)}
              style={{
                background: "none", // جعل الخلفية شفافة
                border: "1px solid #CCCCCC", // إضافة حدود خفيفة
                borderRadius: "50%",
                cursor: "pointer",
                padding: "6px",
                transition: "all 0.2s",
              }}
            >
              {/* استخدام أيقونة X بلون رمادي داكن */}
              <X className="buttonx" size={18} />
            </button>
          </div>
        }

        className="custom-dialog_confirm"
        icon="pi pi-copy"
        footer={
          <div className="flex flex-col gap-2 pt-4">

            {/* 1. زر الإرسال / إعادة الإرسال */}
            <button
              disabled={isSending || code2}
              onClick={handleShareAndSend}
              className={`button_generer_code flex items-center justify-center space-x-2`} // <-- أضفنا فئات flex لترتيب المحتوى
              style={{ border: "none" }}
            >
              {isSending ? (
                <>
                  {/* أيقونة للتحميل أو الإرسال (مثلاً أيقونة Spin/Loading) */}
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Envoi en cours...</span>
                </>
              ) : code2 ? (
                <>
                  {/* أيقونة "Code Généré" (أيقونة صح/Valid) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Code Généré</span>
                </>
              ) : (
                <>
                  {/* أيقونة "Générer et partager le code" (أيقونة قلم/توليد) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
                  </svg>
                  <span>Générer et partager le code</span>
                </>
              )}
            </button>

            {/* 2. زر النسخ (يظهر فقط إذا كان code2 موجوداً) */}
            {code2 && (
              <button
                onClick={() => {
                  copyToClipboard(code2);
                  // setCopied(false); 
                }}
                className={`flex items-center justify-center space-x-2 
                bg-green-600 hover:bg-green-700 
                text-white px-6 py-3 rounded-lg font-medium 
                transition-all duration-200 shadow-lg hover:shadow-xl 
                transform hover:scale-105`}
                style={{ border: "none" }}
              >
                {/* إضافة أيقونة النسخ (SVG) هنا */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h4a2 2 0 00-2-2H5z" />
                </svg>

                <span>Copier le code</span>
              </button>
            )}
          </div>
        }
      >
        <div
          style={{
            fontSize: "1.1rem",
            color: "#2c3e50",
            fontWeight: "500",
            padding: "15px 10px",
          }}
        >
          {/* ⭐️ زر التبديل بين Public و Private ⭐️ */}
        <div className="toggle-switch-container">
    {/* زر Public */}
    <button
        onClick={() => {
            setIsPublic(true);
            setcode2(null); // إعادة التعيين لإعادة الإرسال
            setShareError("");
        }}
        className={`toggle-switch-btn ${isPublic ? 'is-public-active' : 'is-inactive'}`}
    >
        Public
    </button>

    {/* زر Private */}
    <button
        onClick={() => {
            setIsPublic(false);
            setCollegeName(""); // إخفاء وإفراغ اسم الكلية عند الاختيار Private
            setcode2(null); // إعادة التعيين لإعادة الإرسال
            setShareError("");
        }}
        className={`toggle-switch-btn ${!isPublic ? 'is-private-active' : 'is-inactive'}`}
    >
        Private
    </button>
</div>
          {/* ⭐️ مدخل اسم الكلية (يظهر فقط إذا كان Public) ⭐️ */}
          {isPublic && (
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="collegeNameInput"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Nom de la faculté :
              </label>
              <input
                id="collegeNameInput"
                type="text"
                value={collegeName}
                onChange={(e) => {
                  setCollegeName(e.target.value);
                  setcode2(null); // إذا تغير النص، يجب إعادة الإرسال لتوليد كود جديد
                  setShareError("");
                }}
                placeholder="FSTSBZ - Faculté des Sciences et Techniques de Sidi Bouzid."
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: `2px solid ${collegeName.trim() && !shareError ? "" : "#e36e66" // لون أحمر إذا كان الخطأ موجود أو فارغ
                    }`,

                }}
              />
            </div>
          )}

          {/* 🛑 عرض رسالة الخطأ 🛑 */}
          {shareError && (
            <p style={{ color: "#e36e66", fontSize: "1rem", marginBottom: "15px", marginTop: "-10px" }}>
              <i className="pi pi-exclamation-triangle" style={{ marginRight: "5px" }}></i>
              {shareError}
            </p>
          )}

          {/* عرض الكود أو Spinner */}
          {code2 ? (
            <>
              <span className="titre_code_doc" >Le code du document est </span>
              <span
                style={{
                  fontFamily: "Courier New, monospace",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "#007acc",
                  backgroundColor: "#e6f2ff",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  letterSpacing: "2px",
                  userSelect: "text",
                  cursor: "pointer",
                }}
                onClick={() => copyToClipboard(code2)}

              >
                {code2}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-2">

              {isSending && <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>}
            </div>
          )}
        </div>
      </Dialog>
      {/* ⭐️⭐️⭐️ نهاية Dialog المشاركة المعدل ⭐️⭐️⭐️ */}

      <Toast ref={toast2} />
      <ConfirmDialog
        maskClassName="custom-blur"
        draggable={false} // ← هذا يمنع تحريك البوكس
        className="custom-confirm-dialog_supprimmer"
      />

      <Toast ref={toast4} />

      <br />
      <br />

      <Link
        to="https://www.facebook.com/khalil.mejri.628751"
        className="bloc_nav_link"
      >
        <div className="footer_body">
          <div
            className={`
      transition-all duration-300 ease-in-out transform hover:scale-105
      bg-gradient-to-r from-gray-900 to-black text-white
      shadow-2xl hover:shadow-3xl rounded-2xl p-6 border border-gray-700
      backdrop-blur-sm
   
    `}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <Code className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium opacity-90 mb-1 text-white/80">
                  Développé et conçu par
                </p>
                <h3 className="text-lg font-bold text-white">Khalil Mejri</h3>
              </div>

              <Heart className="w-5 h-5 text-red-300 animate-pulse" />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <a
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20
                     rounded-lg transition-all duration-200 text-sm font-medium text-white
                     hover:scale-105 backdrop-blur-sm border border-white/20"
              >
                <Facebook className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            </div>
          </div>
        </div>
      </Link>















      <Dialog
        maskClassName="custom-blur"
        header={
          <div
            className="herder_dialog"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // تقليل الهامش لتقليل المساحة البيضاء
              marginBottom: "30px",
              paddingBottom: "10px",
              // إضافة خط فاصل خفيف أسفل العنوان
              borderBottom: "1px solid #EEEEEE"
            }}
          >
            <span style={{ fontSize: "25px", fontWeight: "600" }}>
              Toutes les matières publiques
            </span>
            <button
              onClick={() => setToutDialogVisible(false)}
              style={{
                background: "none", // جعل الخلفية شفافة
                border: "1px solid #CCCCCC", // إضافة حدود خفيفة
                borderRadius: "50%",
                cursor: "pointer",
                padding: "6px",
                transition: "all 0.2s",
              }}
            >
              {/* استخدام أيقونة X بلون رمادي داكن */}
              <X className="buttonx" size={18} />
            </button>
          </div>
        }
        visible={toutDialogVisible}
        closable={false}
        className="custom-dialog"
        // يمكن استخدام 90% من العرض على الشاشات الكبيرة
        style={{ width: "100%", margin: "12px", height: "calc(100vh - 50px)", borderRadius: "12px" }}
        contentStyle={{ overflowY: "auto", padding: "0 20px" }}
        onHide={() => {
          if (!toutDialogVisible) return;
          setToutDialogVisible(false);
        }}
        draggable={false}
      >
        <br />
        <div className="main_dialog">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
              <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}></i>
              Chargement des matières publiques...
            </div>
          ) : publicMatiersList.length > 0 ? (
            <div className="bloc_matiers_dilaog" >
              {publicMatiersList.map((group) => (
                <div
                  key={group.parentId}
                  className="card_matier"
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #f0f0f0",
                    transition: "all 0.3s ease-in-out"
                  }}
                >
                  {/* 1. قسم العنوان (الكلية و Code Parent) - يبقى كما هو */}
                  <div style={{ marginBottom: "15px", paddingBottom: "15px", borderBottom: "1px dashed #E0E0E0" }}>
                    <p style={{ color: "#8F44EE", fontWeight: "bold", fontSize: "1.3rem", display: "flex", alignItems: "center" }}>
                      <GraduationCap style={{ marginRight: "10px" }} className="w-6 h-6 inline-block" />
                      {group.collegeName || "Non Spécifié"}
                    </p>
                    <p className="titre_card_matier_public" style={{ fontSize: "0.85rem", marginTop: "8px", color: "#999999" }}>
                      Code Parent: <strong style={{ color: "#7c7c7cff" }}>{group.parentId}</strong>
                    </p>
                  </div>

                  {/* 2. التعديل: قسم عرض المواد مع تحديد ارتفاع أقصى وخاصية التمرير */}
                  <div
                    style={{
                      maxHeight: '250px', // 👈 تحديد أقصى ارتفاع (يمكنك تعديل القيمة)
                      overflowY: 'auto',   // 👈 تفعيل التمرير العمودي
                      paddingRight: '10px' // 👈 إضافة مساحة لـ شريط التمرير
                    }}
                  >
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {group.matieres.map((matier, index) => (
                        <div
                        className="bloc_matier_dialog_all"
                          key={index}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            borderLeft: "4px solid #BBDEFB"
                          }}
                        >
                          <p style={{ fontWeight: "600", marginBottom: "5px"}}>
                            <i className="pi pi-book" style={{ marginRight: "8px", color: "#42A5F5" }}></i>
                            {matier.nom}
                            <span style={{ float: 'right', fontWeight: 'normal' }}>
                              Coef: <strong style={{ color: '#4CAF50' }}>{matier.coef}</strong>
                            </span>
                          </p>
                          <p style={{ fontSize: "0.85rem", marginLeft: "25px", color: "#8a8a8aff" }}>
                            {Object.entries(matier.formul)
                              .filter(([_, value]) => value > 0)
                              .map(([key, value]) => `${labelMap[key] || key} (${value})`)
                              .join(" + ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* ------------------------------------------- */}




                  <button
                    onClick={() => {

                      const parentId = group.parentId; // حفظ الكود

                      setCode(parentId); // تحديث حقل البحث

                      setToutDialogVisible(false); // إغلاق الدايالوج



                   
                      handleRecherche(parentId); // 👈 استدعاء فوري مع تمرير الكود

                    }}
                    style={{
                      marginTop: "20px",
                      padding: "10px 15px",
                      background: "linear-gradient(to right, #64B5F6, #9575CD)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      fontWeight: "bold",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 10px rgba(100, 181, 246, 0.4)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 15px rgba(100, 181, 246, 0.6)"}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 10px rgba(100, 181, 246, 0.4)"}
                  >
                    <Search className="w-5 h-5 inline-block mr-2" />
                    Utilisez ce code
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#777", textAlign: "center", padding: "40px" }}>
              <i className="pi pi-info-circle" style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}></i>
              Aucune matière publique n'a été trouvée.
            </div>
          )}
        </div>
      </Dialog>


    </div>
  );
};

export default Home;