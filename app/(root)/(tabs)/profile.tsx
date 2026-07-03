import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
  return (
    <SafeAreaView>
      <Text>Profile</Text>

      <TouchableOpacity onPress={handleSignOut} className="flex p-2 bg-red-500 rounded-md">
        <Text className="font-semibold text-white text-center">Sign Out</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}
