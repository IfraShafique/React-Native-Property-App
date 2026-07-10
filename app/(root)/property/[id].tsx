import { useSavedProperty } from "@/hooks/useSavedProperty";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useStore";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");
  const authSupabase = useSupabase();
  const { width } = Dimensions.get("window");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    setProperty(data);
    setLoading(false);
  };

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Property not found</Text>
      </View>
    );
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleDelete = () => {
    Alert.alert("Delete Property", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await authSupabase.from("properties").delete().eq("id", id);
          router.replace("/(root)/(tabs)");
        },
      },
    ]);
  };

  const handleMarkSold = () => {
    Alert.alert("Mark as Sold", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Sold",
        onPress: async () => {
          await authSupabase
            .from("properties")
            .update({ is_sold: true })
            .eq("id", id);
          setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 300 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
          </View>

          {/* Image count badge */}
          <View className="absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">
              {activeIndex + 1} / {property.images.length}
            </Text>
          </View>
          <SafeAreaView className="absolute top-0 left-0 right-0 bottom-0">
            <View className="flex-row items-center justify-between px-4 pt-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-white rounded-full items-center justify-center"
                style={{ elevation: 3 }}
              >
                <Ionicons name="arrow-back" size={20} color="#111827" />
              </TouchableOpacity>

              {/* save property */}
              <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                className="w-10 h-10 bg-white rounded-full items-center justify-center"
                style={{ elevation: 3 }}
              >
                <Ionicons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={20}
                  color={isSaved ? "#ef4444" : "#111827"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View
          className="px-5 pt-4 pb-8"
          style={{ opacity: property.is_sold ? 0.6 : 1 }}
        >
          <View className="flex-row gap-2 mb-3 flex-wrap">
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-xs font-semibold capitalize">
                {property.type}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
