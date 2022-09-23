<template>
  <b-row>
    <b-col>
      <hr />
      <passthrough-form
        endpoint="/accounts/login/"
        :success-redirect-path="redirectPath"
      />
      <br />
      <p>Not a member?<router-link :to="{ name: 'register' }"> Register</router-link>.</p>
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
