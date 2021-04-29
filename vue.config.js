const path = require('path');

module.exports = {
  lintOnSave: false,
  transpileDependencies: ['pdf-lib', 'html2pdf.js'],
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Observation Portal';
      return args;
    });
  },
};
