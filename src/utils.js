import _ from 'lodash';
import $ from 'jquery';

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = $.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}


const tooltipConfig = {
  delay: {
    show: 500,
    hide: 100
  },
  trigger: 'hover'
};

let siteToColor = {
  tfn: '#263c6f', // dark blue
  elp: '#700000', // dark red
  lsc: '#f04e23', // red-orange
  cpt: '#004f00', // dark green
  coj: '#fac900', // golden-yellow
  ogg: '#3366dd', // sky blue
  sqa: '#009d00', // green
  tlv: '#8150d7', // purple
  sor: '#7EF5C9', // sea green
  ngq: '#FA5DEB' // magenta
};

let siteCodeToName = {
  tfn: 'Teide',
  elp: 'McDonald',
  lsc: 'Cerro Tololo',
  cpt: 'Sutherland',
  coj: 'Siding Spring',
  ogg: 'Haleakala',
  sqa: 'Sedgwick',
  ngq: 'Ali',
  sor: 'Cerro Pachón',
  tlv: 'Wise'
};


export {
  siteToColor,
  siteCodeToName,
  tooltipConfig,
  getCookie,
  csrfSafeMethod,
};
