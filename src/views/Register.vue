<template>
  <b-row>
    <b-col>
      <passthrough-form endpoint="/accounts/register/">
      </passthrough-form>
    </b-col>
  </b-row>
</template>
<script>
import PassthroughForm from '@/components/PassthroughForm.vue';

export default {
  name: 'Register',
  components: {
    PassthroughForm
  }
};
</script>
