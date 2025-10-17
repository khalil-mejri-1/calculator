import React, { useEffect, useState } from "react";
import axios from "axios";

// كتلة CSS مدمجة في قالب سلسلة نصية (string literal)
const styles = `
/* Palettes de Couleurs : Professionnel & Chic */
:root {
  --primary-focus: #5c9ce0ff; /* الأزرق الرئيسي الجديد */
  --primary-light: #e6f0ff; /* Bleu très clair pour les fonds */
  --text-dark: #343a40; /* Texte noir/gris foncé */
  --text-muted: #6c757d; /* Texte secondaire/muet */
  --background-clean: #6e6e6e05; /* Fond de la page (très léger gris) */
  --card-background: #ffffff; /* Fond des cartes */
  --border-light: #dee2e63f; /* Bordures subtiles */
  --shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.08); /* Ombre douce et moderne */
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
}

/* Base et Conteneur */
.matier-groups-container {
  max-width: 100%;
  margin: 40px auto;
  padding: 20px;
  background-color: var(--background-clean);
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-dark);
}

/* En-tête de la page */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 15px;
  border-bottom: 2px solid var(--border-light);
}

.page-header h2 {
  color: var(--primary-focus);
  font-weight: 700;
  font-size: 2.5em;
  margin-bottom: 5px;
}

.page-header .subtitle {
  color: var(--text-muted);
  font-size: 1.1em;
}

/* Grille des Groupes (Responsive Grid) */
.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 1 à 3 colonnes selon l'espace */
  gap: 30px;
}

/* 1. Carte du Groupe (Card) */
.matier-group-card {
  background-color: var(--card-background);
  border-radius: 10px;
  box-shadow: var(--shadow-subtle);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.matier-group-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* En-tête de la Carte */
.card-header {
  background-color: var(--primary-focus);
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-light);
}

.card-title {
  margin: 0;
  color: white;
  font-size: 1.3em;
  font-weight: 600;
}

/* 2. Section d'Information du Groupe */
.group-info-section {
  padding: 15px 20px;
  display: flex;
  flex-wrap: wrap; /* Pour le responsive */
  gap: 15px 30px;
  border-bottom: 1px solid var(--border-light);
}

.info-item {
  margin: 0;
  font-size: 0.95em;
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: default; /* لضمان أن المؤشر هو الإعداد الافتراضي ما لم يتم تبديله */
}

.info-item.full-width {
  flex-basis: 100%; /* Prend toute la largeur si nécessaire */
  margin-top: 10px;
}

.info-label {
  font-weight: 600;
  color: var(--text-muted);
}

.info-value {
  font-weight: 500;
  color: var(--text-dark);
}

.info-value.college {
  color: var(--primary-focus);
  font-weight: 700;
}

/* Étiquettes de Statut */
.status-tag {
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  text-transform: uppercase;
  color: white;
  transition: all 0.2s ease;
}

.status-tag.active {
  background-color: var(--success-color);
}

.status-tag.inactive {
  background-color: var(--text-muted);
}

/* 🌟 Nouvelle classe pour l'élément cliquable (Public: Oui) */
.toggle-button {
  cursor: pointer; 
  border: 2px solid transparent; 
}

/* 🟢 عندما يكون Public: Oui و Statut: Actif (جاهز للتعطيل) */
.info-item:not([style*="default"]) .status-tag.toggle-button.active {
    background-color: var(--primary-focus);
    border-color: var(--primary-focus);
}
.info-item:not([style*="default"]) .status-tag.toggle-button.active:hover {
    background-color: #0056b3; 
    border-color: #0056b3;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5); 
}

/* 🔴 عندما يكون Public: Oui و Statut: Inactif (جاهز للتفعيل) */
.info-item:not([style*="default"]) .status-tag.toggle-button.inactive {
    background-color: var(--danger-color);
    border-color: var(--danger-color);
}
.info-item:not([style*="default"]) .status-tag.toggle-button.inactive:hover {
    background-color: #c82333;
    border-color: #c82333;
    box-shadow: 0 0 8px rgba(220, 53, 69, 0.5); 
}


/* 3. Section des Matières (Chic & Scrollable) */
.matieres-section {
  padding: 0 20px 20px;
}

.matieres-title {
  color: var(--text-dark);
  padding: 15px 0 10px;
  margin: 0;
  font-weight: 600;
  font-size: 1.2em;
}

.matieres-list-scroller {
  max-height: 350px; /* Hauteur maximale pour le défilement */
  overflow-y: auto; /* Active le défilement */
  padding-right: 10px; /* Espace pour la barre de défilement */
}

/* Barre de défilement stylisée (Webkit) */
.matieres-list-scroller::-webkit-scrollbar {
  width: 6px;
}

.matieres-list-scroller::-webkit-scrollbar-thumb {
  background-color: rgba(0, 123, 255, 0.4); /* Couleur de la poignée */
  border-radius: 3px;
}

.matieres-list-scroller::-webkit-scrollbar-track {
  background: var(--primary-light); /* Couleur de la piste */
  border-radius: 3px;
}

.matieres-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.matier-item {
  background-color: var(--primary-light);
  border-left: 5px solid var(--primary-focus);
  padding: 12px 15px;
  margin-bottom: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.matier-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px dotted var(--border-light);
  padding-bottom: 5px;
}

.matier-name {
  font-weight: 700;
  font-size: 1.1em;
  color: var(--text-dark);
}

.matier-coef strong {
  color: var(--primary-focus);
  font-size: 1.1em;
}

/* Formule de Notation */
.formule-details {
  margin-top: 10px;
}

.formule-label {
  font-weight: 600;
  color: var(--text-muted);
  display: block;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.formule-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 10px;
}

.formule-list li {
  background-color: var(--card-background);
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--border-light);
}

.formula-value {
  font-weight: 700;
  color: var(--primary-focus);
}

.no-matieres {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-style: italic;
}

/* 4. Messages d'État (Loading, Error, Empty) */
.loading-message {
  text-align: center;
  padding: 50px;
  font-size: 1.5em;
  color: var(--primary-focus);
  animation: pulse 1.5s infinite;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: var(--danger-color);
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  margin: 30px auto;
  max-width: 600px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px;
  font-size: 1.2em;
  color: var(--text-muted);
  border: 2px dashed var(--border-light);
  border-radius: 10px;
  margin-top: 30px;
  background-color: var(--card-background);
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

/* 5. Media Queries pour le Responsive Design */
@media (max-width: 768px) {
  .matier-groups-container {
    margin: 20px auto;
    padding: 10px;
  }
  
  .page-header h2 {
    font-size: 2em;
  }

  .groups-grid {
    grid-template-columns: 1fr; /* Une seule colonne sur mobile */
    gap: 20px;
  }
  
  .group-info-section {
    display: block; /* Alignement vertical sur mobile */
  }

  .info-item {
    margin-bottom: 5px;
  }
}

@media (max-width: 480px) {
  .matier-item {
    padding: 10px;
  }
  
  .matier-details {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .matier-name {
    margin-bottom: 5px;
  }

  .matieres-list-scroller {
      max-height: 250px; /* Réduire la hauteur du scroll sur les petits écrans */
  }
}
`;


const MatierGroups = () => {
  const [matierGroups, setMatierGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatierGroups = async () => {
      try {
        // Dans une application réelle, assurez-vous que cette URL est correcte et accessible.
        const response = await axios.get("http://localhost:3000/matiers/multiple");
        setMatierGroups(response.data.data);
        setLoading(false);
      } catch (err) {
        // Utilisation de l'opérateur de chaînage optionnel pour gérer les erreurs Axios
        setError(err.response?.data?.message || "Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchMatierGroups();
  }, []);


  const handleStatusToggle = async (groupId) => {
    try {
      const response = await axios.put(`http://localhost:3000/matiers/toggle-status/${groupId}`);
      const updatedGroup = response.data.data;

      setMatierGroups((prevGroups) =>
        prevGroups.map((group) => (group._id === groupId ? updatedGroup : group))
      );
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de la mise à jour du statut";
      setError(message);
    }
  };

  if (loading) return <div className="loading-message">Chargement des groupes de matières...</div>;
  if (error) return <div className="error-message">{error}</div>;

  
  return (
    <div className="matier-groups-container">
      {/* 1. تضمين كود CSS كعنصر <style> */}
      <style>{styles}</style>
      
      <header className="page-header">
        <h2>Groupes de Matières</h2>
        <p className="subtitle">Aperçu et détails de tous les groupes et de leurs matières associées.</p>
      </header>

      {matierGroups.length === 0 ? (
        <div className="empty-state">
          <p>😔 Aucun groupe de matière trouvé. L'API pourrait être vide ou inaccessible.</p>
        </div>
      ) : (
        <div className="groups-grid">
          {matierGroups.map((group, index) => (
            <div key={group._id || index} className="matier-group-card">
              <div className="card-header">
                <h3 className="card-title">Groupe N° {index + 1}</h3>
              </div>
              
              <div className="group-info-section">
                <p className="info-item">
                  <span className="info-label">ID Parent:</span>
                  <span className="info-value">{group.parentId || "N/A"}</span>
                </p>
                
                {/* Élément cliquable pour le Toggle */}
                <p 
                    className="info-item"
                    // Le clic n'est actif que si le groupe est Public
                    onClick={group.isPublic ? () => handleStatusToggle(group._id) : null}
                    // Le curseur change en 'pointer' si l'élément est cliquable
                    style={{ cursor: group.isPublic ? 'pointer' : 'default' }}
                >
                  <span className="info-label">Public:</span>
                  <span 
                    // Ajout de la classe 'toggle-button' pour le style cliquable
                    className={`status-tag ${group.status ? 'active' : 'inactive'} ${group.isPublic ? 'toggle-button' : ''}`}
                    title={group.isPublic ? "Cliquer pour basculer le statut (Actif/Inactif)" : null}
                  >
                    {group.isPublic ? "Oui" : "Non"}
                  </span>
                </p>

                <p className="info-item">
                  <span className="info-label">Statut:</span>
                  <span className={`status-tag ${group.status ? 'active' : 'inactive'}`}>
                    {group.status ? "Actif" : "Inactif"}
                  </span>
                </p>
                {group.isPublic && group.collegeName && (
                  <p className="info-item full-width">
                    <span className="info-label">Université:</span>
                    <span className="info-value college">{group.collegeName}</span>
                  </p>
                )}
              </div>

              <div className="matieres-section">
                <h4 className="matieres-title">Matières ({group.matieres?.length || 0})</h4>
                {group.matieres && group.matieres.length > 0 ? (
                  <div className="matieres-list-scroller">
                    <ul className="matieres-list">
                      {group.matieres.map((mat, i) => (
                        <li key={i} className="matier-item">
                          <div className="matier-details">
                            <span className="matier-name">{mat.nom}</span>
                            <span className="matier-coef">Coeff: <strong>{mat.coef}</strong></span>
                          </div>
                          
                          <div className="formule-details">
                            <span className="formule-label">Formule de Notation:</span>
                            <ul className="formule-list">
                              <li>DS: <span className="formula-value">{mat.formul?.coef_ds ?? 0}</span></li>
                              <li>DS1: <span className="formula-value">{mat.formul?.coef_ds1 ?? 0}</span></li>
                              <li>DS2: <span className="formula-value">{mat.formul?.coef_ds2 ?? 0}</span></li>
                              <li>TP: <span className="formula-value">{mat.formul?.coef_tp ?? 0}</span></li>
                              <li>Examen: <span className="formula-value">{mat.formul?.coef_examen ?? 0}</span></li>
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="no-matieres">Aucune matière enregistrée pour ce groupe.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatierGroups;