const MOCK_API_URL = "https://6aed8561fc3b911e6fd64751.mockapi.io/users";

export const verifyMpinAPI = async (enteredMpin) => {
  try {
    const response = await fetch(MOCK_API_URL);
    
    if (!response.ok) {
      throw new Error("Could not connect to the server.");
    }
    
    const users = await response.json();
    
    // Find user with id "1" from the array
    const user = users.find((u) => u.id === "1") || users[0];

    if (!user) {
      throw new Error("User not found on server.");
    }

    if (user.mpin === enteredMpin) {
      return { success: true, token: "fake_token_123" };
    } else {
      throw new Error("Incorrect MPIN. Please try again.");
    }
  } catch (error) {
    throw new Error(error.message || "Network error. Check your connection.");
  }
};

export const updateMpinAPI = async (oldMpin, newMpin) => {
  try {
    const getResponse = await fetch(MOCK_API_URL);
    const users = await getResponse.json();
    
    const user = users.find((u) => u.id === "1") || users[0];

    if (!user) {
      throw new Error("User not found on server.");
    }

    if (user.mpin !== oldMpin) {
      throw new Error("Current MPIN is incorrect.");
    }

    // Update using the specific item's URL (e.g., /users/1)
    const putResponse = await fetch(`${MOCK_API_URL}/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mpin: newMpin })
    });

    if (!putResponse.ok) {
      throw new Error("Failed to update MPIN on the server.");
    }

    return { success: true, message: "MPIN updated successfully." };
  } catch (error) {
    throw new Error(error.message || "Network error. Check your connection.");
  }
};