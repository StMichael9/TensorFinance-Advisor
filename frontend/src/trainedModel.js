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

    // Get API URL from environment variable or fallback to production URL
    // Force use of the render URL in production to avoid CORS issues
    const API_URL =
      import.meta.env.MODE === "production"
        ? "https://tensorfinance-advisor.onrender.com"
        : import.meta.env.VITE_API_URL || "http://localhost:3001";

    console.log("Using API URL:", API_URL); // Debug logging
    console.log("Environment:", import.meta.env.MODE); // Log the current environment

    // Make the API request
    const apiEndpoint = `${API_URL}/api/train`;
    console.log("Sending request to:", apiEndpoint);

    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(financialData),
      // Don't use credentials for cross-origin requests unless absolutely necessary
      // as it requires additional CORS configuration
      // credentials: "include",
    }); // Check if the request was successful
    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error:", errorText);
      throw new Error(
        `API request failed with status: ${res.status} - ${errorText}`
      );
    }

    // Parse and return the response data
    const data = await res.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error in model training:", error);

    // Provide more detailed error for network failures
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      console.error("Network error: API server may be down or CORS issue");
      throw new Error(
        "Unable to connect to the API. Please check your internet connection or try again later."
      );
    }

    throw error; // Re-throw to allow calling code to handle it
  }
};

// Health check function to verify API connectivity
export const checkApiHealth = async () => {
  try {
    const API_URL =
      import.meta.env.VITE_API_URL ||
      "https://tensorfinance-advisor.onrender.com";
    const response = await fetch(`${API_URL}/health`);

    if (response.ok) {
      const data = await response.json();
      console.log("API Health:", data);
      return { status: "healthy", data };
    } else {
      console.error("API Health Check Failed:", response.status);
      return { status: "unhealthy", error: response.statusText };
    }
  } catch (error) {
    console.error("API Health Check Error:", error);
    return { status: "error", error: error.message };
  }
};

export default trainedModel;
