import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BottomNav from "../components/BottomNav";
// Import the update API from your data folder
import { updateMpinAPI } from "../data/mockApi";

export default function ProfileScreen() {
  const router = useRouter();

  // --- NEW STATE FOR SECURITY MODAL ---
  const [isSecurityVisible, setIsSecurityVisible] = useState(false);
  const [currentMpin, setCurrentMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW HANDLER FOR UPDATING MPIN ---
  const handleUpdateMpin = async () => {
    setError("");
    setSuccessMessage("");

    if (currentMpin.length < 6 || newMpin.length < 6) {
      setError("Both MPINs must be exactly 6 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateMpinAPI(currentMpin, newMpin);
      setSuccessMessage(response.message);
      setCurrentMpin("");
      setNewMpin("");
      
      // Optional: Auto-close the modal after 2 seconds on success
      setTimeout(() => {
        setIsSecurityVisible(false);
        setSuccessMessage("");
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openSecuritySettings = () => {
    setCurrentMpin("");
    setNewMpin("");
    setError("");
    setSuccessMessage("");
    setIsSecurityVisible(true);
  };

  return (
    <LinearGradient colors={["black", "teal"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
          <Ionicons name="person-circle" size={42} color="white" />
        </View>

        {/* CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={45} color="forestgreen" />
            </View>
            <Text style={styles.name}>User</Text>
            <Text style={styles.email}>user@example.com</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>Basic Account</Text>
            </View>
          </View>

          {/* ACCOUNT SETTINGS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() =>
                Alert.alert("Personal Information", "Settings coming soon.")
              }
            >
              <View style={styles.optionIcon}>
                <Ionicons name="person-outline" size={22} color="forestgreen" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionText}>Personal Information</Text>
                <Text style={styles.optionDescription}>
                  Manage your personal details
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
            
            {/* UPDATED SECURITY BUTTON */}
            <TouchableOpacity
              style={[styles.option, { borderBottomWidth: 0 }]} // Removed bottom border for last item
              onPress={openSecuritySettings}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="forestgreen"
                />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionText}>Security</Text>
                <Text style={styles.optionDescription}>
                  Manage your MPIN and security
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION */}
        <BottomNav
          active="profile"
          onHome={() => router.replace("/home")}
          onTransactions={() => router.replace("/transactions")}
          onProfile={() => router.replace("/profile")}
          onLogout={() => router.replace("/")}
        />
      </SafeAreaView>

      {/* --- NEW SECURITY MODAL --- */}
      <Modal
        visible={isSecurityVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSecurityVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update MPIN</Text>
              <TouchableOpacity onPress={() => setIsSecurityVisible(false)}>
                <Ionicons name="close" size={24} color="dimgray" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Current MPIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current 6-digit MPIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
              value={currentMpin}
              onChangeText={(text) => {
                setCurrentMpin(text.replace(/[^0-9]/g, ''));
                setError("");
              }}
            />

            <Text style={styles.modalLabel}>New MPIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new 6-digit MPIN"
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
              value={newMpin}
              onChangeText={(text) => {
                setNewMpin(text.replace(/[^0-9]/g, ''));
                setError("");
              }}
            />

            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
            {successMessage !== "" && <Text style={styles.successText}>{successMessage}</Text>}

            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={handleUpdateMpin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.updateButtonText}>Save MPIN</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: { color: "white", fontSize: 25, fontWeight: "bold" },
  headerSubtitle: { color: "lightgray", fontSize: 13, marginTop: 4 },
  content: { padding: 20, paddingBottom: 30 },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: "whitesmoke",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: { fontSize: 21, fontWeight: "bold", color: "black" },
  email: { fontSize: 13, color: "gray", marginTop: 5 },
  memberBadge: {
    backgroundColor: "honeydew",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 12,
  },
  memberText: { color: "forestgreen", fontSize: 11, fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionInfo: { flex: 1 },
  optionText: { fontSize: 14, fontWeight: "bold", color: "black" },
  optionDescription: { fontSize: 11, color: "gray", marginTop: 3 },

  /* --- NEW STYLES FOR THE MODAL --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "dimgray",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "black",
    marginBottom: 10,
    letterSpacing: 2,
  },
  updateButton: {
    backgroundColor: "forestgreen",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    height: 50,
    justifyContent: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },
  successText: {
    color: "forestgreen",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
});