module.exports = {
  apps: [
    {
      name: 'verifit-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/mnt/hdd_sda/projects/VeriFit-Frontend/frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}
