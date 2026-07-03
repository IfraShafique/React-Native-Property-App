import { useSignIn } from "@clerk/expo";
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

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) {
          console.log(session.currentTask);
        }
      },
    });
  };

  const sendVerificationCode = async () => {
    const emailCodeFactor = signIn.supportedSecondFactors?.find(
      (factor) => factor.strategy === "email_code",
    );
    if (emailCodeFactor) {
      await signIn.mfa.sendEmailCode();
    } else {
      await signIn.mfa.sendPhoneCode();
    }
  };

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }

    if (
      signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor"
    ) {
      await sendVerificationCode();
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    }
  };

  const onVerifyPress = async () => {
    const emailCodeFactor = signIn.supportedSecondFactors?.find(
      (factor) => factor.strategy === "email_code",
    );

    if (emailCodeFactor) {
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await signIn.mfa.verifyPhoneCode({ code });
      if (error) {
        alert(error.message);
        return;
      }
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    }
  };

  const needsVerification =
    signIn.status === "needs_client_trust" ||
    signIn.status === "needs_second_factor";

  if (needsVerification) {
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
          className="mb-4 w-full items-center rounded-xl bg-blue-600 py-4"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={sendVerificationCode} className="py-2">
          <Text className="font-semibold text-blue-600">
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
          Welcome Back
        </Text>
        <Text className="mb-6 text-lg text-gray-500">
          Sign in to your account
        </Text>

        <View className="mb-4 flex-row flex-wrap gap-3">
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
          {errors.fields.identifier && (
            <Text className="text-sm text-red-500">
              {errors.fields.identifier.message}
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
            onPress={onSignInPress}
            disabled={isLoading}
            className="mb-4 w-full items-center rounded-xl bg-blue-600 py-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-500">Don&apos;t have an account? </Text>
            <Link href="/sign-up">
              <Text className="font-semibold text-blue-600">Sign up</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </ScrollView>
  );
}
