<template>
  <b-row>
    <b-col>
      <em>Hint: the testing credentials are 'test_user' and 'test_pass'.</em>
      <hr/>
      <passthrough-form endpoint="/accounts/login/" :success-redirect-path="redirectPath"/>
      <br />
    </b-col>
  </b-row>
</template>
<script>
import PassthroughForm from '@/components/PassthroughForm.vue';

export default {
  name: 'Login',
  components: {
    PassthroughForm
  },
  computed: {
    redirectPath: function() {
      return this.$route.query.next || '/';
    }
  }
};
</script>
