import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = "https://6aeade2fee39618d7bf77400.mockapi.io/api/v1";

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/transactions/${id}`)
      .then((response) => response.json())
      .then((json) => setTransaction(json))
      .catch((error) => console.error(error));
  }, [id]);

  if (!transaction) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text>Loading details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 14, color: "#888" }}>
        Transaction #{transaction.id}
      </Text>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 6 }}>
        {transaction.title}
      </Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}>
        Amount: ${transaction.amount}
      </Text>
      <Text style={{ fontSize: 16, marginTop: 4 }}>
        Type: {transaction.type}
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
        Date: {transaction.date}
      </Text>
    </SafeAreaView>
  );
}
