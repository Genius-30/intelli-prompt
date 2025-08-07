module.exports = {
  apps: [
    {
      name: "next-app",
      script: "./node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
        args: "dev",
      },
    },
    {
      name: "email-worker",
      script: "./node_modules/.bin/tsx",
      args: "src/lib/emailWorker.ts",
      env: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
