import { PropertyType } from "@/store/filterStore";

export const TYPES_FILTERS: { label: string; value: PropertyType}[] = [
    { label: "All", value: null },
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Villa", value: "villa" },
    { label: "Studio", value: "studio" },
]

export const BEDS: { label: string; value: number | null }[] = [
    { label: "Any", value: null },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4+", value: 4 },
]

export const PRICE_PRESETS = [
    { label: "Under $50L", min: null, max: 5000000 },
    { label: "$50L - $1Cr", min: 5000000, max: 10000000 },
    { label: "$1Cr - $2Cr", min: 10000000, max: 20000000 },
    { label: "Above $2Cr", min: 20000000, max: null },
]