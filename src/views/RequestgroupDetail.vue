<template>
  <div class="mock-requestgroup-detail">
    <b-row>
      <b-col>
        <h2 class="text-break">
          {{ requestgroup.name }}
        </h2>
        <h4>RequestGroup # {{ requestgroup.id }}</h4>
      </b-col>
    </b-row>
    
    <!-- Request Group Header -->
    <b-card class="mb-4 shadow-sm">
      <b-row>
        <b-col md="3">
          <strong>Proposal:</strong><br>
          <span class="badge badge-info">{{ requestgroup.proposal }}</span>
        </b-col>
        <b-col md="3">
          <strong>Status:</strong><br>
          <b-badge :variant="getStateVariant(requestgroup.state)">
            {{ requestgroup.state }}
          </b-badge>
        </b-col>
        <b-col md="3">
          <strong>Created:</strong><br>
          {{ formatDate(requestgroup.created) }}
        </b-col>
        <b-col md="3">
          <strong>IPP Value:</strong><br>
          {{ requestgroup.ipp_value }}
        </b-col>
      </b-row>
    </b-card>

    <!-- Breadcrumb -->
    <b-row>
      <b-col>
        <b-breadcrumb class="bg-light">
          <template v-if="requestDetail">
            <b-breadcrumb-item
              :to="{
                name: 'requestgroupDetail',
                params: { id: requestgroup.id },
              }"
            >
              Sub-requests
            </b-breadcrumb-item>
            <b-breadcrumb-item active> #{{ request.id }} </b-breadcrumb-item>
          </template>
          <b-breadcrumb-item v-else active> Sub-requests </b-breadcrumb-item>
        </b-breadcrumb>
      </b-col>
    </b-row>

    <!-- Request Detail or Request List -->
    <template v-if="requestDetail">
      <request-row :request="request" :instruments="mockInstruments" />
      <request-detail :request="request" />
    </template>
    <template v-else>
      <b-table
        id="requests-table"
        :fields="fields"
        :items="requestgroup.requests"
        :per-page="perPage"
        thead-class="d-none"
        details-td-class="p-0"
        :current-page="currentPage"
        borderless
        small
      >
        <template v-slot:cell(requestRow)="data">
          <request-row
            :request="data.item"
            :instruments="mockInstruments"
            :link="true"
          />
        </template>
      </b-table>
      <b-pagination
        v-if="numberOfRequests > perPage"
        v-model="currentPage"
        :total-rows="numberOfRequests"
        :per-page="perPage"
        aria-controls="requests-table"
      />
    </template>

    <b-row>
      <b-col>
        <h3 class="mt-4">Associated Observations</h3>
        <b-table
          :items="associatedObservations"
          :fields="observationFields"
          striped
          hover
          responsive
          class="shadow-sm"
          :tbody-tr-class="() => 'observation-row'"
        >
          <template v-slot:cell(id)="data">
            <router-link :to="{ name: 'observationDetail', params: { id: data.item.id } }" class="font-weight-bold text-primary">
              {{ data.item.id }}
            </router-link>
          </template>
          <template v-slot:cell(request_id)="data">
            <router-link :to="{ name: 'requestDetail', params: { id: data.item.request_id } }" class="text-primary">
              {{ data.item.request_id }}
            </router-link>
          </template>
          <template v-slot:cell(instruments)="data">
            <span v-for="(inst, idx) in data.item.instruments" :key="idx" class="badge badge-info mr-1">{{ inst }}</span>
          </template>
          <template v-slot:cell(modified)="data">
            {{ formatDate(data.item.modified) }}
          </template>
          <template v-slot:cell(created)="data">
            {{ formatDate(data.item.created) }}
          </template>
          <template v-slot:row-details="row">
            <div class="p-3 bg-light">
              <h5>Associated Request Details (Request #{{ row.item.request_id }})</h5>
              <request-detail :request="findRequestById(row.item.request_id)" />
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import $ from "jquery";
import _ from "lodash";

import RequestDetail from "@/components/RequestDetail.vue";
import RequestRow from "@/components/RequestRow.vue";
import NotFound from "@/components/NotFound.vue";

export default {
  name: "RequestgroupDetail",
  components: {
    RequestDetail,
    RequestRow,
    NotFound,
  },
  data: function () {
    return {
      requestgroup: {},
      mockInstruments: {
        "Imaging Camera": {
          name: "Imaging Camera",
          type: "CAMERA",
          class: "1m0",
          mode: "imaging"
        },
        "Spectrograph": {
          name: "Spectrograph", 
          type: "SPECTROGRAPH",
          class: "1m0",
          mode: "spectroscopy"
        }
      },
      fields: [{ key: "requestRow", tdClass: "p-0" }],
      currentPage: 1,
      perPage: 25,
      observationFields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'site', label: 'Site', sortable: true },
        { key: 'enclosure', label: 'Enc.', sortable: true },
        { key: 'telescope', label: 'Tel.', sortable: true },
        { key: 'start', label: 'Start', sortable: true },
        { key: 'end', label: 'End', sortable: true },
        { key: 'request_id', label: 'Req.ID', sortable: true },
        { key: 'proposal', label: 'Proposal', sortable: true },
        { key: 'instruments', label: 'Instruments', sortable: false },
        { key: 'modified', label: 'Modified', sortable: true },
        { key: 'created', label: 'Created', sortable: true }
      ],
      mockObservations: [
        { id: 1001, site: 'MAO', enclosure: 'ENC1', telescope: '1m0', start: '2025-07-01T18:00:00Z', end: '2025-07-01T22:00:00Z', request_id: 101, proposal: 'Exoplanet Characterization Study', instruments: ['Imaging Camera'], modified: '2025-07-01T22:10:00Z', created: '2025-06-25T10:30:00Z' },
        { id: 1002, site: 'MAO', enclosure: 'ENC2', telescope: '1m0', start: '2025-07-02T19:00:00Z', end: '2025-07-02T23:00:00Z', request_id: 102, proposal: 'Asteroid Light Curve Analysis', instruments: ['Imaging Camera'], modified: '2025-07-02T23:10:00Z', created: '2025-06-26T11:00:00Z' },
        { id: 1003, site: 'MAO', enclosure: 'ENC1', telescope: '1m0', start: '2025-07-03T20:00:00Z', end: '2025-07-03T23:30:00Z', request_id: 103, proposal: 'Variable Star Monitoring', instruments: ['Spectrograph'], modified: '2025-07-03T23:40:00Z', created: '2025-06-27T12:00:00Z' },
        { id: 1004, site: 'MAO', enclosure: 'ENC2', telescope: '1m0', start: '2025-07-04T18:30:00Z', end: '2025-07-04T22:30:00Z', request_id: 104, proposal: 'Exoplanet Characterization Study', instruments: ['Imaging Camera', 'Spectrograph'], modified: '2025-07-04T22:40:00Z', created: '2025-06-28T13:00:00Z' },
        { id: 1005, site: 'MAO', enclosure: 'ENC1', telescope: '1m0', start: '2025-07-05T19:30:00Z', end: '2025-07-05T23:30:00Z', request_id: 105, proposal: 'Asteroid Light Curve Analysis', instruments: ['Imaging Camera'], modified: '2025-07-05T23:40:00Z', created: '2025-06-29T14:00:00Z' },
        { id: 1006, site: 'MAO', enclosure: 'ENC2', telescope: '1m0', start: '2025-07-06T20:00:00Z', end: '2025-07-06T23:00:00Z', request_id: 106, proposal: 'Variable Star Monitoring', instruments: ['Spectrograph'], modified: '2025-07-06T23:10:00Z', created: '2025-06-30T15:00:00Z' },
        { id: 1007, site: 'MAO', enclosure: 'ENC1', telescope: '1m0', start: '2025-07-07T18:00:00Z', end: '2025-07-07T22:00:00Z', request_id: 107, proposal: 'Exoplanet Characterization Study', instruments: ['Imaging Camera'], modified: '2025-07-07T22:10:00Z', created: '2025-07-01T16:00:00Z' },
        { id: 1008, site: 'MAO', enclosure: 'ENC2', telescope: '1m0', start: '2025-07-08T19:00:00Z', end: '2025-07-08T23:00:00Z', request_id: 108, proposal: 'Asteroid Light Curve Analysis', instruments: ['Imaging Camera'], modified: '2025-07-08T23:10:00Z', created: '2025-07-02T17:00:00Z' },
        { id: 1009, site: 'MAO', enclosure: 'ENC1', telescope: '1m0', start: '2025-07-09T20:00:00Z', end: '2025-07-09T23:30:00Z', request_id: 109, proposal: 'Variable Star Monitoring', instruments: ['Spectrograph'], modified: '2025-07-09T23:40:00Z', created: '2025-07-03T18:00:00Z' },
        { id: 1010, site: 'MAO', enclosure: 'ENC2', telescope: '1m0', start: '2025-07-10T18:30:00Z', end: '2025-07-10T22:30:00Z', request_id: 110, proposal: 'Exoplanet Characterization Study', instruments: ['Imaging Camera', 'Spectrograph'], modified: '2025-07-10T22:40:00Z', created: '2025-07-04T19:00:00Z' }
      ]
    };
  },
  computed: {
    observationPortalApiUrl: function () {
      return this.$store.state.urls.observationPortalApi;
    },
    userIsAuthenticated: function () {
      return this.$store.state.userIsAuthenticated;
    },
    numberOfRequests: function () {
      if (this.requestgroup.requests) {
        return this.requestgroup.requests.length;
      } else {
        return 0;
      }
    },
    requestDetail: function () {
      return this.$route.name === "requestDetail";
    },
    id: function () {
      return this.$route.params.id;
    },
    request: function () {
      let requestDict = {};
      if (this.requestDetail) {
        for (let request of _.get(this.requestgroup, "requests", [])) {
          if (String(request.id) === String(this.id)) {
            requestDict = request;
            break;
          }
        }
      }
      return requestDict;
    },
    associatedObservations() {
      // Collect all request IDs for this group
      const reqIds = (this.requestgroup.requests || []).map(r => r.id);
      return this.mockObservations.filter(o => reqIds.includes(o.request_id));
    }
  },
  created: function () {
    // Load mock data based on the ID
    this.loadMockRequestGroup();
  },
  methods: {
    loadMockRequestGroup() {
      // Mock data for different request groups
      const mockData = {
        1: {
          id: 1,
          name: "Exoplanet Transit Observation",
          proposal: "Exoplanet Characterization Study",
          state: "PENDING",
          created: "2025-06-25T10:30:00Z",
          submitter: "demo_user",
          observation_type: "NORMAL",
          operator: "SINGLE",
          ipp_value: 1.05,
          requests: [
            {
              id: 101,
              state: "PENDING",
              configurations: [
                {
                  type: "EXPOSE",
                  instrument_type: "Imaging Camera",
                  target: {
                    name: "HD 209458",
                    type: "ICRS",
                    ra: 330.795,
                    dec: 18.884
                  },
                  constraints: {
                    max_airmass: 1.6,
                    min_lunar_distance: 30.0
                  }
                }
              ],
              windows: [
                {
                  start: "2025-07-01T18:00:00Z",
                  end: "2025-07-01T22:00:00Z"
                }
              ]
            }
          ]
        },
        2: {
          id: 2,
          name: "Asteroid Light Curve",
          proposal: "Asteroid Light Curve Analysis",
          state: "COMPLETED", 
          created: "2025-06-20T14:15:00Z",
          submitter: "demo_user",
          observation_type: "NORMAL",
          operator: "SINGLE",
          ipp_value: 1.0,
          requests: [
            {
              id: 201,
              state: "COMPLETED",
              configurations: [
                {
                  type: "EXPOSE",
                  instrument_type: "Imaging Camera",
                  target: {
                    name: "Asteroid 433 Eros",
                    type: "ICRS",
                    ra: 45.123,
                    dec: 12.345
                  },
                  constraints: {
                    max_airmass: 1.8,
                    min_lunar_distance: 45.0
                  }
                }
              ],
              windows: [
                {
                  start: "2025-06-22T20:00:00Z",
                  end: "2025-06-23T02:00:00Z"
                }
              ]
            }
          ]
        },
        3: {
          id: 3,
          name: "Variable Star Monitoring",
          proposal: "Exoplanet Characterization Study",
          state: "PENDING",
          created: "2025-06-28T09:45:00Z",
          submitter: "demo_user",
          observation_type: "NORMAL",
          operator: "SINGLE",
          ipp_value: 1.1,
          requests: [
            {
              id: 301,
              state: "PENDING",
              configurations: [
                {
                  type: "EXPOSE",
                  instrument_type: "Spectrograph",
                  target: {
                    name: "RR Lyrae",
                    type: "ICRS",
                    ra: 280.456,
                    dec: -25.678
                  },
                  constraints: {
                    max_airmass: 1.5,
                    min_lunar_distance: 60.0
                  }
                }
              ],
              windows: [
                {
                  start: "2025-07-05T19:00:00Z",
                  end: "2025-07-05T23:00:00Z"
                }
              ]
            }
          ]
        }
      };
      
      this.requestgroup = mockData[this.id] || {
        id: this.id,
        name: "Unknown Request Group",
        proposal: "Unknown Proposal",
        state: "UNKNOWN",
        created: new Date().toISOString(),
        submitter: "unknown",
        observation_type: "NORMAL",
        operator: "SINGLE",
        ipp_value: 1.0,
        requests: []
      };
    },
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
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    findRequestById(requestId) {
      // Find the request in the current requestgroup by id
      return (this.requestgroup.requests || []).find(r => String(r.id) === String(requestId)) || {};
    }
  },
};
</script>

<style lang="scss" scoped>
.mock-requestgroup-detail {
  .card {
    border: none;
    border-radius: 8px;
  }
  
  .badge {
    font-size: 0.9rem;
    padding: 0.5rem 0.8rem;
  }
}
</style>
