import { create } from "zustand";

export type PropertyType = "apartment" | "house" | "villa" | "studio" | null;

interface FilterState {
  search: string;
  type: PropertyType;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (search: string) => void;
  setType: (type: PropertyType) => void;
  setBedrooms: (bedrooms: number | null) => void;
  setMinPrice: (minPrice: number | null) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  type: null,
  bedrooms: null,
  minPrice: null,
  maxPrice: null,

  setSearch: (search: string) => set({ search }),
  setType: (type: PropertyType) => set({ type }),
  setBedrooms: (bedrooms: number | null) => set({ bedrooms }),
  setMinPrice: (minPrice: number | null) => set({ minPrice }),
  setMaxPrice: (maxPrice: number | null) => set({ maxPrice }),
  resetFilters: () =>
    set({
      search: "",
      type: null,
      bedrooms: null,
      minPrice: null,
      maxPrice: null,
    }),
}));
