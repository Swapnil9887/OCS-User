import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import "bootstrap";
import "@/assets/scss/app.scss";
import $ from "jquery";
import { getCookie, csrfSafeMethod } from "@/utils.js";
import { OCSComponentLib } from "ocs-component-lib";
import "ocs-component-lib/dist/ocs-component-lib.css";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
Vue.use(BootstrapVue);
Vue.use(OCSComponentLib);

Vue.config.productionTip = false;

// Mock configuration for development without backend
const mockConfig = {
  observationPortalApi: process.env.VUE_APP_OBSERVATION_PORTAL_API_URL || "http://127.0.0.1:8000"
};

// Mock data for development
const mockProfileData = {
  profile: {
    username: "demo_user",
    first_name: "Demo",
    last_name: "User",
    email: "demo@prl.res.in",
    institution: "Physical Research Laboratory",
    title: "Research Scientist"
  },
  tokens: {},
  proposals: [
    {
      id: 1,
      title: "Exoplanet Characterization Study",
      pi: "Dr. Demo User",
      active: true,
      tags: ["exoplanets", "spectroscopy"]
    },
    {
      id: 2,
      title: "Asteroid Light Curve Analysis",
      pi: "Dr. Demo User", 
      active: true,
      tags: ["asteroids", "photometry"]
    }
  ],
  available_instrument_types: [
    "Imaging Camera",
    "Spectrograph",
    "Polarimeter"
  ],
  proposal_notifications: []
};

// Initialize Vue app with mock data
store.commit("setRuntimeConfig", {
  observationPortalApi: mockConfig.observationPortalApi
});

// Set mock profile data for development
store.commit("setProfileData", mockProfileData);

// Create Vue instance
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

// Log development message
console.log("Running in development mode with mock data");
console.log("Mock user: demo_user");
console.log("Mock proposals loaded: 2");
console.log("Frontend available at: http://localhost:8080");
