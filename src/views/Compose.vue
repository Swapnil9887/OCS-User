<template>
  <b-container class="p-0">
    <b-tabs id="tabs" fill>
      <b-tab :active="tab == 1" @click="tab = 1">
        <template slot="title">
          <span><i class="far fa-edit" /> Form</span>
        </template>
        <b-container class="p-0 mt-2">
          <ocs-request-group-composition-form
            :value="requestGroup"
            :profile="profile"
            @input="updateRequestGroup"
            @submit.native.prevent="submitMockRequestGroup"
          />
        </b-container>
      </b-tab>
      <b-tab :active="tab == 2" @click="tab = 2">
        <template slot="title">
          <span><i class="fas fa-code" /> API View</span>
        </template>
        <b-container class="p-0 mt-2">
          <b-form-row>
            <b-col class="bg-light rounded">
              <ocs-request-group-api-display
                class="p-4"
                :request-group="requestGroup"
                :extra-download-button-attrs="{
                  class: 'float-right',
                  variant: 'primary',
                }"
              />
            </b-col>
          </b-form-row>
        </b-container>
      </b-tab>
      <b-tab :active="tab == 3" @click="tab = 3">
        <template slot="title">
          <span><i class="far fa-file-alt" /> Drafts</span>
        </template>
        <b-container class="p-0 mt-2">
          <b-form-row>
            <b-col>
              <ocs-request-group-drafts-table
                v-if="tab === 3"
                table-id="drafts-table"
                :observation-portal-api-base-url="observationPortalApiUrl"
                :extra-table-attrs="{ hover: true, striped: true }"
                show-extra-field
                extra-field-label="Load"
                show-delete-button
                :extra-delete-button-attrs="{ size: 'sm', variant: 'danger' }"
              >
                <template #extra-field-content="data">
                  <b-button
                    variant="primary"
                    size="sm"
                    @click="loadDraft(data.rowData.id)"
                  >
                    <i class="fa fa-download" />
                  </b-button>
                </template>
              </ocs-request-group-drafts-table>
            </b-col>
          </b-form-row>
        </b-container>
      </b-tab>
      <b-tab :active="tab == 4" @click="tab = 4">
        <template slot="title">
          <span><i class="far fa-edit" /> Form</span>
        </template>
        <b-container class="p-0 mt-2">
          <b-form @submit.prevent="submitCustomJsonForm">
            <b-form-group label="Name">
              <b-form-input v-model="customJsonForm.name" required />
            </b-form-group>
            <b-form-group label="Proposal">
              <b-form-input v-model="customJsonForm.proposal" required />
            </b-form-group>
            <b-form-group label="IPP Value">
              <b-form-input v-model="customJsonForm.ipp_value" type="number" step="any" required />
            </b-form-group>
            <b-form-group label="Operator">
              <b-form-select v-model="customJsonForm.operator" :options="['SINGLE','MANY']" required />
            </b-form-group>
            <b-form-group label="Observation Type">
              <b-form-select v-model="customJsonForm.observation_type" :options="['NORMAL','OTHER']" required />
            </b-form-group>
            <h5>Requests</h5>
            <div v-for="(req, rIdx) in customJsonForm.requests" :key="rIdx" class="mb-4 p-3 border rounded">
              <b-row>
                <b-col>
                  <b-form-group label="Acceptability Threshold">
                    <b-form-input v-model="req.acceptability_threshold" type="number" required />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Configuration Repeats">
                    <b-form-input v-model="req.configuration_repeats" type="number" />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Optimization Type">
                    <b-form-input v-model="req.optimization_type" />
                  </b-form-group>
                </b-col>
                <b-col cols="auto">
                  <b-button variant="danger" @click="removeJsonRequest(rIdx)">Remove Request</b-button>
                </b-col>
              </b-row>
              <h6>Configurations</h6>
              <div v-for="(conf, cIdx) in req.configurations" :key="cIdx" class="mb-2 p-2 border rounded">
                <b-row>
                  <b-col>
                    <b-form-group label="Type">
                      <b-form-input v-model="conf.type" />
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Instrument Type">
                      <b-form-input v-model="conf.instrument_type" />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-form-group label="Target Name">
                  <b-form-input v-model="conf.target.name" />
                </b-form-group>
                <b-form-group label="Target RA">
                  <b-form-input v-model="conf.target.ra" />
                </b-form-group>
                <b-form-group label="Target Dec">
                  <b-form-input v-model="conf.target.dec" />
                </b-form-group>
                <b-form-group label="Max Airmass">
                  <b-form-input v-model="conf.constraints.max_airmass" type="number" />
                </b-form-group>
                <b-form-group label="Min Lunar Distance">
                  <b-form-input v-model="conf.constraints.min_lunar_distance" type="number" />
                </b-form-group>
                <b-button variant="danger" @click="removeJsonConfiguration(rIdx, cIdx)">Remove Configuration</b-button>
              </div>
              <b-button variant="primary" @click="addJsonConfiguration(rIdx)">Add Configuration</b-button>
              <h6>Windows</h6>
              <div v-for="(win, wIdx) in req.windows" :key="wIdx" class="mb-2 p-2 border rounded">
                <b-form-group label="Start">
                  <b-form-input v-model="win.start" type="datetime-local" />
                </b-form-group>
                <b-form-group label="End">
                  <b-form-input v-model="win.end" type="datetime-local" />
                </b-form-group>
                <b-button variant="danger" @click="removeJsonWindow(rIdx, wIdx)">Remove Window</b-button>
              </div>
              <b-button variant="primary" @click="addJsonWindow(rIdx)">Add Window</b-button>
            </div>
            <b-button variant="success" @click="addJsonRequest">Add Request</b-button>
            <b-button type="submit" variant="primary" class="ml-3">Submit</b-button>
          </b-form>
        </b-container>
      </b-tab>
    </b-tabs>
  </b-container>
</template>
<script>
import $ from "jquery";
import Vue from "vue";

export default {
  name: "Compose",
  data: function () {
    return {
      tab: 1,
      draftId: -1,
      instruments: {},
      // The included example data uses the 'ogg' observatory
      siteCodeToColor: {
        ogg: "blue",
        elp: "#d62f83",
      },
      siteCodeToName: {
        ogg: "Test Observatory",
      },
      formConfig: {
        requestGroup: {
          panel: {
            title: "RequestGroup", // Override the default RequestGroup panel label
          },
          observation_type: {
            label: "Type", // Override the default Observation Type field label
            desc: "Choose the observation type", // Add a tooltip to the field with this text
            hide: false, // Set to true to hide the field in the form
          },
        },
      },
      requestGroup: {
        name: "",
        proposal: "",
        ipp_value: "",
        operator: "",
        observation_type: "",
        requests: [],
      },
      customJsonForm: {
        name: '',
        proposal: '',
        ipp_value: '',
        operator: 'SINGLE',
        observation_type: 'NORMAL',
        requests: [
          {
            acceptability_threshold: '',
            configuration_repeats: '',
            optimization_type: '',
            configurations: [
              {
                type: '',
                instrument_type: '',
                target: { name: '', ra: '', dec: '' },
                constraints: { max_airmass: '', min_lunar_distance: '' }
              }
            ],
            windows: [ { start: '', end: '' } ]
          }
        ]
      },
    };
  },
  created: function () {
    this.getInstruments();
    // Load submitted data from localStorage if present
    if (typeof window !== 'undefined') {
      const groups = localStorage.getItem('submittedRequestGroups');
      const obs = localStorage.getItem('submittedObservations');
      window.submittedRequestGroups = groups ? JSON.parse(groups) : [];
      window.submittedObservations = obs ? JSON.parse(obs) : [];
    }
  },
  computed: {
    observationPortalApiUrl: function () {
      return this.$store.state.urls.observationPortalApi;
    },
    profile: function () {
      return this.$store.state.profile;
    },
  },
  methods: {
    getInstruments: function () {
      $.ajax({
        url: `${this.observationPortalApiUrl}/api/instruments/`,
      }).done((response) => {
        this.instruments = response;
      });
    },
    onSaveDraftFailed: function (errorMessage) {
      if (!errorMessage) {
        errorMessage =
          "An unexpected error occured while saving draft, please wait a moment and try again.";
      }
      this.$store.commit("addMessage", {
        text: errorMessage,
        variant: "danger",
      });
    },
    onSaveDraftSucceeded: function (draftId) {
      this.$store.commit("addMessage", {
        text: "Draft id: " + draftId + " saved successfully",
        variant: "success",
      });
    },
    onRequestGroupSaved: function (requestGroupId) {
      this.$router.push({
        name: "requestgroupDetail",
        params: { id: requestGroupId },
      });
    },
    loadDraft: function (draftId) {
      this.draftId = draftId;
      this.tab = 1;
      $.ajax({
        url: `${this.observationPortalApiUrl}/api/drafts/${draftId}/`,
      })
        .done((response) => {
          this.requestGroup = {};
          Vue.nextTick(() => {
            this.requestGroup = JSON.parse(response.content);
            this.draftId = draftId;
          });
        })
        .fail(() => {
          this.$store.commit("addMessage", {
            text: `Failed to load draft ${draftId}`,
            variant: "danger",
          });
        });
    },
    updateRequestGroup(val) {
      this.requestGroup = val;
    },
    submitMockRequestGroup() {
      // Clone and assign a unique id
      const newRequestGroup = JSON.parse(JSON.stringify(this.requestGroup));
      newRequestGroup.id = Date.now();
      newRequestGroup.state = 'PENDING';
      newRequestGroup.created = new Date().toISOString();
      newRequestGroup.submitter = 'demo_user';
      // Generate mock observations for each request
      const newObservations = [];
      (newRequestGroup.requests || []).forEach((req, idx) => {
        const obs = {
          id: newRequestGroup.id * 100 + idx,
          site: req.site || 'N/A',
          enclosure: req.enclosure || 'N/A',
          telescope: req.telescope || 'N/A',
          start: req.windows && req.windows[0] ? req.windows[0].start : '',
          end: req.windows && req.windows[0] ? req.windows[0].end : '',
          request_id: newRequestGroup.id,
          proposal: newRequestGroup.proposal,
          instruments: req.configuration && req.configuration[0] && req.configuration[0].instrument_type ? [req.configuration[0].instrument_type] : [],
          modified: new Date().toISOString(),
          created: new Date().toISOString(),
        };
        newObservations.push(obs);
      });
      // Save to global arrays and localStorage
      window.submittedRequestGroups.push(newRequestGroup);
      window.submittedObservations.push(...newObservations);
      localStorage.setItem('submittedRequestGroups', JSON.stringify(window.submittedRequestGroups));
      localStorage.setItem('submittedObservations', JSON.stringify(window.submittedObservations));
      // Reset form
      this.requestGroup = {
        name: '', proposal: '', ipp_value: '', operator: '', observation_type: '', requests: [],
      };
      this.$bvToast && this.$bvToast.toast('Request submitted (mock mode)!', { variant: 'success', autoHideDelay: 3000 });
    },
    addJsonRequest() {
      this.customJsonForm.requests.push({
        acceptability_threshold: '',
        configuration_repeats: '',
        optimization_type: '',
        configurations: [
          { type: '', instrument_type: '', target: { name: '', ra: '', dec: '' }, constraints: { max_airmass: '', min_lunar_distance: '' } }
        ],
        windows: [ { start: '', end: '' } ]
      });
    },
    removeJsonRequest(idx) {
      this.customJsonForm.requests.splice(idx, 1);
    },
    addJsonConfiguration(rIdx) {
      this.customJsonForm.requests[rIdx].configurations.push({ type: '', instrument_type: '', target: { name: '', ra: '', dec: '' }, constraints: { max_airmass: '', min_lunar_distance: '' } });
    },
    removeJsonConfiguration(rIdx, cIdx) {
      this.customJsonForm.requests[rIdx].configurations.splice(cIdx, 1);
    },
    addJsonWindow(rIdx) {
      this.customJsonForm.requests[rIdx].windows.push({ start: '', end: '' });
    },
    removeJsonWindow(rIdx, wIdx) {
      this.customJsonForm.requests[rIdx].windows.splice(wIdx, 1);
    },
    submitCustomJsonForm() {
      // Find the next available group ID
      const allGroups = (window.submittedRequestGroups || []).concat(this.mockRequestGroups || []);
      const maxGroupId = allGroups.reduce((max, g) => Math.max(max, g.id || 0), 0);
      const groupId = maxGroupId + 1;

      // Build the new request group
      const newRequestGroup = JSON.parse(JSON.stringify(this.customJsonForm));
      newRequestGroup.id = groupId;
      newRequestGroup.state = 'PENDING';
      newRequestGroup.created = new Date().toISOString();
      newRequestGroup.submitter = 'demo_user';
      newRequestGroup.actions = [
        { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
        { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
        { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
        { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
        { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
      ];

      // Generate requests and observations
      let observationIds = [];
      const newObservations = [];
      newRequestGroup.requests.forEach((req, idx) => {
        // Request ID: e.g., 101, 201, 301, ...
        req.id = groupId * 100 + idx + 1;
        req.state = 'PENDING';
        req.actions = [
          { name: 'Force Now', key: 'force_now', description: 'Prioritize this request to the highest priority.' },
          { name: 'In Progress', key: 'in_progress', description: 'Mark this request as in progress.' },
          { name: 'Completed', key: 'completed', description: 'Mark this request as completed.' },
          { name: 'Terminated/Cancelled', key: 'terminated', description: 'Terminate or cancel this request.' },
          { name: 'Expired', key: 'expired', description: 'Mark this request as expired (window expired).' }
        ];
        // Observation ID: e.g., 1001, 2001, 3001, ...
        const obsId = req.id * 10 + 1;
        observationIds.push(obsId);
        // Generate observation
        const obs = {
          id: obsId,
          site: 'MAO',
          enclosure: 'ENC1',
          telescope: '1m0',
          start: req.windows && req.windows[0] ? req.windows[0].start : '',
          end: req.windows && req.windows[0] ? req.windows[0].end : '',
          request_id: req.id,
          proposal: newRequestGroup.proposal,
          instruments: req.configurations.map(c => c.instrument_type || 'Unknown'),
          modified: newRequestGroup.created,
          created: newRequestGroup.created
        };
        newObservations.push(obs);
      });
      newRequestGroup.observation_ids = observationIds;

      // Store in global arrays and localStorage
      window.submittedRequestGroups.push(newRequestGroup);
      window.submittedObservations.push(...newObservations);
      localStorage.setItem('submittedRequestGroups', JSON.stringify(window.submittedRequestGroups));
      localStorage.setItem('submittedObservations', JSON.stringify(window.submittedObservations));
      this.$bvToast && this.$bvToast.toast('Custom observation proposal submitted! It will now appear in Requests and Observations tabs.', { variant: 'success', autoHideDelay: 3000 });
      // Reset form
      this.customJsonForm = { name: '', proposal: '', ipp_value: '', operator: 'SINGLE', observation_type: 'NORMAL', requests: [ { acceptability_threshold: '', configuration_repeats: '', optimization_type: '', configurations: [ { type: '', instrument_type: '', target: { name: '', ra: '', dec: '' }, constraints: { max_airmass: '', min_lunar_distance: '' } } ], windows: [ { start: '', end: '' } ] } ] };
    },
  },
};
</script>
