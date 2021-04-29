<template>
  <b-container class="p-0">

        <div v-if="!userIsAuthenticated" class="jumbotron noauth">
          <h1>Example Observation Portal</h1>
          <p>This is an example site showcasing the 
            <a href="https://github.com/observatorycontrolsystem/ocs-component-lib">OCS frontend component library</a>. Registered users can:</p>
          <ul class="list-unstyled">
            <li>
              <i class="fa fa-users fa-3x fa-pull-left" aria-hidden="true" />
              <span>Submit proposals and manage the membership of their research teams.</span>
            </li>
            <li>
              <i class="fab fa-wpexplorer fa-3x fa-pull-left" aria-hidden="true" />
              <span>Compose, save, and submit observation requests.</span>
            </li>
            <li>
              <i class="fa fa-cloud-download-alt fa-3x fa-pull-left" aria-hidden="true" />
              <span>Check the status of submitted requests, and download data from completed observations.</span>
            </li>
          </ul>
          <router-link class="btn btn-lg btn-success col-md-5" :to="{ name: 'register' }">
            Register an Account
          </router-link>
          <router-link :to="{ name: 'login' }" class="btn btn-lg btn-primary float-right col-md-5 col-md-offset-2">
            Login
          </router-link>
          <br />
        </div>

        <requestgroups-list />

  </b-container>
</template>

<script>
import RequestgroupsList from '@/components/RequestgroupsList.vue';
import { tooltipConfig } from '@/utils.js';

export default {
  name: 'Home',
  components: {
    RequestgroupsList,
  },
  data: function() {
    return {
      tooltipConfig: tooltipConfig,
    };
  },
  computed: {
    profile: function() {
      return this.$store.state.profile;
    },
    userIsAuthenticated: function() {
      return this.$store.state.userIsAuthenticated;
    },
  }
};
</script>

<style scoped>
.noauth {
  line-height: 1.4em;
}

.noauth li {
  height: 75px;
}

.noauth span {
  vertical-align: middle;
  padding-top: 5px;
}

.sidebar-nav {
  font-size: 1.3em;
}

.sidebar-nav li {
  height: 40px;
}
</style>
