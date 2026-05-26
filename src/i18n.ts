import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to FastCard Admin Panel",
      dashboard: "Dashboard",
      orders: "Orders",
      products: "Products",
      other: "Other",
      login: "Login",
      logout: "Log Out",
      email: "Email Address",
      password: "Password",
      submit: "Submit",
      validation_required: "This field is required",
      validation_email: "Invalid email address",
      validation_password_min: "Password must be at least 6 characters",
      demo_form_title: "Verification & Demo Form",
      demo_form_desc: "Enter details to test Formik, Yup validation, Axios API fetching, and Redux State storage.",
      axios_test_title: "Axios Live Test",
      axios_test_btn: "Fetch GitHub Repository Stats",
      axios_test_loading: "Fetching...",
      axios_test_success: "Successfully fetched repository stats!",
      redux_user_logged_in: "Currently Logged In (Redux Store):"
    }
  },
  es: {
    translation: {
      welcome: "Bienvenido al Panel de FastCard",
      dashboard: "Panel de control",
      orders: "Pedidos",
      products: "Productos",
      other: "Otro",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      email: "Correo electrónico",
      password: "Contraseña",
      submit: "Enviar",
      validation_required: "Este campo es requerido",
      validation_email: "Correo electrónico inválido",
      validation_password_min: "La contraseña debe tener al menos 6 caracteres",
      demo_form_title: "Formulario de Demostración",
      demo_form_desc: "Ingrese los detalles para probar Formik, la validación de Yup, Axios y el almacenamiento de Redux.",
      axios_test_title: "Prueba de Axios en Vivo",
      axios_test_btn: "Obtener estadísticas de GitHub",
      axios_test_loading: "Obteniendo...",
      axios_test_success: "Estadísticas del repositorio obtenidas correctamente!",
      redux_user_logged_in: "Sesión iniciada (Redux Store):"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
