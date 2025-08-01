<template>
  <div class="mock-observations-table">
    <h2 class="mb-4">Observations</h2>
    <div v-if="filtered">
      <b-alert show variant="info" class="mb-3">
        Showing only selected observations.
        <b-button size="sm" variant="outline-secondary" class="ml-2" @click="clearFilter">Clear Filter</b-button>
      </b-alert>
    </div>
    <b-table
      :items="filteredObservations"
      :fields="tableFields"
      striped
      hover
      responsive
      class="shadow-sm"
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
      <template v-slot:cell(scheduled)="data">
        {{ data.item.scheduled || 'Unknown' }}
      </template>
      <template v-slot:cell(actions)="data">
        <b-button size="sm" variant="success" @click="markCompleted(data.item.id)">Completed</b-button>
        <b-button size="sm" variant="danger" @click="deleteObservation(data.item.id)">Delete</b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "ObservationsList",
  data() {
    return {
      tableFields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'site', label: 'Site', sortable: true },
        { key: 'enclosure', label: 'Enc.', sortable: true },
        { key: 'telescope', label: 'Tel.', sortable: true },
        { key: 'start', label: 'Start', sortable: true },
        { key: 'end', label: 'End', sortable: true },
        { key: 'request_id', label: 'Req.ID', sortable: true },
        { key: 'target', label: 'Target', sortable: true },
        { key: 'instruments', label: 'Instruments', sortable: false },
        { key: 'modified', label: 'Modified', sortable: true },
        { key: 'scheduled', label: 'Scheduled Time', sortable: true },
        { key: 'actions', label: 'Actions (by moderator if needed)', sortable: false }
      ],
      mockObservations: [
        { id: 2001, site: 'MAO', enclosure: 'ENC1', telescope: '2.5m', target: 'M1', instruments: ['PARAS 2'], start: '2025-07-01T18:00:00Z', end: '2025-07-01T22:00:00Z', request_id: 101, modified: '2025-07-01T22:10:00Z', scheduled: '25 Jun 2025, 21:30 IST' },
        { id: 2002, site: 'MAO', enclosure: 'ENC2', telescope: '2.5m', target: 'M57', instruments: ['PROTOPOL'], start: '2025-07-02T19:00:00Z', end: '2025-07-02T23:00:00Z', request_id: 102, modified: '2025-07-02T23:10:00Z', scheduled: '26 Jun 2025, 22:15 IST' },
        { id: 2003, site: 'MAO', enclosure: 'ENC1', telescope: '1.5m', target: 'M8', instruments: ['NICS'], start: '2025-07-03T20:00:00Z', end: '2025-07-03T23:30:00Z', request_id: 103, modified: '2025-07-03T23:40:00Z', scheduled: '27 Jun 2025, 23:45 IST' },
        { id: 2004, site: 'MAO', enclosure: 'ENC2', telescope: '1.5m', target: 'TAUCETI', instruments: ['EM-CCD'], start: '2025-07-04T18:30:00Z', end: '2025-07-04T22:30:00Z', request_id: 104, modified: '2025-07-04T22:40:00Z', scheduled: '28 Jun 2025, 20:00 IST' },
        { id: 2005, site: 'MAO', enclosure: 'ENC1', telescope: '50cm', target: 'OP313', instruments: [], start: '2025-07-05T19:30:00Z', end: '2025-07-05T23:30:00Z', request_id: 105, modified: '2025-07-05T23:40:00Z', scheduled: '29 Jun 2025, 01:30 IST' },
        { id: 2006, site: 'MAO', enclosure: 'ENC2', telescope: '43cm', target: 'MR421', instruments: [], start: '2025-07-06T20:00:00Z', end: '2025-07-06T23:00:00Z', request_id: 106, modified: '2025-07-06T23:10:00Z', scheduled: '30 Jun 2025, 03:00 IST' },
      ]
    };
  },
  computed: {
    filteredObservations() {
      let allObs = [...this.mockObservations];
      if (typeof window !== 'undefined' && window.submittedObservations) {
        allObs = allObs.concat(window.submittedObservations);
      }
      const obsParam = this.$route.query.obs;
      if (obsParam) {
        const ids = obsParam.split(',').map(x => parseInt(x, 10));
        return allObs.filter(o => ids.includes(o.id));
      }
      return allObs;
    },
    filtered() {
      return !!this.$route.query.obs;
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
    clearFilter() {
      this.$router.push({ name: 'observations' });
    },
    deleteObservation(id) {
      // Remove from mockObservations
      this.mockObservations = this.mockObservations.filter(o => o.id !== id);
      // Remove from submittedObservations in window and localStorage
      if (typeof window !== 'undefined' && window.submittedObservations) {
        window.submittedObservations = window.submittedObservations.filter(o => o.id !== id);
        localStorage.setItem('submittedObservations', JSON.stringify(window.submittedObservations));
      }
    },
    markCompleted(id) {
      // Mark the observation as completed in mockObservations
      const obs = this.mockObservations.find(o => o.id === id);
      if (obs) {
        obs.status = 'COMPLETED';
      }
      // Also update in submittedObservations if present
      if (typeof window !== 'undefined' && window.submittedObservations) {
        const subObs = window.submittedObservations.find(o => o.id === id);
        if (subObs) {
          subObs.status = 'COMPLETED';
          localStorage.setItem('submittedObservations', JSON.stringify(window.submittedObservations));
        }
      }
    }
  },
  created() {
    if (typeof window !== 'undefined') {
      const obs = localStorage.getItem('submittedObservations');
      window.submittedObservations = obs ? JSON.parse(obs) : [];
    }
  }
};
</script>

<style lang="scss" scoped>
.mock-observations-table {
  .table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }
  .badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
