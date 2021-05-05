<template>
  <div id="app" class="d-flex flex-column">
    <div>
      <b-navbar toggleable="lg" variant="dark" type="dark">
        <b-navbar-brand>
          <div id="name-large" class="text-left pl-2 align-top d-none d-lg-inline-block">
            Example<br/>Observation Portal
          </div>
          <div id="name-small" class="text-left pl-2 align-middle d-inline-block d-lg-none">
            Observation Portal
          </div>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item :to="{ name: 'requests' }">Requests</b-nav-item>
            <b-nav-item :to="{ name: 'create' }">Submit Observation</b-nav-item>
            <b-nav-item :to="{ name: 'observations' }">Observations</b-nav-item>

            <template v-if="userIsAuthenticated">
              <hr class="w-100 d-lg-none border-light" />
              <b-nav-text class="d-lg-none"><i class="fas fa-user-alt"></i>
              <span class="font-weight-bold">{{ profile.username }}</span></b-nav-text >
              <b-nav-item class="d-lg-none" :to="{ name: 'profile' }" >Profile</b-nav-item >
              <passthrough-get
                class="d-lg-none"
                endpoint="/accounts/logout/"
                :as-link="true"
                link-text="Logout"
                success-redirect-path="/"
                link-classes="nav-link"
                error-message="Oops, there was an error logging out, please try again."
              />
            </template>
            <template v-else>
              <b-nav-item class="d-lg-none" :to="{ name: 'login' }">Login</b-nav-item>
            </template>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown
              v-if="userIsAuthenticated"
              class="d-none d-lg-block"
              right
            >
              <template #button-content>
                <i class="fas fa-user-alt"></i>
              </template>
              <b-dropdown-text
                >Logged in as
                <span class="font-weight-bold">{{
                  profile.username
                }}</span></b-dropdown-text
              >
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item :to="{ name: 'profile' }"
                >Profile</b-dropdown-item
              >
              <passthrough-get
                endpoint="/accounts/logout/"
                :as-link="true"
                link-text="Logout"
                success-redirect-path="/"
                link-classes="dropdown-item"
                error-message="Oops, there was an error logging out, please try again."
              />
            </b-nav-item-dropdown>
            <b-nav-item v-else :to="{ name: 'login' }" class="d-none d-lg-block">Login</b-nav-item >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <b-container :fluid="isFluidPage" class="flex-shrink-0 p-1">
      <b-row>
        <b-col md="12">
          <b-alert
            v-for="message in messages"
            :key="message.text"
            :variant="message.variant"
            class="m-1"
            dismissible
            show
            @dismissed="deleteMessage(message.text)"
          >
            {{ message.text }}
          </b-alert>
        </b-col>
      </b-row>
      <router-view class="my-3" />
    </b-container>

    <div class="footer text-center mt-auto pt-2">
      <ul>
        <li>
          <a class="black" title="github" href="https://github.com/observatorycontrolsystem/" >
            <i class="fab fa-github"></i> View the Observatory Control System on Github </a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import PassthroughGet from "@/components/PassthroughGet.vue";

export default {
  name: "App",
  components: {
    PassthroughGet,
  },
  computed: {
    profile: function () {
      return this.$store.state.profile;
    },
    userIsAuthenticated: function () {
      return this.$store.state.userIsAuthenticated;
    },
    messages: function () {
      return this.$store.state.messages;
    },
    isFluidPage: function () {
      // A fluid page is a page where the contents take up the entire width of the page.
      return this.$route.meta.isFluidPage;
    },
  },
  methods: {
    deleteMessage: function (messageText) {
      this.$store.commit("deleteMessage", messageText);
    },
  },
};
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}

.footer {
  background-color: #ced6e0;
}
.footer ul li {
  display: inline-block;
  border: 1px;
  border-left: 1px solid black;
  line-height: 0.8em;
  padding: 0 26px;
}
.footer ul li:first-child {
  border: none;
}

.brand-image-large {
  max-height: 50px;
  padding-right: 0.5rem;
}
.brand-image-small {
  max-height: 45px;
}
#name-large {
  font-size: 1.2rem;
  margin-right: 1rem;
}
#name-small {
  font-size: 1.2rem;
  text-align: center;
}
.basic-small {
  font-size: 0.6rem;
}
</style>
