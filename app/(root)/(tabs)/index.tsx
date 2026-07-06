import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Text } from "react-native";
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
      <FlatList />
    </SafeAreaView>
  );
}
