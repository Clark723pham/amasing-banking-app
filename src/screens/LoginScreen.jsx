import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import your mock API from the data folder
import { verifyMpinAPI } from '../data/mockApi';

export default function LoginScreen() {
  const router = useRouter();

  // State
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const demoPhoneNumber = "0917 123 4567";

  const handleNumberPress = (number) => {
    if (mpin.length < 6) {
      setMpin((current) => current + number);
      setError("");
    }
  };

  const handleBackspace = () => {
    setMpin((current) => current.slice(0, -1));
    setError("");
  };

  const handleLogin = async () => {
    if (mpin.length < 6) {
      setError("Please enter your 6-digit MPIN.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call the mock API imported at the top of the file
      const responseData = await verifyMpinAPI(mpin);
      router.replace("/home");
    } catch (err) {
      setError(err.message);
      setMpin("");
    } finally {
      setIsLoading(false);
    }
  };

  const keypad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
  ];

  return (
    <LinearGradient colors={["black", "teal"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.overlay}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}
          <Image
            source={require("../../assets/snack-icon.png")}
            style={styles.logo}
          />

          {}
          <View style={styles.form}>
            {}
            <View style={styles.phoneRow}>
              <Text style={styles.phoneNumber}>{demoPhoneNumber}</Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.changeNumberText}>Change Number</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.instructionText}>Enter your MPIN</Text>

            {/* MPIN DOTS */}
            <View style={styles.pinContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    index < mpin.length && styles.pinDotFilled,
                  ]}
                />
              ))}
            </View>

            {/* ERROR MESSAGE */}
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}

            {/* CUSTOM KEYPAD */}
            <View style={styles.keypad}>
              {keypad.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.keypadRow}>
                  {row.map((key, index) => {
                    if (key === "") {
                      return (
                        <View key={index} style={styles.numberButtonEmpty} />
                      );
                    }
                    if (key === "backspace") {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.numberButton}
                          onPress={handleBackspace}
                          activeOpacity={0.7}
                          disabled={isLoading}
                        >
                          <Ionicons
                            name="backspace-outline"
                            size={24}
                            color="dimgray"
                          />
                        </TouchableOpacity>
                      );
                    }
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.numberButton}
                        onPress={() => handleNumberPress(key)}
                        activeOpacity={0.7}
                        disabled={isLoading}
                      >
                        <Text style={styles.numberText}>{key}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* LOGIN BUTTON WITH SPINNER */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.actionButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.footerText}>
                No account? <Text style={styles.footerTextlink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.demoText}>Demo MPIN: 123456</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  overlay: { flexGrow: 1, padding: 20, paddingTop: 60, paddingBottom: 40 },

  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 25,
    marginTop: 10,
    borderRadius: 20,
  },

  form: {
    backgroundColor: "white",
    width: "100%",
    padding: 25,
    borderRadius: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  phoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  phoneNumber: { fontSize: 16, fontWeight: "bold", color: "dimgray" },
  changeNumberText: { fontSize: 13, color: "blue", fontWeight: "500" },
  instructionText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },

  /* PIN Dots */
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    gap: 12,
  },
  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "lightgray",
    backgroundColor: "white",
  },
  pinDotFilled: { backgroundColor: "forestgreen", borderColor: "forestgreen" },

  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 10,
  },

  /* Keypad */
  keypad: { width: "100%", marginTop: 5 },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  numberButton: {
    width: "30%",
    height: 55,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
  },
  numberButtonEmpty: {
    width: "30%",
    height: 55,
    backgroundColor: "transparent",
  },
  numberText: { fontSize: 21, fontWeight: "600", color: "dimgray" },

  actionButton: {
    backgroundColor: "forestgreen",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },

  footerLink: { alignItems: "center" },
  footerText: { color: "black", fontSize: 14 },
  footerTextlink: { color: "forestgreen", fontSize: 14, fontWeight: "bold" },

  demoText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});