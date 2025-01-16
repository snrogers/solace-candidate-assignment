import { Advocate, AdvocateSchema } from "@/db/schema"
import { debounceAsync } from "@/lib/utils"
import { Effect, pipe, Schema } from "effect"
import { useCallback, useEffect, useState } from "react"

type UseAdvocatesOpts = {
  searchTerm: string
  page?: number
  limit?: number
}

type UseAdvocatesResult = {
  advocates?: readonly Advocate[]
  isLoading: boolean
  isInitializing: boolean
  error?: Error,
  totalCount?: number
}

/** Fetches advocates from the database */
export function useAdvocates(opts: UseAdvocatesOpts): UseAdvocatesResult {
  const { page = 0, limit = 10, searchTerm } = opts

  const [state, setState] = useState<UseAdvocatesResult>(() => {
    return {
      isInitializing: true,
      isLoading: false,
    }
  })


  useEffect(() => {
    setState((st) => ({ ...st, isLoading: true }))

    const abortController = new AbortController()
    const offset = page * limit

    fetchAdvocates({ searchTerm, offset, limit, signal: abortController.signal })
      .then(({ advocates, count }) => setState((st) => ({
        ...st,
        advocates,
        totalCount: count,
        error: undefined
      })))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setState((st) => ({ ...st, error }))
      })
      .finally(() => {
        setState((st) => {
          return ({
            ...st,
            isInitializing: false,
            isLoading:      false
          })
        })
      })

    return () => abortController.abort()
  }, [page, limit, searchTerm])

  return state
}

// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //
const FetchResponseSchema = Schema.Struct({
  advocates: Schema.Array(AdvocateSchema),
  count: Schema.Int,
})
type FetchResponse = Schema.Schema.Type<typeof FetchResponseSchema>

type FetchAdvocatesOpts = {
  searchTerm?: string
  offset: number
  limit: number
  signal: AbortSignal
}
const fetchAdvocates = debounceAsync(
  async (opts: FetchAdvocatesOpts) => {
    const { offset, limit, searchTerm, signal } = opts

    const searchParams =
      searchTerm
      ? new URLSearchParams({ offset: String(offset), limit: String(limit), searchTerm })
      : new URLSearchParams({ offset: String(offset), limit: String(limit) })

    const response     = await fetch('/api/advocates?' + String(searchParams), { signal })
    const jsonResponse = await response.json()


    return pipe(
      jsonResponse.data,
      Schema.validate(FetchResponseSchema),
      Effect.runSync // TODO: handle errors explicitly?
    )
  },
  300
)
