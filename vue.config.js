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
  configureWebpack: () => {
    return {
      resolve: {
        alias: {
          // This is needed for jquery-file-download/src/Scripts/jquery.fileDownload.js to work
          jquery: path.join(__dirname, 'node_modules/jquery/src/jquery')
        }
      }
    };
  }
};
