import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="w-72 mr-2 rounded-3xl overflow-hidden bg-white shadow-md shadow-black/80"
      onPress={() => router.push(`/(root)/(tabs)/property/${property.id}`)}
    >
      <Image
        source={property.images[0] ? { uri: property.images[0] } : require("@/assets/images/logo.png")}
        className="w-full h-44"
        resizeMode="cover"
      />

      <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full">
        <Text className="text-sm font-semibold text-blue-600 capitalize">
          {property.type}
        </Text>
      </View>

      {/* Sold Badge */}
      {property.is_sold && (
        <View className="absolute top-3 right-3 bg-red-500 px-2 py-1 rounded-full">
          <Text className="text-xs font-semibold text-white">Sold</Text>
        </View>
      )}

      <View className="p-4">
        <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
          {property.title}
        </Text>

        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={13} color="#6b7280" />
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {property.address}, {property.city}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-blue-600 font-bold">
            {formatPrice(property.price)}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={13} color="#6b7280" />
              <Text className="text-xs text-gray-500">{property.bedrooms}</Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="water-outline" size={13} color="#6b7280" />
              <Text className="text-xs text-gray-500">
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
