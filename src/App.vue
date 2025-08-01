<template>
  <div id="app" class="d-flex flex-column">
    <div>
      <b-navbar toggleable="lg" variant="dark" type="dark" class="shadow-sm">
        <b-navbar-brand>
          <div
            id="name-large"
            class="text-left pl-2 align-top d-none d-lg-inline-block d-flex align-items-center"
          >
            <img 
              src="@/assets/images/prl-logo.png" 
              alt="PRL Logo" 
              class="prl-logo mr-1"
            />
            <span class="navbar-logo-text">Mount Abu Observatory</span>
          </div>
          <!-- <div
            id="name-small"
            class="text-left pl-2 align-middle d-inline-block d-lg-none d-flex align-items-center"
          >
            <img 
              src="@/assets/images/prl-logo.png" 
              alt="PRL Logo" 
              class="prl-logo-small mr-1"
            />
            <span class="navbar-logo-text-small">Mount Abu Observatory</span>
          </div> -->
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item :to="{ name: 'requests' }">
              <i class="fas fa-list mr-1"></i>Requests
            </b-nav-item>
            <b-nav-item :to="{ name: 'create' }">
              <i class="fas fa-plus-circle mr-1"></i>Submit Observation
            </b-nav-item>
            <b-nav-item :to="{ name: 'observations' }">
              <i class="fas fa-binoculars mr-1"></i>Observations
            </b-nav-item>
            <template v-if="userIsAuthenticated">
              <hr class="w-100 d-lg-none border-light" />
              <b-nav-text class="d-lg-none">
                <i class="fas fa-user-alt"></i>
                <span class="font-weight-bold ml-2">{{ profile.username }}</span>
              </b-nav-text>
              <b-nav-item class="d-lg-none" :to="{ name: 'profile' }">
                <i class="fas fa-user-cog mr-1"></i>Profile
              </b-nav-item>
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
              <b-nav-item class="d-lg-none" :to="{ name: 'login' }">
                <i class="fas fa-sign-in-alt mr-1"></i>Login
              </b-nav-item>
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
                <span class="ml-2">{{ profile.username }}</span>
              </template>
              <b-dropdown-text>
                <i class="fas fa-user-circle mr-2"></i>
                Logged in as
                <span class="font-weight-bold">{{ profile.username }}</span>
              </b-dropdown-text>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item :to="{ name: 'profile' }">
                <i class="fas fa-user-cog mr-2"></i>Profile
              </b-dropdown-item>
              <passthrough-get
                endpoint="/accounts/logout/"
                :as-link="true"
                link-text="Logout"
                success-redirect-path="/"
                link-classes="dropdown-item"
                error-message="Oops, there was an error logging out, please try again."
              />
            </b-nav-item-dropdown>
            <b-nav-item
              v-else
              :to="{ name: 'login' }"
              class="d-none d-lg-block"
            >
              <i class="fas fa-sign-in-alt mr-1"></i>Login
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <b-container :fluid="isFluidPage" class="flex-shrink-0 p-3">
      <b-row>
        <b-col md="12">
          <transition-group name="fade" tag="div">
            <b-alert
              v-for="message in messages"
              :key="message.text"
              :variant="message.variant"
              class="m-1 shadow-sm"
              dismissible
              show
              @dismissed="deleteMessage(message.text)"
            >
              {{ message.text }}
            </b-alert>
          </transition-group>
        </b-col>
      </b-row>
      <router-view class="my-3" />
    </b-container>
    <footer class="footer mt-auto py-3">
      <b-container>
        <div class="text-center">
          <span class="copyright-text">Physical Research Laboratory, Mount Abu ©2025</span>
        </div>
      </b-container>
    </footer>
    <b-alert
      v-model="showMessage"
      :variant="messageVariant"
      dismissible
      class="position-fixed fixed-bottom m-0 rounded-0"
    >
      {{ message }}
    </b-alert>
  </div>
</template>
<script>
import PassthroughGet from "@/components/PassthroughGet.vue";

export default {
  name: "App",
  components: {
    PassthroughGet,
  },
  data() {
    return {
      showMessage: false,
      messageVariant: 'info',
      message: ''
    };
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
  background-color: #f8f9fa;
}

.footer {
  background: linear-gradient(135deg, #433878 0%, #7E60BF 100%);
  color: #FFE1FF;
  
  .copyright-text {
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
}

.prl-logo {
  height: 60px;
  width: auto;
  vertical-align: middle;
  padding: 0;
  margin: 0;
}

.prl-logo-small {
  height: 28px;
  width: auto;
  vertical-align: middle;
  padding: 0;
}

.navbar-logo-text {
  color: #FFE1FF;
  margin-left: 0.1rem; /* Decreased gap */
  font-size: 1.4rem;
  font-weight: 600;
}

.navbar-logo-text-small {
  color: #FFE1FF;
  margin-left: 0.1rem; /* Decreased gap */
  font-size: 1.1rem;
  font-weight: 600;
}

#name-large {
  font-size: 1.1rem;
  margin-right: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0;
  height: 56px;
  
  img {
    margin-right: 0.25rem;
  }
}

#name-small {
  font-size: 1.1rem;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0;
  
  img {
    margin-right: 0.25rem;
  }
}

.basic-small {
  font-size: 0.6rem;
}

// Add transitions
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// Enhance navbar
.navbar {
  background: linear-gradient(135deg, #433878 0%, #7E60BF 100%);
  padding: 0.1rem 0.5rem;
  min-height: 56px;
  box-shadow: 0 2px 4px rgba(67, 56, 120, 0.2);
  
  .navbar-brand {
    font-weight: 600;
    padding: 0;
    color: #FFE1FF !important;
  }
  
  .nav-link {
    transition: all 0.3s ease;
    padding: 0.1rem 0.5rem;
    color: #FFE1FF !important;
    
    &:hover {
      color: #E4B1F0 !important;
      transform: translateY(-1px);
    }
  }

  .navbar-toggler {
    border-color: #E4B1F0;
    
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(228, 177, 240, 0.25);
    }
  }

  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(228, 177, 240, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }
}

// Update alert styling to match theme
.alert {
  border: none;
  box-shadow: 0 2px 4px rgba(67, 56, 120, 0.1);
  
  &.alert-success {
    background-color: #E4B1F0;
    color: #433878;
  }
  
  &.alert-danger {
    background-color: #FFE1FF;
    color: #7E60BF;
  }
}
</style>
