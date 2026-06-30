import React from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";

export default function SignUp() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-40 h-24 mb-4"
          resizeMode="contain"
        />
        <Text className="text-2xl font-semibold text-gray-800 mb-2">
          Create Account
        </Text>
        <Text className="text-gray-500 mb-8">Find your dream home today</Text>

        <View className="flex-col gap-3 mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="First Name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Last Name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </View>
      </View>
    </ScrollView>
  );
}
