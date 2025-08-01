<template>
  <div class="mock-request-detail">
    <b-tabs content-class="mt-4" no-fade nav-class="nav-justified mt-3">
      <!-- Details tab -->
      <b-tab active @click="tab = 'details'">
        <template slot="title">
          <span title="Details about the observed request.">Details</span>
        </template>
        
        <div v-if="request.windows && request.windows.length != 0" class="row">
          <div class="col-md-12">
            <h4>Observation Windows</h4>
            <b-table
              :items="request.windows"
              :fields="windowFields"
              striped
              hover
              responsive
            >
              <template v-slot:cell(start)="data">
                {{ formatDate(data.item.start) }}
              </template>
              <template v-slot:cell(end)="data">
                {{ formatDate(data.item.end) }}
              </template>
            </b-table>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-12">
            <h4>Configurations</h4>
            <div v-for="(config, index) in request.configurations" :key="index" class="mb-4">
              <b-card :title="`Configuration ${index + 1}`" class="shadow-sm">
                <b-row>
                  <b-col md="6">
                    <strong>Type:</strong> {{ getConfigType(config) }}<br>
                    <strong>Instrument:</strong> {{ getInstrumentType(config) }}<br>
                    <strong>Target:</strong> {{ getTargetName(config) }}
                  </b-col>
                  <b-col md="6">
                    <div v-if="config.target">
                      <strong>Coordinates:</strong><br>
                      RA: {{ getTargetRa(config) }}°<br>
                      Dec: {{ getTargetDec(config) }}°
                    </div>
                  </b-col>
                </b-row>
                
                <div v-if="config.constraints" class="mt-3">
                  <h6>Constraints</h6>
                  <b-row>
                    <b-col md="4">
                      <strong>Max Airmass:</strong> {{ getMaxAirmass(config) }}
                    </b-col>
                    <b-col md="4">
                      <strong>Min Lunar Distance:</strong> {{ getMinLunarDistance(config) }}°
                    </b-col>
                  </b-row>
                </div>
              </b-card>
            </div>
          </div>
        </div>
      </b-tab>

      <!-- Scheduling tab -->
      <b-tab @click="tab = 'scheduling'">
        <template slot="title">
          <span title="Scheduling history.">Scheduling</span>
        </template>
        <div class="text-center">
          <h3>Mock Scheduling Data</h3>
          <p class="text-muted">
            This would show scheduling history and observation data in a real implementation.
          </p>
          <b-alert variant="info" show>
            <i class="fas fa-info-circle"></i>
            This is a mock view. In the real system, this would display:
            <ul class="mb-0 mt-2">
              <li>Observation history plots</li>
              <li>Scheduling information</li>
              <li>Completion status</li>
              <li>Data quality metrics</li>
            </ul>
          </b-alert>
        </div>
      </b-tab>

      <!-- Visibility Tab -->
      <b-tab @click="tab = 'visibility'">
        <template slot="title">
          <span title="Target Visibility.">Visibility</span>
        </template>
        <div class="text-center">
          <h3>Mock Visibility Data</h3>
          <p class="text-muted">
            This would show target visibility plots and airmass calculations.
          </p>
          <b-alert variant="info" show>
            <i class="fas fa-info-circle"></i>
            This is a mock view. In the real system, this would display:
            <ul class="mb-0 mt-2">
              <li>Airmass plots over time</li>
              <li>Visibility windows</li>
              <li>Site-specific constraints</li>
              <li>Weather considerations</li>
            </ul>
          </b-alert>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
export default {
  name: "RequestDetail",
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tab: "details",
      windowFields: [
        { key: 'start', label: 'Start Time', sortable: true },
        { key: 'end', label: 'End Time', sortable: true }
      ]
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    },
    getConfigType(config) {
      return config.type || 'Unknown';
    },
    getInstrumentType(config) {
      return config.instrument_type || 'Unknown';
    },
    getTargetName(config) {
      return config.target && config.target.name ? config.target.name : 'Unknown';
    },
    getTargetRa(config) {
      return config.target && config.target.ra ? config.target.ra : 'Unknown';
    },
    getTargetDec(config) {
      return config.target && config.target.dec ? config.target.dec : 'Unknown';
    },
    getMaxAirmass(config) {
      return config.constraints && config.constraints.max_airmass ? config.constraints.max_airmass : 'Unknown';
    },
    getMinLunarDistance(config) {
      return config.constraints && config.constraints.min_lunar_distance ? config.constraints.min_lunar_distance : 'Unknown';
    }
  }
};
</script>

<style lang="scss" scoped>
.mock-request-detail {
  .card {
    border: none;
    border-radius: 8px;
  }
  
  .alert {
    border-radius: 8px;
  }
  
  h4 {
    color: #433878;
    margin-bottom: 1rem;
  }
  
  h6 {
    color: #666;
    font-weight: 600;
  }
}
</style>
