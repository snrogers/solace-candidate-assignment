import * as Db from 'drizzle-orm'
import { Array, Effect, Either, pipe, Schema } from "effect"
import { NextRequest, NextResponse } from "next/server"
import { PgSelectBase } from "drizzle-orm/pg-core"
import { runSyncSafe } from "@/lib/utils"

import db from "../../../db"
import { AdvocatesTable } from "../../../db/schema"
import { advocateData } from "../../../db/seed/advocates"

const AdvocatesIndexParamsSchema = Schema.Struct({
  limit: Schema.optional(Schema.Int),
  offset: Schema.optional(Schema.Int),
  searchTerm: Schema.optional(Schema.String),
})

const DEFAULT_PARAMS = {
  limit: 50,
  offset: 0,
}
export async function GET(req: NextRequest, res: NextResponse) {
  const { limit, offset, searchTerm } = parseSearchParams(req.nextUrl.searchParams)

  const advocatesQuery = pipe(
    db.select().from(AdvocatesTable),
    (q) => {
      if (searchTerm === undefined) return q
      else return withOmnisearch (searchTerm) (q)
    },
    (q) => q.limit(limit).offset(offset),
  )

  const advocatesCountQuery = pipe(
    db.select({ count: Db.count() }).from(AdvocatesTable),
    (a) => {
      if (searchTerm === undefined) return a
      return withOmnisearch (searchTerm) (a)
    }
  )

  const [advocates, counts] = await Promise.all([
    advocatesQuery.execute(),
    advocatesCountQuery.execute(),
  ])

  const data = { advocates, count: counts[0].count }

  return Response.json({ data })
}


// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //
/** Type constraint to allow any PgSelectBase type */
interface AnyPgSelectBase extends PgSelectBase<any, any, any, any, any, any, any, any> {}

function parseSearchParams(params: URLSearchParams) {
  const paramsAsObject = {
    searchTerm: params.get('searchTerm') || undefined,
    offset: Number(params.get('offset')) || 0,
    limit: Number(params.get('limit')) || undefined,
  }

  return pipe(
    paramsAsObject,
    Schema.validate(AdvocatesIndexParamsSchema),
    Effect.catchTag('ParseError', () => Effect.succeed({})),
    Effect.map((params) => ({ ...DEFAULT_PARAMS, ...params })),
    runSyncSafe,
  )
}

/** Omnisearch over
  * - firstName
  * - lastName
  * - city
  * - degree
  * - specialties
  * - yearsOfExperience */
function withOmnisearch(searchTerm: string) {
  return function<Q extends AnyPgSelectBase>(query: Q) {
    const searchPattern = `%${searchTerm}%`
    const specialtiesSearch = Db.sql`EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(${AdvocatesTable.specialties}) as specialty
      WHERE LOWER(specialty) LIKE LOWER(${searchPattern})
    )`

    const conditions = [
      Db.ilike(AdvocatesTable.firstName, searchPattern),
      Db.ilike(AdvocatesTable.lastName, searchPattern),
      Db.ilike(AdvocatesTable.city, searchPattern),
      Db.ilike(AdvocatesTable.degree, searchPattern),
      specialtiesSearch,
    ]

    const yearsNumber = Number(searchTerm)
    if (!isNaN(yearsNumber)) {
      conditions.push(Db.eq(AdvocatesTable.yearsOfExperience, yearsNumber))
    }

    return query.where(Db.or(...conditions))
  }
}
