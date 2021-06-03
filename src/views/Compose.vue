<template>
  <b-container class="p-0">
    <ocs-request-group-composition-form
      :observationPortalApiBaseUrl="observationPortalApiUrl"
      :profile="profile"
      :instruments="instruments"
      :form-config="formConfig"
      :site-code-to-name="siteCodeToName"
      show-airmass-plot
    ></ocs-request-group-composition-form>
  </b-container>
</template>
<script>
import $ from 'jquery';

export default {
  name: 'Compose',
  data: function () {
    return {
      instruments: {},
      siteCodeToName: {
        ogg: 'Haleakala'
      },
      formConfig: {
        requestGroup: {
          panel: {
            title: 'RequestGroup' // Override the default RequestGroup panel label
          },
          observation_type: {
            label: 'Type', // Override the default Observation Type field label
            desc: 'Choose the observation type', // Add a tooltip to the field with this text
            hide: false // Set to true to hide the field in the form
          }
        }
      }
    };
  },
  created: function () {
    this.getInstruments();
  },
  computed: {
    observationPortalApiUrl: function () {
      return this.$store.state.urls.observationPortalApi;
    },
    profile: function () {
      return this.$store.state.profile;
    }
  },
  methods: {
    getInstruments: function () {
      $.ajax({
        url: `${this.observationPortalApiUrl}/api/instruments/`
      }).done((response) => {
        this.instruments = response;
      });
    }
  }
};
</script>
