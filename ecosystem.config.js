module.exports = {
  apps: [
    {
      name: 'verifit-frontend',
      script: 'npm',
      args: 'run dev -- -H 0.0.0.0 -p 3000',
      cwd: '/mnt/hdd_sda/projects/VeriFit-Frontend/frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0',
        NODE_OPTIONS: '--dns-result-order=ipv4first',
        BACKEND_HOST: process.env.BACKEND_HOST || 'localhost',
        BACKEND_PORT: process.env.BACKEND_PORT || 8000,
        NEXT_PUBLIC_API_URL_1: 'http://192.168.0.21:8000',
        NEXT_PUBLIC_API_URL_2: 'http://14.39.95.228:8000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0',
        NODE_OPTIONS: '--dns-result-order=ipv4first',
        BACKEND_HOST: process.env.BACKEND_HOST || 'localhost',
        BACKEND_PORT: process.env.BACKEND_PORT || 8000,
        NEXT_PUBLIC_API_URL_1: 'http://192.168.0.21:8000',
        NEXT_PUBLIC_API_URL_2: 'http://14.39.95.228:8000'
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
