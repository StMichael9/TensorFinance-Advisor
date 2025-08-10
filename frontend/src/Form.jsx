import React from "react";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { trainedModel } from "./trainedModel.js";

const Form = () => {
  const [income, setIncome] = useState("");
  const [isYearly, setIsYearly] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Parse the income value
      const parsedIncome = Number(income);

      if (isNaN(parsedIncome) || parsedIncome <= 0) {
        throw new Error("Please enter a valid income amount");
      }

      // Convert yearly income to monthly if needed for the API
      const monthlyIncome = isYearly ? parsedIncome / 12 : parsedIncome;

      const result = await trainedModel({ income: monthlyIncome });
      console.log("Model results:", result);

      // Set prediction results in state to display in UI
      setPrediction({
        ...result,
        isYearly,
        originalIncome: parsedIncome,
      });
    } catch (error) {
      console.error("Failed to train model:", error);
      setError(error.message || "Failed to train model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleIncomeType = () => {
    setIsYearly(!isYearly);
    // Clear prediction when switching income type
    setPrediction(null);
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          TensorFinance-Advisor
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your income to get personalized financial recommendations
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            {/* Income type toggle */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    !isYearly
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } border border-indigo-300`}
                  onClick={() => isYearly && toggleIncomeType()}
                >
                  Monthly Income
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    isYearly
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } border border-indigo-300`}
                  onClick={() => !isYearly && toggleIncomeType()}
                >
                  Yearly Income
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isYearly ? "Yearly" : "Monthly"} Income:
                <CurrencyInput
                  id="income-input"
                  name="income"
                  placeholder={`Enter your ${
                    isYearly ? "yearly" : "monthly"
                  } income`}
                  defaultValue={income}
                  decimalsLimit={2}
                  onValueChange={(value) => setIncome(value || "")}
                  prefix="$"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  required
                />
              </label>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Get Recommendations"}
            </button>
          </div>
        </form>

        {/* Display prediction results */}
        {prediction && prediction.customPrediction && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              Your Financial Recommendations
            </h2>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">
                Based on your {prediction.isYearly ? "yearly" : "monthly"}{" "}
                income of $
                {prediction.originalIncome.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                :
              </span>
            </p>
            <div className="space-y-4 pl-4">
              <div className="p-3 bg-green-50 rounded-md border border-green-100">
                <p className="text-green-800 font-medium">
                  Recommended Monthly Savings
                </p>
                <p className="text-green-700 text-2xl font-bold">
                  $
                  {Number(prediction.customPrediction.savings).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Save this amount each month for emergencies and future
                  expenses
                </p>
                {prediction.isYearly && (
                  <p className="text-green-600 text-sm mt-1 italic">
                    ($
                    {Number(
                      prediction.customPrediction.savings * 12
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    per year)
                  </p>
                )}
              </div>

              <div className="p-3 bg-purple-50 rounded-md border border-purple-100">
                <p className="text-purple-800 font-medium">
                  Recommended Monthly Retirement
                </p>
                <p className="text-purple-700 text-2xl font-bold">
                  $
                  {Number(
                    prediction.customPrediction.retirement
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-purple-600 text-sm mt-1">
                  Contribute this amount to your retirement accounts each month
                </p>
                {prediction.isYearly && (
                  <p className="text-purple-600 text-sm mt-1 italic">
                    ($
                    {Number(
                      prediction.customPrediction.retirement * 12
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    per year)
                  </p>
                )}
              </div>

              <div className="p-3 bg-indigo-50 rounded-md border border-indigo-100">
                <p className="text-indigo-800 font-medium">
                  Recommended Monthly Investments
                </p>
                <p className="text-indigo-700 text-2xl font-bold">
                  $
                  {Number(
                    prediction.customPrediction.investments
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-indigo-600 text-sm mt-1">
                  Invest this amount monthly for long-term growth
                </p>
                {prediction.isYearly && (
                  <p className="text-indigo-600 text-sm mt-1 italic">
                    ($
                    {Number(
                      prediction.customPrediction.investments * 12
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    per year)
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                These recommendations are based on machine learning patterns,
                not financial advice.
              </p>
              <p className="mt-2">
                Model confidence: {(100 - prediction.finalLoss).toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
