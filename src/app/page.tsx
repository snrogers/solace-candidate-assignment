"use client"

import { Advocate, AdvocateSchema } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { ChangeEventHandler, use, useCallback, useEffect, useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { Array, Effect, Record, Schema, Struct, pipe } from "effect"
import { useParams, useRouter } from "next/navigation"

import AdvocatesTableHeaderRow from "./AdvocatesTableHeaderRow"
import AdvocatesTableRow from "./AdvocatesTableRow"
import AdvocatesTableRowLoading from "./AdvocatesTableRowLoading"
import AdvocatesSearchInput from "./AdvocatesSearchInput"
import { useAdvocates } from "./useAdvocates"
import { PaginationControls } from "./PaginationControls"

const PAGE_SIZE = 10

// ----------------------------------------------------------------- //
// Component
// ----------------------------------------------------------------- //
type HomeState = {
  searchTerm: string
  pageNumber?: string
}
type HomeProps = {
  searchParams: HomeState
}
export default function Home(props: HomeProps) {
  const { searchParams } = props;
  const { searchTerm } = searchParams;
  const pageNumber = Number(searchParams.pageNumber ?? 0);

  const router = useRouter();

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      if (searchTerm === '') return router.replace(`/?${new URLSearchParams({ pageNumber: String(pageNumber) })}`)
      else return router.replace(`/?${new URLSearchParams({ searchTerm, pageNumber: String(pageNumber) })}`)
    },
    [router, pageNumber]
  )

  const setSearchPage = useCallback(
    (page: number) => router.replace(`/?${new URLSearchParams({ searchTerm, pageNumber: String(page) })}`),
    [router, searchTerm]
  )

  const { advocates, error, isLoading, isInitializing, totalCount } = useAdvocates({
    searchTerm,
    page: pageNumber,
    limit: PAGE_SIZE,
  })

  const numAdvocates  = advocates?.length ?? 0
  const startRangeStr = numAdvocates === 0
                        ? 0
                        : String(pageNumber * PAGE_SIZE + 1)
  const endRangeStr   = String(Math.min(pageNumber * PAGE_SIZE + numAdvocates, totalCount ?? Number.POSITIVE_INFINITY))

  // ----------------------------------------------------------------- //
  // View
  // ----------------------------------------------------------------- //
  return (
    <main className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Solace Advocates</h1>
        <p className="text-muted-foreground">Manage and view all advocate profiles</p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <AdvocatesSearchInput
            onChange={setSearchTerm}
            isLoading={isLoading}
            value={searchTerm}
          />

          { !isLoading && (
            <p className="text-sm text-muted-foreground ml-4">
              Showing results {startRangeStr} - {endRangeStr} of {totalCount}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <PaginationControls
          currentPage={pageNumber}
          totalPages={Math.ceil((totalCount ?? 0) / PAGE_SIZE)} // Assuming 10 items per page
          onPageChange={setSearchPage}
          isLoading={isLoading}
        />

        <table className="w-full">
          <thead className="bg-muted/50">
            <AdvocatesTableHeaderRow />
          </thead>

          <tbody>
            { error && <tr><td colSpan={7} style={{ color: "red", whiteSpace: "pre-wrap" }}>{error.message}</td></tr> }
            { isInitializing
              ? <>
                  <AdvocatesTableRowLoading />
                  <AdvocatesTableRowLoading />
                  <AdvocatesTableRowLoading />
                  <AdvocatesTableRowLoading />
                </>
              : advocates?.length === 0
                ? <tr><td colSpan={7}>No results found</td></tr>
                : advocates?.map(
                    (advocate) => <AdvocatesTableRow key={advocate.id} advocate={advocate} />
                  )
            }
          </tbody>
        </table>

        <PaginationControls
          currentPage={pageNumber}
          totalPages={Math.ceil((advocates?.length ?? 0) / 10)} // Assuming 10 items per page
          onPageChange={setSearchPage}
          isLoading={isLoading}
        />
      </div>
    </main>
  )
}
