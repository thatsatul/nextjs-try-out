import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        welcome: "Welcome",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        search: "Search",
        filter: "Filter",
        home: "Home",
        about: "About",
        contact: "Contact",
        language: "Language"
      },
      navigation: {
        home: "Home",
        test: "Test",
        expression: "Expression",
        timer: "Timer",
        "infinite-scroll": "Infinite Scroll",
        "web-components": "Web Components"
      },
      finance: {
        title: "Finance Calculator",
        tax_calculation: "Tax Calculation",
        income: "Income",
        tax_rate: "Tax Rate",
        calculate: "Calculate",
        result: "Result"
      }
    },
  },
  es: {
    translation: {
      common: {
        welcome: "Bienvenido",
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        cancel: "Cancelar",
        save: "Guardar",
        delete: "Eliminar",
        edit: "Editar",
        add: "Añadir",
        search: "Buscar",
        filter: "Filtrar",
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto",
        language: "Idioma"
      },
      navigation: {
        home: "Inicio",
        test: "Prueba",
        expression: "Expresión",
        timer: "Temporizador",
        "infinite-scroll": "Desplazamiento Infinito",
        "web-components": "Componentes Web"
      },
      finance: {
        title: "Calculadora Financiera",
        tax_calculation: "Cálculo de Impuestos",
        income: "Ingresos",
        tax_rate: "Tasa de Impuestos",
        calculate: "Calcular",
        result: "Resultado"
      }
    },
  },
  fr: {
    translation: {
      common: {
        welcome: "Bienvenue",
        loading: "Chargement...",
        error: "Erreur",
        success: "Succès",
        cancel: "Annuler",
        save: "Enregistrer",
        delete: "Supprimer",
        edit: "Modifier",
        add: "Ajouter",
        search: "Rechercher",
        filter: "Filtrer",
        home: "Accueil",
        about: "À propos",
        contact: "Contact",
        language: "Langue"
      },
      navigation: {
        home: "Accueil",
        test: "Test",
        expression: "Expression",
        timer: "Minuteur",
        "infinite-scroll": "Défilement Infini",
        "web-components": "Composants Web"
      },
      finance: {
        title: "Calculateur Financier",
        tax_calculation: "Calcul des Impôts",
        income: "Revenus",
        tax_rate: "Taux d'Imposition",
        calculate: "Calculer",
        result: "Résultat"
      }
    },
  },
  de: {
    translation: {
      common: {
        welcome: "Willkommen",
        loading: "Lädt...",
        error: "Fehler",
        success: "Erfolg",
        cancel: "Abbrechen",
        save: "Speichern",
        delete: "Löschen",
        edit: "Bearbeiten",
        add: "Hinzufügen",
        search: "Suchen",
        filter: "Filtern",
        home: "Startseite",
        about: "Über uns",
        contact: "Kontakt",
        language: "Sprache"
      },
      navigation: {
        home: "Startseite",
        test: "Test",
        expression: "Ausdruck",
        timer: "Timer",
        "infinite-scroll": "Unendliches Scrollen",
        "web-components": "Web-Komponenten"
      },
      finance: {
        title: "Finanzrechner",
        tax_calculation: "Steuerberechnung",
        income: "Einkommen",
        tax_rate: "Steuersatz",
        calculate: "Berechnen",
        result: "Ergebnis"
      }
    },
  },
};

// Initialize i18n only once
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'es', 'fr', 'de'],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;
