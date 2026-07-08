import { create } from "zustand";

export type PropertyType = "appartment" | "house" | "villa" | "studio" | null;

interface FilterState {
  search: string;
  type: PropertyType;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (search: string) => void;
  setType: (type: PropertyType) => void;
  setBedrooms: (bedrooms: number) => void;
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
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
  setBedrooms: (bedrooms: number) => set({ bedrooms }),
  setMinPrice: (minPrice: number) => set({ minPrice }),
  setMaxPrice: (maxPrice: number) => set({ maxPrice }),
  resetFilters: () =>
    set({
      search: "",
      type: null,
      bedrooms: null,
      minPrice: null,
      maxPrice: null,
    }),
}));
