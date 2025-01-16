import { flow, identity, Struct } from "effect"
import db from "../../../db"
import { AdvocatesTable } from "../../../db/schema"
import { advocateData } from "../../../db/seed/advocates"
import * as Db from 'drizzle-orm'

export async function POST() {
  // LMAO, @Tom Marren you maniac this bit where y'all were inserting an array of strings
  // into a jsonb column BUT ENCODING IT AS A STRING INSTEAD OF A JSON ARRAY is great!
  // Very tricky. Took me a minute to figure out what the hell was going on and why my
  // queries weren't working quite right.

  const records = await db
    .insert(AdvocatesTable)
    .values(advocateData)
    .returning()

  return Response.json({ advocates: records })
}
