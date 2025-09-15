module.exports = {
    apps: [
      {
        name: 'verifit-frontend',
        script: 'npm',
        args: 'run start -- -p 3000 -H 0.0.0.0',
        cwd: '/mnt/hdd_sda/projects/VeriFit-Frontend/frontend',
        env: {
          NODE_ENV: 'production',
          PORT: 3000,
          HOST: '0.0.0.0',
          NEXT_PUBLIC_API_URL: 'http://14.39.95.228:8000'
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
  