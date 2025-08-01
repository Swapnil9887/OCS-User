<template>
  <b-row class="justify-content-center">
    <b-col cols="12" md="8" lg="6">
      <b-card
        class="shadow-sm border-0"
        header-class="bg-primary text-white"
        body-class="p-4"
      >
        <template #header>
          <h4 class="mb-0">
            <i class="fas fa-sign-in-alt mr-2"></i>Login
          </h4>
        </template>
        <passthrough-form
          endpoint="/accounts/login/"
          :success-redirect-path="redirectPath"
        />
        <div class="text-center mt-3">
          <p class="mb-0">
            Not a member?
            <router-link 
              :to="{ name: 'register' }"
              class="text-primary font-weight-bold"
            >
              Register here
            </router-link>
          </p>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import PassthroughForm from "@/components/PassthroughForm.vue";

export default {
  name: "Login",
  components: {
    PassthroughForm,
  },
  computed: {
    redirectPath: function () {
      return this.$route.query.next || "/";
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 0.5rem;
  
  .card-header {
    border-radius: 0.5rem 0.5rem 0 0;
    background: linear-gradient(135deg, #433878 0%, #7E60BF 100%);
    color: #FFE1FF;
  }
}

::v-deep .form-control {
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
  padding: 0.75rem 1rem;
  
  &:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
}

::v-deep .btn-primary {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #433878 0%, #7E60BF 100%);
  border-color: #433878;
  color: #FFE1FF;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    background: linear-gradient(135deg, #7E60BF 0%, #433878 100%);
  }
}

::v-deep .text-primary {
  color: #433878 !important;
  
  &:hover {
    color: #7E60BF !important;
  }
}
</style>
