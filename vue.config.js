const path = require("path");

module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Observation Portal";
      return args;
    });
  },
  configureWebpack: () => {
    return {
      resolve: {
        alias: {
          // This is needed for aladin to work since it needs jquery to be available globally
          jquery: path.join(__dirname, "node_modules/jquery/src/jquery"),
        },
      },
    };
  },
};
