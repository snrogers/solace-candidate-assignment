import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

type AdvocatesDb = PostgresJsDatabase<typeof schema>

const DATABASE_URL = process.env.DATABASE_URL

const setup = (): AdvocatesDb => {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set")

  const queryClient = postgres(DATABASE_URL)
  const db = drizzle(queryClient, { schema, logger: true })
  return db
}

const db = setup()
export default db
