import { useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { TYPES_FILTERS, BEDS, PRICE_PRESETS } from "@/constants/searchFilter";

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
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
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(
    (value) => value !== null,
  ).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full
    ${active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}`;

  const chipText = (active: boolean) =>
    `text-sm font-semibold ${active ? "text-white" : "text-gray-200 text-gray-600"}`;

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="flex-row justify-between items-center px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-gray-900">Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-sm text-blue-600 font-semibold">Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* property type */}
          <View>
            <Text className="text-base font-bold text-gray-800 mb-3">
              Property Type
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-6">
              {TYPES_FILTERS.map((item) => (
                <TouchableOpacity
                  key={String(item.value)}
                  onPress={() => setType(item.value)}
                  className={chip(type === item.value)}
                  style={shadow}
                >
                  <Text className={chipText(type === item.value)}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* bedrooms */}
          <View>
            <Text className="text-base font-bold text-gray-800 mb-3">
              Bedrooms
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-6">
              {BEDS.map((item) => (
                <TouchableOpacity
                  key={String(item.value)}
                  onPress={() => setBedrooms(item.value)}
                  className={`flex-1 items-center py-3 rounded-2xl border 
                    ${chip(bedrooms === item.value)}`}
                  style={shadow}
                >
                  <Text
                    className={`text-sm font-bold ${chipText(bedrooms === item.value)}`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price range */}
          <View>
            <Text className="text-base font-bold text-gray-800 mb-3">
              Price Range ($)
            </Text>

            <View className="flex-row gap-3 mb-4">
              {[
                {
                  label: "Min Price",
                  value: localMin,
                  onChange: setLocalMin,
                  placeholder: "0",
                },
                {
                  label: "Max Price",
                  value: localMax,
                  onChange: setLocalMax,
                  placeholder: "No limit",
                },
              ].map(({ label, value, onChange, placeholder }) => (
                <View key={label} className="flex-1">
                  <Text className="text-xs font-medium text-gray-500 mb-1.5">
                    {label}
                  </Text>
                  <View
                    className="flex-row items-center bg-white rounded-2xl px-3 border border-gray-200"
                    style={shadow}
                  >
                    <Text className="text-gray-400 text-sm mr-1">$</Text>
                    <TextInput
                      className="flex-1 py-3 text-gray-800"
                      value={value}
                      onChangeText={onChange}
                      placeholder={placeholder}
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}
            </View>

            <View className="flex-row flex-wrap gap-2 mb-6">
              {PRICE_PRESETS.map((p) => {
                const active = minPrice === p.min && maxPrice === p.max;
                return (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => {
                      setLocalMin(p.min ? String(p.min) : "");
                      setLocalMax(p.max ? String(p.max) : "");
                      setMinPrice(p.min);
                      setMaxPrice(p.max);
                    }}
                    className={`px-3 py-1.5 rounded-full border ${active ? "bg-blue-600 border-blue-300" : "bg-white border-gray-200"}`}
                    style={shadow}
                  >
                    <Text
                      className={`text-xs font-medium ${active ? "text-white" : "text-gray-500"}`}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View className="px-5 pb-8 pt-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-blue-600 rounded-2xl py-4 items-center shadow-md shadow-blue-200"
          >
            <Text className="text-sm font-semibold text-white text-center">
              Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
