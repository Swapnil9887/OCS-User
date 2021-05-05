<template>
  <ocs-observations-table 
    :observationPortalApiBaseUrl="observationPortalApiUrl"
    :observationDetailLink="generateObservationLink"
    :requestLink="generateRequestLink"
    @onSuccessfulDataRetrieval="clearErrors"
    @onErrorRetrievingData="setErrorsOnFailedAJAXCall"
  >
    <template v-slot:empty>
      <router-link :to="{ name: 'login' }" class="btn btn-lg btn-primary col-md-5 col-md-offset-2">
        Login
      </router-link>
    </template>
  </ocs-observations-table>
</template>
<script>
import { clearAndSetErrorsMixin } from '@/clearAndSetErrorsMixin.js';
export default {
  name: 'ObservationsList',
  mixins: [clearAndSetErrorsMixin],
  computed: {
    observationPortalApiUrl: function() {
      return this.$store.state.urls.observationPortalApi;
    }
  },
  methods: {
    generateObservationLink: function(observationId) {
      return { to: { name: 'observationDetail', params: { id: observationId } } };
    },
    generateRequestLink: function(requestId) {
      return { to: { name: 'requestDetail', params: { id: requestId } } };
    }
  }
};
</script>
