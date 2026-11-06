import { createContext, useEffect, useState } from "react";

export const BankingContext = createContext();

const API_BASE_URL = "https://6aeade2fee39618d7bf77400.mockapi.io/api/v1";

export function BankingProvider({ children }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    // GET User Profile
    fetch(`${API_BASE_URL}/users/1`)
      .then((response) => response.json())
      .then((json) => setUser(json))
      .catch((error) => console.error("User fetch error:", error));

    // GET All Transactions
    fetch(`${API_BASE_URL}/transactions`)
      .then((response) => response.json())
      .then((json) => setTransactions(json))
      .catch((error) => console.error("Transactions fetch error:", error));
  }, []);

  // DELETE Transaction and sync state
  const deleteTransaction = (id) => {
    fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      })
      .catch((error) => console.error("Delete error:", error));
  };

  return (
    <BankingContext.Provider value={{ user, transactions, deleteTransaction }}>
      {children}
    </BankingContext.Provider>
  );
}
