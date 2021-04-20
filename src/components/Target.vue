<template>
  <panel
    :id="'target' + $parent.$parent.$parent.index + $parent.index"
    :show="show"
    :errors="errors"
    :canremove="false"
    :cancopy="false"
    icon="fas fa-crosshairs"
    title="Target"
    @show="show = $event"
  >
    <custom-alert v-for="error in errors.non_field_errors" :key="error" alertclass="danger" :dismissible="false">
      {{ error }}
    </custom-alert>
    <b-container class="p-0">
      <b-row>
        <b-col v-show="show" md="6">
        </b-col>
        <b-col :md="show ? 6 : 12">
          <b-form>
            <custom-field v-model="target.name" label="Name" field="name" :errors="errors.name" @input="update">
              <div v-show="lookingUP || lookupFail" slot="extra-help-text">
                <i v-show="lookingUP" class="fa fa-spinner fa-spin fa-fw" /> {{ lookupText }}
              </div>
            </custom-field>
            <custom-select
              v-if="!simpleInterface"
              v-model="target.type"
              label="Type"
              field="type"
              :errors="errors.type"
              :options="[
                { value: 'ICRS', text: 'Sidereal' },
                { value: 'ORBITAL_ELEMENTS', text: 'Non-Sidereal' }
              ]"
              @input="update"
            />
            <span v-show="target.type === 'ICRS'" class="sidereal">
              <custom-field
                v-model="ra_display"
                label="Right Ascension"
                field="ra"
                desc="Decimal degrees or HH:MM:SS.S"
                :errors="errors.ra"
                @blur="updateRA"
              >
                <div v-if="target.ra" slot="extra-help-text">
                  {{ ra_help_text }}
                </div>
              </custom-field>
              <custom-field
                v-model="dec_display"
                label="Declination"
                field="dec"
                desc="Decimal degrees or DD:MM:SS.S"
                :errors="errors.dec"
                @blur="updateDec"
              >
                <div v-if="target.dec" slot="extra-help-text">
                  {{ dec_help_text }}
                </div>
              </custom-field>
              <custom-field
                v-if="!simpleInterface"
                v-model="target.proper_motion_ra"
                label="Proper Motion RA"
                field="proper_motion_ra"
                desc="Units are milliarcseconds per year. Max 20000."
                :errors="errors.proper_motion_ra"
                @input="update"
              />
              <custom-field
                v-if="!simpleInterface"
                v-model="target.proper_motion_dec"
                label="Proper Motion Dec"
                field="proper_motion_dec"
                desc="Units are milliarcseconds per year. Max 20000."
                :errors="errors.proper_motion_dec"
                @input="update"
              />
              <custom-field
                v-if="!simpleInterface"
                v-model="target.epoch"
                label="Epoch"
                field="epoch"
                desc="Julian Years. Max 2100."
                :errors="errors.epoch"
                @input="update"
              />
              <custom-field
                v-if="!simpleInterface"
                v-model="target.parallax"
                label="Parallax"
                field="parallax"
                desc="+0.45 mas. Max 2000."
                :errors="errors.parallax"
                @input="update"
              />
            </span>
            <span v-show="target.type === 'ORBITAL_ELEMENTS'" class="non-sidereal">
              <custom-select
                v-model="target.scheme"
                label="Scheme"
                field="scheme"
                desc="The orbital elements scheme to use with this target"
                :errors="errors.scheme"
                :options="[
                  { value: 'MPC_MINOR_PLANET', text: 'MPC Minor Planet' },
                  { value: 'MPC_COMET', text: 'MPC Comet' },
                  { value: 'JPL_MAJOR_PLANET', text: 'JPL Major Planet' }
                ]"
                @input="update"
              />
              <custom-field
                v-model="target.epochofel"
                label="Epoch of Elements"
                field="epochofel"
                desc="The epoch of the orbital elements in MJD. MJD = JD - 2400000.5"
                :errors="errors.epochofel"
                @input="update"
              />
              <custom-field
                v-model="target.orbinc"
                label="Orbital Inclination"
                field="orbinc"
                :errors="errors.orbinc"
                desc="Angle in Degrees"
                @input="update"
              />
              <custom-field
                v-model="target.longascnode"
                label="Longitude of Ascending Node"
                field="longascnode"
                desc="Angle in Degrees"
                :errors="errors.longascnode"
                @input="update"
              />
              <custom-field
                v-model="target.argofperih"
                label="Argument of Perihelion"
                field="argofperih"
                desc="Angle in Degrees"
                :errors="errors.argofperih"
                @input="update"
              />
              <custom-field
                v-model="target.eccentricity"
                label="Eccentricity"
                field="eccentricity"
                desc="0 to 0.99"
                :errors="errors.eccentricity"
                @input="update"
              />
            </span>
            <span v-show="target.scheme === 'MPC_MINOR_PLANET' || target.scheme == 'JPL_MAJOR_PLANET'">
              <custom-field
                v-model="target.meandist"
                label="Semimajor Axis"
                field="meandist"
                desc="Astronomical Units (AU)"
                :errors="errors.meandist"
                @input="update"
              />
              <custom-field
                v-model="target.meananom"
                label="Mean Anomaly"
                field="meananom"
                desc="Angle in Degrees"
                :errors="errors.meananom"
                @input="update"
              />
            </span>
            <span v-show="target.scheme === 'JPL_MAJOR_PLANET'">
              <custom-field
                v-model="target.dailymot"
                label="Daily Motion"
                field="dailymot"
                desc="Degrees"
                :errors="errors.dailymot"
                @input="update"
              />
            </span>
            <span v-show="target.scheme === 'MPC_COMET'">
              <custom-field
                v-model="target.perihdist"
                label="Perihelion Distance"
                field="perihdist"
                desc="Astronomical Units (AU)"
                :errors="errors.perihdist"
                @input="update"
              />
              <custom-field
                v-model="target.epochofperih"
                label="Epoch of Perihelion"
                field="epochofperih"
                desc="Modified Juian Days"
                :errors="errors.epochofperih"
                @input="update"
              />
            </span>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </panel>
</template>
<script>
import _ from 'lodash';
import { OCSUtil } from 'ocs-component-lib';

import { collapseMixin, sexagesimalRaToDecimal, sexagesimalDecToDecimal, julianToModifiedJulian } from '@/utils.js';
import Panel from '@/components/util/Panel.vue';
import CustomAlert from '@/components/util/CustomAlert.vue';
import CustomField from '@/components/util/CustomField.vue';
import CustomSelect from '@/components/util/CustomSelect.vue';

export default {
  components: {
    CustomField,
    CustomSelect,
    Panel,
    CustomAlert,
  },
  mixins: [collapseMixin],
  props: {
    target: {
      type: Object,
      required: true
    },
    errors: {
      validator: function(value) {
        return value === null || typeof value === 'object';
      },
      required: true
    },
    simpleInterface: {
      type: Boolean
    },
    parentshow: {
      type: Boolean
    }
  },
  data: function() {
    let ns_target_params = {
      scheme: 'MPC_MINOR_PLANET',
      orbinc: null,
      longascnode: null,
      argofperih: null,
      eccentricity: null,
      meandist: null,
      meananom: null,
      perihdist: null,
      epochofperih: null
    };
    let sid_target_params = _.cloneDeep(this.target);
    delete sid_target_params['name'];
    delete sid_target_params['type'];
    return {
      show: true,
      lookingUP: false,
      lookupFail: false,
      lookupText: '',
      lookupReq: undefined,
      ns_target_params: ns_target_params,
      sid_target_params: sid_target_params,
      ra_display: this.target.ra,
      dec_display: this.target.dec,
      ra_help_text: this.raHelp(this.target.ra),
      dec_help_text: this.decHelp(this.target.dec)
    };
  },
  watch: {
    'target.type': function(value) {
      let that = this;
      if (value === 'ICRS') {
        for (let x in that.ns_target_params) {
          that.ns_target_params[x] = that.target[x];
          that.target[x] = undefined;
        }
        for (let y in that.sid_target_params) {
          that.target[y] = that.sid_target_params[y];
        }
      } else if (value === 'ORBITAL_ELEMENTS') {
        for (let z in this.sid_target_params) {
          that.sid_target_params[z] = that.target[z];
          that.target[z] = undefined;
        }
        for (let a in that.ns_target_params) {
          that.target[a] = that.ns_target_params[a];
        }
      }
    }
  },
  methods: {
    update: function() {
      this.$emit('targetupdate', {});
    },
    updateRA: function() {
      this.target.ra = sexagesimalRaToDecimal(this.ra_display);
      this.ra_help_text = this.raHelp(this.ra_display);
      this.update();
    },
    updateDec: function() {
      this.target.dec = sexagesimalDecToDecimal(this.dec_display);
      this.dec_help_text = this.decHelp(this.dec_display);
      this.update();
    },
    raHelp: function(ra) {
      if (isNaN(Number(ra))) {
        return 'Decimal: ' + Number(sexagesimalRaToDecimal(ra));
      } else {
        return 'Sexagesimal: ' + OCSUtil.decimalRaToSexigesimal(ra).str;
      }
    },
    decHelp: function(dec) {
      if (isNaN(Number(dec))) {
        return 'Decimal: ' + Number(sexagesimalDecToDecimal(dec));
      } else {
        return 'Sexagesimal: ' + OCSUtil.decimalDecToSexigesimal(dec).str;
      }
    }
  }
};
</script>
