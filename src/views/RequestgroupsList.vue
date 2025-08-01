<template>
  <div class="mock-request-groups container-fluid px-0">
    <!-- Mock Request Groups Table -->
    <div v-if="filteredRequestGroups.length > 0">
      <h2 class="mb-4">Observation Requests</h2>
      <b-table
        :items="filteredRequestGroups"
        :fields="tableFields"
        striped
        hover
        responsive
        class="shadow-sm w-100"
        style="font-size: 1.05rem;"
      >
        <template v-slot:cell(target)="data">
          <router-link 
            :to="{ name: 'requestgroupDetail', params: { id: data.item.id } }"
            class="font-weight-bold text-primary"
          >
            {{ data.item.target }}
          </router-link>
        </template>
        
        <template v-slot:cell(proposal)="data">
          <span class="badge badge-info">{{ data.item.proposal }}</span>
        </template>
        
        <template v-slot:cell(state)="data">
          <b-badge :variant="getStateVariant(data.item.state)">
            {{ data.item.state }}
          </b-badge>
        </template>
        
        <template v-slot:cell(scheduled)="data">
          {{ data.item.scheduled || 'Unknown' }}
        </template>
        
        <template v-slot:cell(actions)="data">
          <b-button-group size="sm">
            <b-button 
              variant="outline-primary"
              @click="openObservationsModal(data.item)"
            >
              <i class="fas fa-eye"></i> View
            </b-button>
            <b-button 
              v-for="action in getAvailableActions(data.item)"
              :key="action.key"
              :variant="getActionVariant(action.key)"
              @click="performAction(data.item, action.key)"
              class="ml-1"
            >
              <i :class="getActionIcon(action.key)"></i> {{ action.name }}
            </b-button>
            <b-button
              v-if="data.item.state !== 'COMPLETED'"
              variant="success"
              size="sm"
              class="ml-1"
              @click="markRequestCompleted(data.item)"
            >
              Completed
            </b-button>
            <b-badge v-else variant="success" class="ml-1">Completed</b-badge>
          </b-button-group>
        </template>
      </b-table>
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-requests">
      <center>
        <h2>No observation requests found.</h2>
        <div v-if="!userIsAuthenticated">
          <p>
            Please log in to see existing requests, or submit a new
            observation request.
          </p>
        </div>
        <div v-else-if="profile.proposals.length > 0">
          <router-link
            class="btn btn-success btn-lg"
            :to="{ name: 'create' }"
          >
            Submit an Observation Request
          </router-link>
        </div>
        <div v-else>
          <h2>You are not a member of any proposals yet.</h2>
          <p>
            Only users with at least one active proposal may submit
            observation requests.
          </p>
        </div>
        <router-link
          v-if="!userIsAuthenticated"
          :to="{ name: 'login' }"
          class="btn btn-lg btn-primary"
        >
          Login
        </router-link>
      </center>
    </div>
    <b-modal v-model="showObservationsModal" size="xl" title="Observations & Details" hide-footer>
      <div v-if="selectedRequestGroup">
        <b-tabs>
          <b-tab title="Observations">
            <h4>{{ selectedRequestGroup.target }}</h4>
            <b-table
              :items="getObservationsForGroup(selectedRequestGroup)"
              :fields="observationFields"
              striped
              hover
              responsive
              class="shadow-sm"
              :tbody-tr-class="() => 'observation-row'"
            >
              <template v-slot:cell(id)="data">
                <span class="font-weight-bold text-primary">{{ data.item.id }}</span>
              </template>
              <template v-slot:cell(request_id)="data">
                <span class="text-primary">{{ data.item.request_id }}</span>
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
                  <request-detail :request="findRequestById(selectedRequestGroup, row.item.request_id)" />
                </div>
              </template>
            </b-table>
          </b-tab>
          <b-tab title="Request Group Details">
            <request-detail :request="selectedRequestGroup.requests[0]" />
          </b-tab>
        </b-tabs>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { clearAndSetErrorsMixin } from "@/clearAndSetErrorsMixin.js";
import RequestDetail from "@/components/RequestDetail.vue";

export default {
  name: "RequestgroupsList",
  components: { RequestDetail },
  mixins: [clearAndSetErrorsMixin],
  data() {
    return {
      tableFields: [
        { key: 'target', label: 'Target', sortable: true },
        { key: 'proposal', label: 'Proposal', sortable: true },
        { key: 'state', label: 'Status', sortable: true },
        { key: 'scheduled', label: 'Scheduled Time', sortable: true },
        { key: 'actions', label: 'Actions (by moderator if needed)', sortable: false }
      ],
      mockRequestGroups: [
        {
          id: 1,
          target: 'M1',
          proposal: "Exoplanet Characterization Study",
          state: "COMPLETED",
          scheduled: "25 Jun 2025, 21:30 IST",
          submitter: "demo_user",
          observation_type: "NORMAL",
          operator: "SINGLE",
          ipp_value: 1.05,
          observation_ids: [1001, 1004, 1007, 1010],
          actions: [
            { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
            { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
            { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
            { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
            { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
          ],
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
                  }
                }
              ]
            }
          ]
        },
        {
          id: 2,
          target: 'M57',
          proposal: "Asteroid Light Curve Analysis", 
          state: "COMPLETED",
          scheduled: "20 Jun 2025, 22:15 IST",
          submitter: "demo_user",
          observation_type: "NORMAL",
          operator: "SINGLE",
          ipp_value: 1.0,
          observation_ids: [1002, 1005, 1008],
          actions: [
            { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
            { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
            { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
            { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
            { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
          ],
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
                  }
                }
              ]
            }
          ]
        },
        {
          id: 3,
          target: 'M8',
          proposal: "Exoplanet Characterization Study",
          state: "PENDING",
          scheduled: "28 Jun 2025, 23:45 IST",
          submitter: "demo_user",
          observation_type: "NORMAL",
          operator: "SINGLE",
          ipp_value: 1.1,
          observation_ids: [1003, 1006, 1009],
          actions: [
            { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
            { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
            { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
            { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
            { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
          ],
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
                  }
                }
              ]
            }
          ]
        },
        {
          id: 4,
          target: 'TAUCETI',
          proposal: "Transient Events Program",
          state: "PENDING",
          scheduled: "1 Jul 2025, 20:00 IST",
          submitter: "astro_user",
          observation_type: "NORMAL",
          operator: "MANY",
          ipp_value: 2.0,
          observation_ids: [4001, 4002],
          actions: [
            { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
            { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
            { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
            { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
            { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
          ],
          requests: [
            { id: 401, state: "PENDING", configurations: [ { type: "EXPOSE", instrument_type: "Imaging Camera", target: { name: "SN2025abc", type: "ICRS", ra: 150.123, dec: 2.345 } } ] },
            { id: 402, state: "PENDING", configurations: [ { type: "EXPOSE", instrument_type: "Spectrograph", target: { name: "SN2025abc", type: "ICRS", ra: 150.123, dec: 2.345 } } ] }
          ]
        },
        {
          id: 5,
          target: 'OP313',
          proposal: "Solar System Science",
          state: "PENDING",
          scheduled: "3 Jul 2025, 01:30 IST",
          submitter: "lunar_team",
          observation_type: "OTHER",
          operator: "SINGLE",
          ipp_value: 1.8,
          observation_ids: [5001],
          actions: [
            { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
            { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
            { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
            { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
            { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
          ],
          requests: [
            { id: 501, state: "PENDING", configurations: [ { type: "EXPOSE", instrument_type: "Imaging Camera", target: { name: "Moon Limb", type: "ICRS", ra: 134.5, dec: -3.2 } } ] }
          ]
        },
        {
          id: 6,
          target: 'MR421',
          proposal: "Exoplanet Characterization Study",
          state: "PENDING",
          scheduled: "4 Jul 2025, 03:00 IST",
          submitter: "demo_user",
          observation_type: "NORMAL",
          operator: "MANY",
          ipp_value: 2.5,
          observation_ids: [6001, 6002, 6003],
          actions: [
            { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
            { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
            { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
            { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
            { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
          ],
          requests: [
            { id: 601, state: "PENDING", configurations: [ { type: "EXPOSE", instrument_type: "Spectrograph", target: { name: "HD 189733b", type: "ICRS", ra: 300.123, dec: 22.456 } } ] },
            { id: 602, state: "PENDING", configurations: [ { type: "EXPOSE", instrument_type: "Imaging Camera", target: { name: "HD 189733b", type: "ICRS", ra: 300.123, dec: 22.456 } } ] },
            { id: 603, state: "PENDING", configurations: [ { type: "EXPOSE", instrument_type: "Polarimeter", target: { name: "HD 189733b", type: "ICRS", ra: 300.123, dec: 22.456 } } ] }
          ]
        }
      ],
      showObservationsModal: false,
      selectedRequestGroup: null,
      observationFields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'site', label: 'Site', sortable: true },
        { key: 'enclosure', label: 'Enc.', sortable: true },
        { key: 'telescope', label: 'Telescope', sortable: true },
        { key: 'target', label: 'Target', sortable: true },
        { key: 'instruments', label: 'Instruments', sortable: false },
        { key: 'start', label: 'Start', sortable: true },
        { key: 'end', label: 'End', sortable: true },
        { key: 'modified', label: 'Modified', sortable: true },
        { key: 'scheduled', label: 'Scheduled Time', sortable: true }
      ],
      mockObservations: [
        { id: 2001, site: 'MAO', enclosure: 'ENC1', telescope: '2.5m', target: 'M1', instruments: ['PARAS 2','PROTOPOL','FOC','NSP','SPI'], start: '2025-07-01T18:00:00Z', end: '2025-07-01T22:00:00Z', request_id: 101, modified: '2025-07-01T22:10:00Z', scheduled: '2025-06-25T10:30:00Z' },
        { id: 2002, site: 'MAO', enclosure: 'ENC2', telescope: '2.5m', target: 'M57', instruments: ['PARAS 2','PROTOPOL','FOC','NSP','SPI'], start: '2025-07-02T19:00:00Z', end: '2025-07-02T23:00:00Z', request_id: 102, modified: '2025-07-02T23:10:00Z', scheduled: '2025-06-26T11:00:00Z' },
        { id: 2003, site: 'MAO', enclosure: 'ENC1', telescope: '1.5m', target: 'M8', instruments: ['PARAS 1','NICS','EM-CCD'], start: '2025-07-03T20:00:00Z', end: '2025-07-03T23:30:00Z', request_id: 103, modified: '2025-07-03T23:40:00Z', scheduled: '2025-06-27T12:00:00Z' },
        { id: 2004, site: 'MAO', enclosure: 'ENC2', telescope: '1.5m', target: 'TAUCETI', instruments: ['PARAS 1','NICS','EM-CCD'], start: '2025-07-04T18:30:00Z', end: '2025-07-04T22:30:00Z', request_id: 104, modified: '2025-07-04T22:40:00Z', scheduled: '2025-06-28T13:00:00Z' },
        { id: 2005, site: 'MAO', enclosure: 'ENC1', telescope: '50cm', target: 'OP313', instruments: [], start: '2025-07-05T19:30:00Z', end: '2025-07-05T23:30:00Z', request_id: 105, modified: '2025-07-05T23:40:00Z', scheduled: '2025-06-29T14:00:00Z' },
        { id: 2006, site: 'MAO', enclosure: 'ENC2', telescope: '43cm', target: 'MR421', instruments: [], start: '2025-07-06T20:00:00Z', end: '2025-07-06T23:00:00Z', request_id: 106, modified: '2025-07-06T23:10:00Z', scheduled: '2025-06-30T15:00:00Z' }
      ]
    };
  },
  computed: {
    observationPortalApiUrl: function () {
      return this.$store.state.urls.observationPortalApi;
    },
    profile: function () {
      return this.$store.state.profile;
    },
    userIsAuthenticated: function () {
      return this.$store.state.userIsAuthenticated;
    },
    allRequestGroups() {
      let allGroups = [...this.mockRequestGroups];
      if (typeof window !== 'undefined' && window.submittedRequestGroups) {
        allGroups = allGroups.concat(window.submittedRequestGroups);
      }
      return allGroups;
    },
    filteredRequestGroups() {
      // Filter out any group with proposal 'p001'
      return (this.allRequestGroups || this.mockRequestGroups).filter(rg => rg.proposal !== 'p001');
    }
  },
  methods: {
    onSuccess: function () {
      this.clearErrors();
    },
    onError: function (evt) {
      this.setErrorsOnFailedAJAXCall(evt);
    },
    generateRequestgroupLink: function (requestgroupId) {
      return {
        to: { name: "requestgroupDetail", params: { id: requestgroupId } },
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
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      // 24-hour format
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
    cancelRequest(requestId) {
      // Mock cancel functionality
      const request = this.mockRequestGroups.find(rg => rg.id === requestId);
      if (request) {
        request.state = 'CANCELED';
        this.$store.commit("addMessage", {
          text: `Request ${requestId} has been canceled`,
          variant: "success"
        });
      }
    },
    goToObservations(observationIds) {
      this.$router.push({ name: 'observations', query: { obs: observationIds.join(',') } });
    },
    openObservationsModal(requestGroup) {
      this.selectedRequestGroup = requestGroup;
      this.showObservationsModal = true;
    },
    getObservationsForGroup(requestGroup) {
      const reqIds = (requestGroup.requests || []).map(r => r.id);
      return this.mockObservations.filter(o => reqIds.includes(o.request_id));
    },
    findRequestById(requestGroup, requestId) {
      return (requestGroup.requests || []).find(r => String(r.id) === String(requestId)) || {};
    },
    getAvailableActions(item) {
      // Only show actions that are relevant for the current state
      if (!item.actions) return [];
      const state = item.state;
      const actions = item.actions;
      if (state === 'PENDING') {
        return actions.filter(a => ['force_now', 'in_progress', 'terminated', 'expired'].includes(a.key));
      } else if (state === 'IN_PROGRESS') {
        return actions.filter(a => ['completed', 'terminated', 'expired'].includes(a.key));
      } else if (state === 'COMPLETED' || state === 'CANCELED' || state === 'FAILED' || state === 'EXPIRED') {
        return [];
      }
      return actions;
    },
    getActionVariant(key) {
      switch (key) {
        case 'force_now': return 'outline-success';
        case 'in_progress': return 'outline-info';
        case 'completed': return 'outline-success';
        case 'terminated': return 'outline-danger';
        case 'expired': return 'outline-secondary';
        default: return 'outline-secondary';
      }
    },
    getActionIcon(key) {
      switch (key) {
        case 'force_now': return 'fas fa-bolt';
        case 'in_progress': return 'fas fa-spinner';
        case 'completed': return 'fas fa-check';
        case 'terminated': return 'fas fa-ban';
        case 'expired': return 'fas fa-clock';
        default: return 'fas fa-question';
      }
    },
    performAction(item, actionKey) {
      // Update the state of the request group based on the action
      if (actionKey === 'force_now') {
        // Set all other request groups to not be IN_PROGRESS
        this.allRequestGroups.forEach(rg => {
          if (rg.id !== item.id && rg.state === 'IN_PROGRESS') {
            if (rg.state !== 'COMPLETED' && rg.state !== 'CANCELED' && rg.state !== 'EXPIRED' && rg.state !== 'FAILED') {
              rg.state = 'PENDING';
            }
          }
        });
        // Set this request group to IN_PROGRESS and move to top
        item.state = 'IN_PROGRESS';
        // Move to top of the array
        const idx = this.allRequestGroups.findIndex(rg => rg.id === item.id);
        if (idx > 0) {
          this.allRequestGroups.splice(idx, 1);
          this.allRequestGroups.unshift(item);
        }
        // Persist changes if this is a submitted request group
        if (window.submittedRequestGroups) {
          const idx2 = window.submittedRequestGroups.findIndex(g => g.id === item.id);
          if (idx2 !== -1) {
            window.submittedRequestGroups[idx2] = item;
            localStorage.setItem('submittedRequestGroups', JSON.stringify(window.submittedRequestGroups));
          }
        }
        this.$store.commit("addMessage", {
          text: `Request ${item.id} is now prioritized and in progress!`,
          variant: "success"
        });
        return;
      }
      switch (actionKey) {
        case 'in_progress':
          item.state = 'IN_PROGRESS';
          break;
        case 'completed':
          item.state = 'COMPLETED';
          break;
        case 'terminated':
          item.state = 'CANCELED';
          break;
        case 'expired':
          item.state = 'EXPIRED';
          break;
        default:
          break;
      }
      // Persist changes if this is a submitted request group
      if (window.submittedRequestGroups) {
        const idx = window.submittedRequestGroups.findIndex(g => g.id === item.id);
        if (idx !== -1) {
          window.submittedRequestGroups[idx] = item;
          localStorage.setItem('submittedRequestGroups', JSON.stringify(window.submittedRequestGroups));
        }
      }
      this.$store.commit("addMessage", {
        text: `Action '${actionKey}' performed on request ${item.id}`,
        variant: "success"
      });
    },
    markRequestCompleted(item) {
      item.state = 'COMPLETED';
      // If using localStorage or window.submittedRequestGroups, update there as well
      if (typeof window !== 'undefined' && window.submittedRequestGroups) {
        const req = window.submittedRequestGroups.find(rg => rg.id === item.id);
        if (req) {
          req.state = 'COMPLETED';
          localStorage.setItem('submittedRequestGroups', JSON.stringify(window.submittedRequestGroups));
        }
      }
    }
  },
  created() {
    if (typeof window !== 'undefined') {
      const groups = localStorage.getItem('submittedRequestGroups');
      window.submittedRequestGroups = groups ? JSON.parse(groups) : [];
    }
  },
};
</script>

<style lang="scss" scoped>
.empty-requests {
  margin-top: 50px;
}

.mock-request-groups {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  .table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
  }
  
  .badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}

.btn-primary {
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
</style>
