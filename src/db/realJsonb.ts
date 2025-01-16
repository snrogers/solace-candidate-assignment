import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";

/** Custom Type for Drizzle-ORM to handle JSONB columns
 *  See: https://github.com/drizzle-team/drizzle-orm/pull/666#issuecomment-1809339114 */
export const realJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: TData }>({
    dataType() {
      return 'jsonb'
    },
    toDriver(val: TData) {
      return sql`(((${JSON.stringify(val)})::jsonb)#>> '{}')::jsonb`
    },
    fromDriver(value): TData {
      return value as TData
    },
  })(name)
