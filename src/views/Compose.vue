<template>
  <b-container class="p-0">
    <b-tabs id="tabs" fill>
      <b-tab :active="tab == 1" @click="tab = 1">
        <template slot="title">
          <span><i class="far fa-edit" /> Form</span>
        </template>
        <b-container class="p-0 mt-2">
          <b-col>
            <ocs-request-group-composition-form
              :observation-portal-api-base-url="observationPortalApiUrl"
              :profile="profile"
              :instruments="instruments"
              :request-group="requestGroup"
              :form-config="formConfig"
              :site-code-to-color="siteCodeToColor"
              :site-code-to-name="siteCodeToName"
              show-airmass-plot
              :loaded-draft-id="draftId"
              @save-draft-failed="onSaveDraftFailed"
              @save-draft-succeeded="onSaveDraftSucceeded"
              @request-group-saved="onRequestGroupSaved"
            ></ocs-request-group-composition-form>
          </b-col>
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
        ipp_value: 1.05,
        operator: "SINGLE",
        observation_type: "NORMAL",
        requests: [
          {
            acceptability_threshold: "",
            configurations: [
              {
                type: "",
                instrument_type: "",
                instrument_configs: [
                  {
                    exposure_count: 1,
                    exposure_time: "",
                    mode: "",
                    rotator_mode: "",
                    extra_params: {
                      offset_ra: 0,
                      offset_dec: 0,
                    },
                    optical_elements: {},
                  },
                ],
                acquisition_config: {
                  mode: "",
                  extra_params: {},
                },
                guiding_config: {
                  mode: "",
                  optional: true,
                  extra_params: {},
                },
                target: {
                  name: "",
                  type: "ICRS",
                  ra: "",
                  dec: "",
                  proper_motion_ra: 0.0,
                  proper_motion_dec: 0.0,
                  epoch: 2000,
                  parallax: 0,
                },
                constraints: {
                  max_airmass: 1.6,
                  min_lunar_distance: 30.0,
                },
              },
            ],
            windows: [
              {
                start: "",
                end: "",
              },
            ],
            location: {
              telescope_class: "",
            },
          },
        ],
      },
    };
  },
  created: function () {
    this.getInstruments();
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
  },
};
</script>
