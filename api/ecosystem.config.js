module.exports = {
  apps: [
    {
      name: 'store-api',
      script: './dist/main.js',
      exec_mode: 'cluster',
      instances: 4,
      autorestart: true,
      watch: false,
    },
  ],
};
