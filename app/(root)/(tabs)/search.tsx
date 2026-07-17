import FilterModal from "@/components/FilterModal";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { act, useEffect, useState } from "react";
import {
    ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);

  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
  } = useFilterStore();

  //   const activeFilterCount = 2;
  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  useEffect(() => {
    fetchResults();
  }, [type, bedrooms, minPrice, maxPrice, search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      let query = supabase.from("properties").select("*");
      if (search) {
        query = query.or(`title.ilike.%${search}%, city.ilike.%${search}%`);
      }
      if (type) {
        query = query.eq("type", type);
      }
      if (bedrooms) {
        query = query.eq("bedrooms", bedrooms);
      }
      if (minPrice) {
        query = query.gte("price", minPrice);
      }
      if (maxPrice) {
        query = query.lte("price", maxPrice);
      }
      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        throw error;
      }

      setResults(data ?? []);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-graay-50">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-3xl font-bold text-gray-900 mb-4">
          Find Property
        </Text>
        <View className="flex-row items-center gap-3 overflow-visible">
          <View className="flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3 shadow-md shadow-black/80">
            <Ionicons name="search-outline" size={18} color="#9ca3af" />
            <TextInput
              className="flex-1 py-3 text-gray-800"
              placeholder="Search by title or city..."
              placeholderTextColor={"#9ca3af"}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={{
              position: "relative",
              width: 40,
              height: 40,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: activeFilterCount > 0 ? "#2563eb" : "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 2,
              overflow: "visible",
            }}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFilterCount > 0 ? "#fff" : "#374151"}
            />
            {activeFilterCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#dc2626",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 3,
                  zIndex: 10,
                  elevation: 10, // Android: ensure it draws above the button's own elevation
                }}
              >
                <Text
                  style={{ fontSize: 9, fontWeight: "bold", color: "#fff" }}
                >
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* filter chips */}
        {activeFilterCount > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {type && (
              <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
                <Text className="text-blue-700 text-xs font-semibold capitalize">
                  {type}
                </Text>
                <TouchableOpacity onPress={() => setType(null)}>
                  <Ionicons name="close" size={12} color="#1d4ed8" />
                </TouchableOpacity>
              </View>
            )}

            {bedrooms !== null && (
              <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
                <Ionicons name="bed-outline" size={12} color="#1d4ed8" />
                <Text className="text-blue-700 text-xs font-semibold capitalize">
                  {bedrooms === 4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                </Text>
                <TouchableOpacity onPress={() => setBedrooms(null)}>
                  <Ionicons name="close" size={12} color="#1d4ed8" />
                </TouchableOpacity>
              </View>
            )}

            {minPrice !== null ||
              (maxPrice !== null && (
                <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
                  <Ionicons name="bed-outline" size={12} color="#1d4ed8" />
                  <Text className="text-blue-700 text-xs font-semibold capitalize">
                    {minPrice && maxPrice
                      ? `$${formatPrice(minPrice)} - $${formatPrice(maxPrice)}`
                      : minPrice
                        ? `From $${formatPrice(minPrice)}`
                        : `Up to $${formatPrice(maxPrice!)}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setMinPrice(null);
                      setMaxPrice(null);
                    }}
                  >
                    <Ionicons name="close" size={12} color="#1d4ed8" />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="text-sm text-gray-400 mb-4">
            {loading ? <ActivityIndicator size="small" color="#2563eb" className="items-center" /> : `Found ${results.length} properties`}
          </Text>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400 text-lg font-bold">
                No Properties Found
              </Text>
              <Text className="text-gray-400 text-sm">
                Try different search terms or adjust your filters
              </Text>
            </View>
          ) : <ActivityIndicator size="large" color="#2563eb" className=" py-20" />
        }
      />

      {/* Filter modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}
