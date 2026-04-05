/**
 * PM2 Ecosystem Configuration
 * Run all F1 Telemetry services with: pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'f1t-listener',
      script: './packages/listener/dist/index.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        UDP_PORT: '20777',
        WS_PORT: '3002',
        LOG_LEVEL: 'info',
      },
      log_file: './logs/listener.log',
      error_file: './logs/listener-error.log',
      out_file: './logs/listener-out.log',
      merge_logs: true,
    },
    {
      name: 'f1t-api',
      script: './packages/api/dist/index.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        API_PORT: '3001',
        LOG_LEVEL: 'info',
      },
      log_file: './logs/api.log',
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      merge_logs: true,
    },
    {
      name: 'f1t-dashboard',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './packages/dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        NEXT_PUBLIC_API_URL: 'http://localhost:3001',
        NEXT_PUBLIC_WS_URL: 'http://localhost:3002',
      },
      log_file: './logs/dashboard.log',
      error_file: './logs/dashboard-error.log',
      out_file: './logs/dashboard-out.log',
      merge_logs: true,
    },
  ],
};
