import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState,useRef  } from "react";
import { X } from "lucide-react"; // or any icon from your library
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [modifier, setModifier] = useState(false);
  const [calculdialog, setCalculdialog] = useState(false);
  const [localMatiers, setLocalMatiers] = React.useState([]);

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
  const [message, setMessage] = useState('');

  const [formul, setFormul] = useState({
    coef_ds: "",
    coef_ds1: "",
    coef_ds2: "",
    coef_tp: "",
    coef_examen: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const [currentMatier, setCurrentMatier] = useState(null); // المادة المفتوحة للتعديل
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
  const [hasSearched, setHasSearched] = useState(false); // جديد







    const toast = useRef(null);

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }


  const copyToClipboard = () => {
    navigator.clipboard.writeText(code2).then(() => {
      toast.current.show({ severity: "success", summary: "Copié", detail: "Le code a été copié !" });
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

  if (loading)
    return (
      <>
        <div className="bloc_titre">
          <div>
            <i
              className="pi pi-graduation-cap"
              style={{
                fontSize: "1.8rem",
                color: "#60a5fa",
                marginRight: "15px",
                marginTop: "18px",
              }}
            ></i>
          </div>
          <div className="bloc_titre_nav">
            <h1>Calculateur de Moyenne</h1>

            <h3>Gestion des notes et calcul automatique</h3>
          </div>

          <div className="bloc_res">
            <p>
              {" "}
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
            <p>--/20</p>
          </div>
        </div>

        <i
          className="pi pi-spin pi-spinner"
          style={{
            fontSize: "2rem",
            color: "white",
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        ></i>
      </>
    );
  if (error) return <p>Error: {error}</p>;

  const handleDeleteAll = () => {
    if (!window.confirm("Are you sure you want to delete all matiers?")) return;

    // حذف كل البيانات من localStorage
    localStorage.removeItem("matiers");

    // تفريغ الحالة
    setMatiers([]);
  };

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
    if (sumCoeffs > 1) {
      setErrorMessage(
        `La somme des coefficients ne doit pas dépasser 100%. (Actuellement: ${(
          sumCoeffs * 100
        ).toFixed(2)}%)`
      );
      return;
    }
    if (sumCoeffs < 1) {
      setErrorMessage(
        `La somme des coefficients ne doit pas être inférieure à 100%. (Actuellement: ${(
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

    // حفظ في localStorage
setMatiers((prevMatiers) => {
  const updatedList = [...prevMatiers, newMatier];
  localStorage.setItem("matiers", JSON.stringify(updatedList));
  return updatedList;
});

// إعادة تحميل الصفحة
window.location.reload();



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
  const sendAllMatiers = async () => {
    const storedMatiers = JSON.parse(localStorage.getItem("matiers")) || [];

    if (storedMatiers.length === 0) {
      alert("لا توجد مواد في التخزين المحلي لإرسالها.");
      return;
    }

    const payload = {
      // لا ترسل _id لأن السيرفر يولده تلقائياً
      matieres: storedMatiers,
    };

    try {
      const res = await fetch("http://localhost:3000/matiers/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setcode2(data.parentId)
        console.log(data);

        // لو تريد تمسح localStorage بعد الإرسال
        // localStorage.removeItem("matiers");
      } else {
        alert(data.message || "حدث خطأ أثناء الإرسال");
      }
    } catch (error) {
      console.error(error);
      alert("خطأ في الاتصال بالسيرفر");
    }
  };

const handleDelete = (id) => {

  const updatedMatiers = matiers.filter((m) => m.id !== id);
  setMatiers(updatedMatiers);
  localStorage.setItem("matiers", JSON.stringify(updatedMatiers));
  window.location.reload();

};


  const footerContent = (
    <div>
      <Button
        label="Annuler"
        icon="pi pi-times-circle"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Ajouter"
        icon="pi pi-plus-circle"
        onClick={() => handleSubmit()} // لا تغلق هنا
        autoFocus
      />
    </div>
  );

const handleUpdateMatier = () => {
  if (!currentMatier) return;

  // تحقق من حقل nom و coef
  if (!formData.nom.trim()) {
    setErrorMsg("Le champ 'Nom' ne peut pas être vide.");
    return;
  }

  if (formData.coef === "" || formData.coef === null || isNaN(Number(formData.coef))) {
    setErrorMsg("Le champ 'Coef' ne peut pas être vide.");
    return;
  }

  const totalCoef = Object.values(formData.formul).reduce((acc, val) => {
    const numVal = Number(val);
    return acc + (isNaN(numVal) || val === "" ? 0 : numVal);
  }, 0);

  if (totalCoef < 1) {
    setErrorMsg(
      `La somme des coefficients ne doit pas être inférieure à 100%. (Actuellement: ${totalCoef * 100}%)`
    );
    return;
  }

  if (totalCoef > 1) {
    setErrorMsg(
      `La somme des coefficients ne doit pas dépasser 100%. (Actuellement: ${totalCoef * 100}%)`
    );
    return;
  }

  // إذا المجموع تمام
  setErrorMsg("");

  setMatiers((prev) => {
    const updated = prev.map((m) =>
      m.id === currentMatier.id ? { ...m, ...formData } : m
    );
    localStorage.setItem("matiers", JSON.stringify(updated));
    window.location.reload();

    return updated;
  });

  setModifier(false);
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
    coef_examen: "Examen", // هنا الاسم الكامل وليس "Ex."
  };

  // دالة لتعديل النوتة المدخلة لأي مادة ونوع تقييم
  const handleNoteChange = (matierId, key, value) => {
    setNotes((prev) => ({
      ...prev,
      [matierId]: {
        ...prev[matierId],
        [key]: value === "" ? "" : Number(value),
      },
    }));
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
    if (matiers.length === 0) return "--/20";

    let weightedSum = 0;
    let totalCoef = 0;

    matiers.forEach((matier) => {
      const val = calculateMoyenne(matier);
      const num = parseFloat(val);
      if (!isNaN(num)) {
        weightedSum += num * (matier.coef || 0);
        totalCoef += matier.coef || 0;
      }
    });

    if (totalCoef === 0) return "--/20";

    const generalAverage = weightedSum / totalCoef;

    return generalAverage.toFixed(2) + "  / 20";
  };

  const totalCoef = matiers.reduce(
    (acc, matier) => acc + (matier.coef || 0),
    0
  );

  const handleRecherche = async () => {
    if (!code.trim()) {
    setError2("Veuillez saisir le code  ")
      return;
    }

    setHasSearched(true);
    setLoading(true);
    setError(null);
    setMatiers([]);
    setIsCodeValid(false);

    try {
      const res = await fetch(
        `http://localhost:3000/matiers/byParentId/${code.trim()}`
      );
      const data = await res.json();

      setMatiers(data.matieres || []);

      if (data.matieres && data.matieres.length > 0) {
        setIsCodeValid(true);
        setCalculdialog(true); // ✅ فتح الـ Dialog إذا الكود صحيح
      } else {
        setCalculdialog(false); // إذا مفيش مواد، غلق الـ Dialog
      }
    } catch (err) {
      setError(err.message || "حدث خطأ في البحث");
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
    if (!window.confirm('Are you sure you want to delete all matiers?')) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/matier', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete all matiers');
      }

      const data = await response.json();
      setMessage(data.message || 'All matiers deleted successfully');
    } catch (error) {
      setMessage(error.message || 'Error deleting matiers');
    } finally {
      setLoading(false);
    }
  };





  return (
    <div>
        <div className="buttno_delete_all_bd">
      <button onClick={handleDeleteAll_bd} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete All Matiers'}
      </button>
      {message && <p>{message}</p>}
    </div>
      <div className="bloc_titre">
        <div>
          <i
            className="pi pi-graduation-cap"
            style={{
              fontSize: "1.8rem",
              color: "#60a5fa",
              marginRight: "15px",
              marginTop: "18px",
            }}
          ></i>
        </div>
        <div className="bloc_titre_nav">
          <h1>Calculateur de Moyenne</h1>

          <h3>Gestion des notes et calcul automatique</h3>
        </div>

        <div className="bloc_res">
          <p>
            {" "}
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
            style={{
              color: (() => {
                const val = calculateGeneralAverage(); // ✅ استدعاء الدالة
                const num = parseFloat(val); // لازم يكون val رقم أو نص رقم

                if (isNaN(num)) return "white"; // لون افتراضي لو ما في قيمة

                if (num < 7.99) return "#e36e66";
                else if (num >= 8 && num <= 11.99) return "#5b9cf1";
                else return "#48d77d";
              })(),
              marginLeft: "auto",
              float: "right",
              fontSize: "25px",
              fontWeight: "700",
            }}
          >
            {calculateGeneralAverage()}
          </p>
        </div>
      </div>

      <div className="bloc_buttons">
        <div className="bloc_2button">
          <button className="button_ajout" onClick={() => setVisible(true)}>
            <i
              className="pi pi-plus-circle"
              style={{ fontSize: "0.8rem", marginRight: "10px" }}
            ></i>
            Ajouter Matiére
          </button>
          <br />

          <button className="button_effacer" onClick={handleDeleteAll}>
            <i
              className="pi pi-trash"
              style={{ fontSize: "0.8rem", marginRight: "10px" }}
            ></i>
            Tout Effacer
          </button>
<button
  className="button_partager"
  onClick={() => {
    sendAllMatiers();
    setCopied(true);
  }}
>


            <i
              className="pi pi-share-alt"
              style={{ fontSize: "0.8rem", marginRight: "10px" }}
            ></i>{" "}
            Partage les matiers
          </button>

          <p className="total_coef"> Total Coef {totalCoef}</p>
        </div>

        <div className="bloc_res_tlf">
          {" "}
          <p className="moy_gen">
            <i
              className="pi pi-calculator"
              style={{
                fontSize: "1.2rem",
                color: "#caa81c",
                position: "relative",

                top: "2px",
              }}
            ></i>{" "}
            <span>Moyenne Générale</span>
          </p>
          <p className="mg">
            <i
              className="pi pi-calculator"
              style={{
                fontSize: "1.2rem",
                color: "#caa81c",
                position: "relative",

                top: "2px",
              }}
            ></i>{" "}
            <span>MG</span>
          </p>
          <p
            style={{
              marginLeft: "auto",
              float: "right",
              fontSize: "25px",
              fontWeight: "700",
            }}
          >
            /20
          </p>
        </div>
      </div>

      <div className="bloc_input_rech">
        <input
          onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
          type="number"
          placeholder="code matier"
          min={0}
          max={99999}
          step={1}
          
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

        {code && (
          <span
            onClick={() => {
              setCode("");
              setError(null); // حذف الخطأ عند مسح الحقل
              setIsCodeValid(false); // إعادة الحالة
              setHasSearched(false); // إخفاء رسالة الخطأ أيضاً
            }}
            style={{
              position: "relative",
              right: "30px",
              top: "-2px",
              transform: "translateY(15%)",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#fdfdfdff",
              userSelect: "none",
            }}
            title="مسح الحقل"
            role="button"
            aria-label="مسح الحقل"
          >
            ×
          </span>
        )}
        <button onClick={handleRecherche} className="button-rech">
          Recherche
        </button>
      </div>
<p className="erreur_2">{error2}</p>
      {hasSearched && !isCodeValid && (
        <>
          <p className="erreur_2">   Le code est incorrect ou aucun élément à afficher

    .</p>
        </>
      )}

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
              >
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Calcule moy
                </span>
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
          >
       <div style={{ padding: "0px" }}>
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
    fontSize: "28px",
    fontWeight: "bold",
    color: (() => {
      let totalGeneral = 0;
      let totalCoefGeneral = 0;

      matiers.forEach((m, i) => {
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

        if (totalCoef > 0) {
          totalGeneral += (total / totalCoef) * m.coef;
          totalCoefGeneral += m.coef;
        }
      });

      const moyGen =
        totalCoefGeneral === 0
          ? NaN
          : totalGeneral / totalCoefGeneral;

      if (isNaN(moyGen)) return "white";
      if (moyGen < 8) return "#e36e66";
      if (moyGen <= 11.99) return "#5b9cf1";
      return "#48d77d";
    })(),
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
      totalCoefGeneral === 0 ? NaN : totalGeneral / totalCoefGeneral;

    if (isNaN(moyGen)) return "00/20";
    return moyGen.toFixed(2) + "/20";
  })()}
</p>

    </div>



              {hasSearched && matiers.length > 0 && (
                <div className="bloc_matiers">
                  {matiers.map((m, i) => (
                    <div key={i} className="card_matier">
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
                      fontSize: "25px",
                      fontWeight: "700",
                    }}
                  >
                    {isNaN(num) ? "00/20" : num.toFixed(2) + "/20"}
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
                          
                            onClick={() => handleDelete(matier.id)}
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
  placeholder={`Note ${inputLabels[key] || key}`}
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
                              `${inputLabels[key] || key}(${
                                matier.formul[key]
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
                            gap: "10px",

                            marginRight: "20px",
                            marginLeft: "-35px",
                          }}
                        >
                          <i
                            className="pi pi-trash button_rem"
                            style={{ fontSize: "1rem" }}
                        
                            onClick={() => handleDelete(matier.id)}
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
    if (!isNaN(num) && num >= 0 && num <= 20) {
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
                              `${inputLabels[key] || key}(${
                                matier.formul[key]
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

      <Dialog
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span>Ajouter une matière</span>
            <button
              onClick={() => setVisible(false)}
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
        visible={visible}
        closable={false}
        className="custom-dialog"
        style={{ width: "500px", margin: "12px" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
      >
        <div>
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
          {errorMessage && (
            <div
              style={{ color: "#f74f4fff", marginTop: 10, fontSize: "15px" }}
            >
              {errorMessage}
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
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
        style={{ width: "500px", margin: "12px" }}
        onHide={() => setModifier(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>Nom</label>
          <input
            onWheel={(e) => e.target.blur()} // يفقد التركيز عند تمرير العجلة فلا يتم تعديل القيمة
            type="text"
            value={formData.nom}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nom: e.target.value }))
            }
          />

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
    </div>
  ) : null
)}
{errorMsg && (
  <div className="erreur">
    {errorMsg}
  </div>
)}


          <button className="button_update" onClick={handleUpdateMatier}>
            {" "}
            Valider
          </button>
        </div>
      </Dialog>

       <Toast ref={toast} />

      <ConfirmDialog
        group="declarative"
        visible={copied}
        onHide={() => setCopied(false)}
        message={
          <div style={{ fontSize: "1.1rem", color: "#2c3e50", fontWeight: "500", padding: "15px 10px" }}>
       Le code du document est{" "}
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
              onClick={copyToClipboard}
              title="Cliquez pour copier"
            >
              {code2}
            </span>
          </div>
        }
        header="Code du groupe de matières"
        icon="pi pi-copy"
        accept={accept}
        footer={
       <button
  style={{
    backgroundColor: "#007acc",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
  onClick={() => {
    copyToClipboard();
    setCopied(false);
  }}
>
  Copier le code
</button>

        }
      />
      

   
    </div>
  );
};

export default Home;
