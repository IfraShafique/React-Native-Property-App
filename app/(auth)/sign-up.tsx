import { useAuth, useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (error) {
      alert(error.message);
      return;
    }
    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => {},
      });
    }
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/logo.png")}
          className="h-24 w-40"
          resizeMode="contain"
        />
        <Text className="mb-2 text-3xl font-semibold text-gray-800">
          Verify Your Account
        </Text>
        <Text className="mb-6 text-lg text-gray-500">
          We&apos;ve sent a verification code to your {email}. Please enter it
          below.
        </Text>
        <TextInput
          className="mb-4 rounded-xl border border-gray-300 px-4 py-3"
          placeholder="Enter Verification Code"
          value={code}
          onChangeText={setCode}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="number-pad"
          editable={!isLoading}
        />
        {errors.fields.code && (
          <Text className="text-sm text-red-500">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}
          className="py-2"
        >
          <Text className="text-blue-600 font-semibold">
            Resend Verification Code
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/logo.png")}
          className="h-24 w-40"
          resizeMode="contain"
        />
        <Text className="mb-2 text-3xl font-semibold text-gray-800">
          Create Account
        </Text>
        <Text className="mb-6 text-lg text-gray-500">
          Find your dream home today
        </Text>

        <View className="mb-4 flex-row flex-wrap gap-3">
          <TextInput
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            editable={!isLoading}
          />
          <TextInput
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            editable={!isLoading}
          />
          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          {errors.fields.emailAddress && (
            <Text className="text-sm text-red-500">
              {errors.fields.emailAddress.message}
            </Text>
          )}

          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            editable={!isLoading}
          />
          {errors.fields.password && (
            <Text className="text-sm text-red-500">
              {errors.fields.password.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={onSignUpPress}
            disabled={isLoading}
            className="w-full bg-blue-600 py-4 rounded-xl items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Sign up</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/sign-in">
              <Text className="text-blue-600 font-semibold">Sign in</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </ScrollView>
  );
}
