<template>
  <div class="mock-request-row">
    <b-card class="mb-3 shadow-sm">
      <b-row>
        <b-col md="8">
          <h5 class="card-title">
            <router-link 
              v-if="link"
              :to="{ name: 'requestDetail', params: { id: request.id } }"
              class="text-primary"
            >
              Request #{{ request.id }}
            </router-link>
            <span v-else>Request #{{ request.id }}</span>
          </h5>
          
          <div class="request-details">
            <div v-if="request.configurations && request.configurations.length > 0">
              <strong>Target:</strong> {{ getTargetName(request.configurations[0]) }}<br>
              <strong>Instrument:</strong> {{ getInstrumentType(request.configurations[0]) }}<br>
              <strong>Type:</strong> {{ getConfigType(request.configurations[0]) }}
            </div>
            
            <div v-if="request.windows && request.windows.length > 0">
              <strong>Window:</strong> {{ formatDate(request.windows[0].start) }} - {{ formatDate(request.windows[0].end) }}
            </div>
          </div>
        </b-col>
        
        <b-col md="2" class="text-center">
          <b-badge :variant="getStateVariant(request.state)" class="mb-2">
            {{ request.state }}
          </b-badge>
        </b-col>
        
        <b-col md="2" class="text-center">
          <b-button-group size="sm">
            <b-button 
              variant="outline-primary"
              :href="requestApiUrl"
              target="_blank"
            >
              <i class="fa fa-fw fa-code"></i> API
            </b-button>
          </b-button-group>
          
          <div v-if="request.state === 'PENDING'" class="mt-2">
            <small class="text-muted">
              <i class="fa fa-clock"></i> Scheduled
            </small>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "RequestRow",
  props: {
    request: {
      type: Object,
      required: true,
    },
    instruments: {
      type: Object,
      required: true,
    },
    link: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    observationPortalApiUrl: function () {
      return this.$store.state.urls.observationPortalApi;
    },
    requestApiUrl: function () {
      return (
        this.$store.state.urls.observationPortalApi +
        "/api/requests/" +
        this.request.id +
        "/"
      );
    },
  },
  methods: {
    getStateVariant(state) {
      const variants = {
        'PENDING': 'warning',
        'COMPLETED': 'success',
        'CANCELED': 'danger',
        'FAILED': 'danger'
      };
      return variants[state] || 'secondary';
    },
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getTargetName(config) {
      return config.target && config.target.name ? config.target.name : 'Unknown';
    },
    getInstrumentType(config) {
      return config.instrument_type || 'Unknown';
    },
    getConfigType(config) {
      return config.type || 'Unknown';
    }
  },
};
</script>

<style lang="scss" scoped>
.mock-request-row {
  .card {
    border: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
    }
  }
  
  .request-details {
    font-size: 0.9rem;
    color: #666;
    
    strong {
      color: #333;
    }
  }
  
  .badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
