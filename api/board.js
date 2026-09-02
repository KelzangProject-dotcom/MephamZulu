// TEMPORARY DIAGNOSTIC - restore real handler after debugging
export default async function handler(req, res) {
  const allKeys = Object.keys(process.env).sort();
  res.status(200).json({
    node: process.version,
    vercelEnv: process.env.VERCEL_ENV || null,
    matchingKeys: allKeys.filter((k) => /TURSO|PASSWORD|USER|ADMIN/i.test(k)),
    totalKeys: allKeys.length,
    nonSystemKeys: allKeys.filter((k) => !/^(VERCEL|AWS|LAMBDA|NODE|PATH|_|LANG|LD_|TZ|PWD|HOME|SHLVL|NOW_)/i.test(k))
  });
}
