// TEMPORARY DIAGNOSTIC - restore real handler after debugging
export default async function handler(req, res) {
  const report = (name) => {
    const v = process.env[name];
    return {
      inKeys: Object.prototype.hasOwnProperty.call(process.env, name),
      type: typeof v,
      length: typeof v === 'string' ? v.length : null,
      blank: typeof v === 'string' ? v.trim() === '' : null
    };
  };
  res.status(200).json({
    vercelEnv: process.env.VERCEL_ENV || null,
    vercelUrl: process.env.VERCEL_URL || null,
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
    TURSO_DATABASE_URL: report('TURSO_DATABASE_URL'),
    TURSO_AUTH_TOKEN: report('TURSO_AUTH_TOKEN'),
    USER_PASSWORD: report('USER_PASSWORD'),
    ADMIN_PASSWORD: report('ADMIN_PASSWORD')
  });
}
