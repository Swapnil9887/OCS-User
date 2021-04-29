<template>
  <div class="row request-details">
    <div class="col-md-12">
      <b-tabs content-class="mt-4" no-fade nav-class="nav-justified mt-3">

        <!-- Details tab -->
        <b-tab active @click="tab = 'details'">
          <template slot="title">
            <span title="Details about the observed request.">Details</span>
          </template>
          <div v-if="request.windows && request.windows.length != 0" class="row">
            <div class="col-md-12">
              <h4>Windows</h4>
              <ocs-request-windows-detail :windows="request.windows"></ocs-request-windows-detail>
            </div>
          </div>
          <div v-if="scheduled && scheduled.start" class="row">
            <div class="col-md-12">
              <h4>Scheduled</h4>
              <table class="table table-sm">
                <thead class="no-top-border">
                  <tr>
                    <td><strong>Start</strong></td>
                    <td><strong>End</strong></td>
                    <td><strong>Location</strong></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ scheduled.start | formatDate }}</td>
                    <td>{{ scheduled.end | formatDate }}</td>
                    <td>{{ scheduled.location }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <h4>Configurations</h4>
              <div role="tablist">
                <ocs-request-configurations-detail :configurations="request.configurations"></ocs-request-configurations-detail>
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Scheduling tab -->
        <b-tab @click="tab = 'scheduling'">
          <template slot="title">
            <span title="Scheduling history.">Scheduling</span>
          </template>
          <ocs-observation-history-plot
            v-show="observationData.length > 0"
            :data="observationData"
            show-plot-controls
            show-legend
            @observationClicked="onObservationClicked"
          />
          <div v-show="observationData.length < 1" class="text-center">
            <h3>This request has not been scheduled.</h3>
          </div>
        </b-tab>

        <!-- Visibility Tab -->
        <b-tab @click="tab = 'visibility'">
          <template slot="title">
            <span title="Target Visibility.">Visibility</span>
          </template>
          <ocs-airmass-plot
            v-show="'airmass_limit' in airmassData"
            ref="airmass"
            :data="airmassData"
            :site-code-to-color="siteToColor"
            :site-code-to-name="siteCodeToName"
            @rangechanged="updateAirmassRange"
            show-zoom-controls
            alignleft
          />
          <p v-if="!hasTarget" class="text-center text-secondary">
            Visibility data not available
          </p>
        </b-tab>

        <!-- TODO: connect archive client and add a data tab here -->

      </b-tabs>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import _ from 'lodash';
import { OCSUtil } from 'ocs-component-lib';
import axios from 'axios';

import { siteToColor, siteCodeToName } from '@/utils.js';

export default {
  name: 'App',
  props: {
    request: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      scheduled: {},
      frames: [],
      curFrame: null,
      observationData: [],
      activeObservation: {},
      airmassData: {},
      telescopeStatesData: {},
      tab: 'details',
      loadingColor: false,
      siteToColor: siteToColor,
      siteCodeToName: siteCodeToName,
    };
  },
  filters: {
    formatDate(val) {
      return OCSUtil.formatDate(val)
    }
  },
  computed: {
    observationPortalApiUrl: function() {
      return this.$store.state.urls.observationPortalApi;
    },
    hasTarget: function() {
      return this.request.configurations && this.request.configurations.length > 0 && !_.isEmpty(this.request.configurations[0].target);
    }
  },
  watch: {
    tab: function(tab) {
      if (tab === 'scheduling' && this.observationData.length === 0) {
        this.loadObservationData();
      } 
     if (tab === 'visibility') {
        if ($.isEmptyObject(this.airmassData)) {
          this.loadAirmassData();
        }
      }
    }
  },
  created: function() {
    let that = this;
    if (that.request.windows && that.request.windows.length === 0) {
      $.getJSON(that.observationPortalApiUrl + '/api/requests/' + that.request.id + '/observations/', function(observations) {
        let location = observations[0].site + '.' + observations[0].enclosure + '.' + observations[0].telescope;
        that.scheduled = {
          start: observations[0].start,
          end: observations[0].end,
          location: location
        };
      });
    }
  },
  methods: {
    isObjEmpty: function(obj) {
      return $.isEmptyObject(obj);
    },
    loadObservationData: function() {
      let that = this;
      $.getJSON(that.observationPortalApiUrl + '/api/requests/' + this.request.id + '/observations/', function(data) {
        that.observationData = data;
        for (let observationIdx in that.observationData) {
          if (that.observationData[observationIdx].status === 'COMPLETED') {
            that.activeObservation = that.observationData[observationIdx];
            break;
          } else if (that.observationData[observationIdx].status === 'SCHEDULED') {
            that.activeObservation = that.observationData[observationIdx];
          }
        }
        for (let observationIdx in that.observationData) {
          // Add in some top level fields that make plotting easier
          let time_completed = 0.0;
          let total_time = 0.0;
          let fail_reason = '';
          for (let csIndex in that.observationData[observationIdx].configuration_statuses) {
            let configurationStatus = that.observationData[observationIdx].configuration_statuses[csIndex];
            let summaryExists = !_.isEmpty(configurationStatus.summary);
            if (summaryExists) {
              fail_reason = that.getFailReason(fail_reason, configurationStatus.summary.reason);
            }
            // Find the configuration that goes with this configuration status
            let configuration;
            for (let cIndex in that.request.configurations) {
              if (that.request.configurations[cIndex].id === configurationStatus.configuration) {
                configuration = that.request.configurations[cIndex];
                break;
              }
            }
            if (configuration) {
              if (_.startsWith(configuration.type, 'REPEAT') && configuration.repeat_duration) {
                if (summaryExists) {
                  let start = new Date(configurationStatus.summary.start);
                  let end = new Date(configurationStatus.summary.end);
                  time_completed += (end - start) / 1000;
                }
                total_time += configuration.repeat_duration;
              } else {
                if (summaryExists) {
                  time_completed += configurationStatus.summary.time_completed;
                }
                for (let icIndex in configuration.instrument_configs) {
                  let instConfig = configuration.instrument_configs[icIndex];
                  total_time += instConfig.exposure_time * instConfig.exposure_count;
                }
              }
            }
          }
          let percentCompleted;
          if (total_time > 0) {
            percentCompleted = (time_completed / total_time) * 100.0;
          }
          that.observationData[observationIdx].percent_completed = percentCompleted;
          that.observationData[observationIdx].fail_reason = fail_reason;
        }
      });
    },
    getFailReason: function(currentFailReason, newFailReason) {
      let failReason = '';
      if (currentFailReason === '' && newFailReason !== 'N/A') {
        failReason = newFailReason;
      }
      return failReason;
    },
    loadAirmassData: function() {
      if (this.hasTarget) {
        let that = this;
        $.getJSON(that.observationPortalApiUrl + '/api/requests/' + this.request.id + '/airmass/', function(data) {
          that.airmassData = data;
        });
      }
    },
    updateAirmassRange: function(window) {
      this.$refs.airmass.updateWindow(window);
    },
    onObservationClicked: function(observationId) {
      this.$router.push({ name: 'observationDetail', params: { id: observationId } });
    }
  }
};
</script>
<style scoped>
.request-details {
  margin-top: 5px;
}
.no-top-border > tr > td {
  border-top: none;
}
.card-column-two {
  column-count: 2;
}
</style>
