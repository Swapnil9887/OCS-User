<template>

  <ocs-request-group-table
    class="p-0"
    :observation-portal-api-base-url="observationPortalApiUrl"
    :profile="profile"
    :requestgroup-link="generateRequestgroupLink"
    @success="onSuccess"
    @error="onError"
  >
    <template v-slot:empty-requests>
      <div class="empty-requests">
        <center>
          <h2>No observation requests found.</h2>
          <div v-if="profile.proposals.length > 0">
            <router-link class="btn btn-success btn-lg" :to="{ name: 'create' }">
              Submit an Observation Request
            </router-link>
          </div>
          <div v-else>
            <h2>You are not a member of any proposals yet.</h2>
            <p>Only users with at least one active proposal may submit observation requests.</p>
          </div>
        </center>
      </div>
    </template>
  </ocs-request-group-table>
</template>

<script>
import { clearAndSetErrorsMixin } from '@/components/util/utilMixins.js';

export default {
  name: 'RequestgroupsList',
  mixins: [clearAndSetErrorsMixin],
  computed: {
    observationPortalApiUrl: function() {
      return this.$store.state.urls.observationPortalApi;
    },
    profile: function() {
      return this.$store.state.profile;
    }
  },
  methods: {
    onSuccess: function() {
      this.clearErrors();
    },
    onError: function(evt) {
      this.setErrorsOnFailedAJAXCall(evt);
    },
    generateRequestgroupLink: function(requestgroupId) {
      return { to: { name: 'requestgroupDetail', params: { id: requestgroupId } } };
    }
  }
};
</script>

<style scoped>
.empty-requests {
  margin-top: 50px;
}
</style>
