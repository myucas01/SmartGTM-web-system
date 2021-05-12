const deploy = process.env.NODE_DEPLOY || 'prod';
const envBase = require ('./env/env');
const envDeploy = require (`./env/env.${deploy}`);
console.log ('deploy:::', deploy);
const env = Object.assign (envBase, envDeploy);
console.log ('env:', env);
module.exports = {
  env,
  build: {
    assetsPublicPath: env.CDN_HOST,
  },

  dev: {
    assetsPublicPath: undefined,
    proxyTable: {
      '/api': {
        target: 'http://192.168.0.101:9999',
        // target: 'http://192.168.0.110:19999',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      '/user-api': {
        target: 'http://192.168.0.101:9997', //env.CNODE_HOST1,
        // target: 'http://192.168.0.110:9997',
        changeOrigin: true,
        pathRewrite: {
          '^/user-api': '/',
        },
      },
      '/bs-api': {
        target: 'http://192.168.0.101:7775',
        changeOrigin: true,
        pathRewrite: {
          '^/bs-api': '',
        },
      },
      '/ws-api': {
        target: 'ws://192.168.0.101:9999',
        // target: 'http://192.168.0.110:19999',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/ws-api': '',
        },
      },
    },
  },
};
