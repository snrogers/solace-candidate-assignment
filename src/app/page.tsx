"use client";

import { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import AdvocatesTableHeaderRow from "./AdvocatesTableHeaderRow";
import AdvocatesTableRow from "./AdvocatesTableRow";
import { Advocate } from "@/db/schema";
import AdvocatesTableRowLoading from "./AdvocatesTableRowLoading";


type HomeState = {
  advocates: Advocate[] | null;
  searchTerm: string | null;
};
export default function Home() {
  // ----------------------------------------------------------------- //
  // State
  // ----------------------------------------------------------------- //
  const [homeState, setHomeState] = useState<HomeState>({
    advocates:  null,
    searchTerm: null,
  });
  const { advocates, searchTerm } = homeState;
  const isLoading = advocates === null;

  console.log('ADVOCATES', advocates)

  const filteredAdvocates = useMemo(
    () => {
      if (!searchTerm) return advocates ?? [];

      const result = advocates?.filter((advocate) => {
        const smallSearchTerm = searchTerm.toLowerCase();
        const stringTerms = [
          advocate.firstName.toLowerCase(),
          advocate.lastName.toLowerCase(),
          advocate.city.toLowerCase(),
          advocate.degree.toLowerCase(),
          ...advocate.specialties.map((s) => s.toLowerCase()),
        ];

        return (
          stringTerms.some((term) => term.includes(smallSearchTerm))
          || advocate.yearsOfExperience >= Number(searchTerm) // TODO: Exact match? All the others are expansive, so keep this one expansive?
        )
      })

      return result ?? [];
    },
    [advocates, searchTerm]
  );

  const numFilteredAdvocates = filteredAdvocates.length;

  useEffect(() => {
    console.log("fetching advocates...");
    fetchAdvocates().then(
      (advocates) => setAdvocates(advocates),
      (error) => {
        alert("Error fetching advocates");
        console.error("Error fetching advocates:", error);
    });
  }, []);

  // ----------------------------------------------------------------- //
  // Actions
  // ----------------------------------------------------------------- //
  const fetchAdvocates = async () => {
    const response = await fetch("/api/advocates");
    const jsonResponse = await response.json();
    return jsonResponse.data;
  };

  const setAdvocates =
    (advocates: Advocate[]) => setHomeState({ ...homeState, advocates });
  const setSearchTerm =
    (searchTerm: string | null) => setHomeState({ ...homeState, searchTerm });

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const chosenSearchTerm = e.target.value;

    if (!chosenSearchTerm) setSearchTerm(null);
    else setSearchTerm(chosenSearchTerm);
  };

  const clearSearchTerm = () => setSearchTerm(null);

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
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search advocates..."
              onChange={onChange}
              className="pl-8"
              value={searchTerm || ''}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1.5 h-7 w-7 p-0"
                onClick={clearSearchTerm}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          { !isLoading && (
            <p className="text-sm text-muted-foreground ml-4">
              Showing {numFilteredAdvocates} results
            </p>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <AdvocatesTableHeaderRow />
          </thead>

          <tbody>
            { isLoading ? (
              <>
                <AdvocatesTableRowLoading />
                <AdvocatesTableRowLoading />
                <AdvocatesTableRowLoading />
                <AdvocatesTableRowLoading />
              </>
            ) : (
              filteredAdvocates.map(
                (advocate) => <AdvocatesTableRow key={advocate.id} advocate={advocate} />
              )
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
