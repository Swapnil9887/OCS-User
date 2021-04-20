import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap';
import '@/assets/scss/app.scss';
import $ from 'jquery';
import { getCookie, csrfSafeMethod } from '@/utils.js';
import { OCSComponentLib } from 'ocs-component-lib';
import 'ocs-component-lib/dist/ocs-component-lib.css';

Vue.use(BootstrapVue);
Vue.use(OCSComponentLib);

Vue.config.productionTip = false;

$.ajax({
  method: 'GET',
  url: '/config/urls.json'
}).done(function(json) {
  store.commit('setRuntimeConfig', {
    observationPortalApi: process.env.VUE_APP_OBSERVATION_PORTAL_API_URL || json.observationPortalApiUrl,
    archiveApi: process.env.VUE_APP_ARCHIVE_API_URL || json.archiveApiUrl,
    archiveClient: process.env.VUE_APP_ARCHIVE_CLIENT_URL || json.archiveClientUrl,
  });

  // Add csrf protection and credentials to requests sent to the observation portal API
  $(document).ajaxSend(function(event, xhr, settings) {
    if (settings.url.startsWith(store.state.urls.observationPortalApi)) {
      if (!csrfSafeMethod(settings.type)) {
        var csrftoken = getCookie('csrftoken');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
      }
      settings.xhrFields = {
        withCredentials: true
      };
    }
  });

  // Add the archive token to a request being sent to the archive api or the thumbservice
  $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (
      (options.url.startsWith(store.state.urls.archiveApi)) && store.state.archiveToken) {
      jqXHR.setRequestHeader('Authorization', 'Token ' + store.state.archiveToken);
    }
  });

  store
    .dispatch('getProfileData')
    .then(() => {
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app');
    })
    .catch(() => {
      console.log('Error getting profile data');
    });
});
