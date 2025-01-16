import { InferModel, InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";
import { Schema } from "effect";
import { realJsonb } from "./realJsonb";

export const AdvocatesTable = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: realJsonb("payload").default([]).notNull().$type<string[]>(), // TODO: Validation on this JSON field
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
})

export type AdvocateDbInsertModel = InferSelectModel<typeof AdvocatesTable>

export const AdvocateSchema = Schema.Struct({
  id:                Schema.Int,
  firstName:         Schema.String,
  lastName:          Schema.String,
  city:              Schema.String,
  degree:            Schema.String,
  specialties:       Schema.Array(Schema.String),
  yearsOfExperience: Schema.Int,
  phoneNumber:       Schema.Int,
  createdAt:         Schema.String,
})

export type Advocate = Schema.Schema.Type<typeof AdvocateSchema>
