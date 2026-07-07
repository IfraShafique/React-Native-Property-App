import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data: featuredData  } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });
  
        const {data: recommendedData} = await supabase
          .from("properties")
          .select("*")
          .eq("is_featured", false)
          .order("created_at", { ascending: false });
  
          setFeatured(featuredData || []);
          setRecommended(recommendedData || []);
          setLoading(false);
      
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchProperties();
  }, []))

  return (
    <SafeAreaView>
      <FlatList 
      data={recommended}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 100}}
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={

        <View>
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
            <Image
              source={require('@/assets/images/logo.png')}
              className="w-32 h-24 rounded-lg"
              resizeMode="contain"
            />

            <View className="items-end">
              <Text className="text-lg font-bold">Good Morning 👏</Text>
              <Text className="text-gray-900 text-lg font-bold">{user?.user?.firstName ?? 'User'}</Text>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/search')}
            className="flex-row mx-5 mb-6 items-center bg-white rounded-2xl px-4 py-3 gap-3">
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <Text className="text-gray-400 text-sm flex-1">Search Properties Cities...</Text>
          </TouchableOpacity>

          {/* Feature Property Section */}

          {/* Recommended Header */}
          <Text className="text-lg font-bold px-5 mb-4">Recommended</Text>
        </View>
      }
      renderItem={({item}) => (
        <View className="px-5">
          <Text className="text-lg font-bold">{item.title}</Text>
        </View>
      )}
      ListEmptyComponent={
        !loading ? (
        <View className="items-center py-10">
          <Text className="text-gray-400 text-lg font-bold">No Properties Found</Text>
        </View>
      ) : null}
      />
    </SafeAreaView>
  );
}
