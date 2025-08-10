/**
 * Makes a request to the TensorFlow.js training API
 * @param {Object} financialData - The financial data to train on and predict from
 * @param {number} financialData.income - Income amount
 * @param {number} financialData.savings - Savings amount
 * @param {number} financialData.retirement - Retirement amount
 * @param {number} financialData.expenses - Expenses amount
 * @param {number} financialData.investments - Investments amount
 * @returns {Promise<Object>} The model training results and predictions
 */
export const trainedModel = async (financialData) => {
  try {
    // Validate input data
    if (!financialData || !financialData.income) {
      throw new Error(
        "Financial data is required with at least an income value"
      );
    }

    // Get API URL from environment variable or fallback to localhost
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    
    // Make the API request
    const res = await fetch(`${API_URL}/api/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(financialData),
    });

    // Check if the request was successful
    if (!res.ok) {
      throw new Error(`API request failed with status: ${res.status}`);
    }

    // Parse and return the response data
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in model training:", error);
    throw error; // Re-throw to allow calling code to handle it
  }
};

export default trainedModel;
