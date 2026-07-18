// Déploiement RPi (PM2) — prérequis avant `pm2 start` :
// 1. Repo cloné + `pnpm install` sur le Pi
// 2. `.env.local` avec FOOTBALL_DATA_ORG_KEY (+ UPTIME_KUMA_PUSH_URL optionnel)
// 3. Clé de déploiement SSH dédiée ajoutée en "Deploy key" (write access) sur le repo GitHub,
//    remote `origin` de ce clone configuré en SSH pour l'utiliser
// 4. `git config user.name` / `user.email` définis sur le Pi
//
// Démarrage : pm2 start ecosystem.config.cjs && pm2 save
module.exports = {
  apps: [
    {
      name: "calendrier-ligue1-sync",
      script: "./node_modules/.bin/tsx",
      args: "scripts/sync-matches.ts --push",
      cwd: __dirname,
      // Cron déclenche l'exécution (lundi 6h) ; autorestart ne gère que les
      // échecs transitoires (réseau) entre deux déclenchements du cron.
      cron_restart: "0 6 * * 1",
      autorestart: true,
      max_restarts: 3,
      restart_delay: 60000,
      exp_backoff_restart_delay: 100,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
