import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Add migrations configuration
  migrations: {
    prefix: 'timestamp', // or 'id' if you prefer
    table: 'drizzle_migrations',
    schema: 'public'
  },
  // Adding recommended options for better stability
  verbose: true,
  strict: true
}); 