import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useStore';
import { Property } from '@/types';
import { useAuth } from '@clerk/expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, FlatList, Alert } from 'react-native'

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
        )
    }

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
                <FlatList 
                data={property.images}
                renderItem={({ item }) => <View className="px-4 pt-4">
                    <Text className="text-2xl font-bold">{item.title}</Text>
                </View>}
                />
            </ScrollView>
        </View>
    )
}
