import { runDatabaseSeed } from "../src/server/seed/run-database-seed";

async function main() {
  console.log("Seeding database...");
  const result = await runDatabaseSeed({
    clearExisting: true,
    targetCount: 1000,
    includeReviews: true,
  });
  console.log("Seed complete:", result);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

