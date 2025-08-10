import * as tf from "@tensorflow/tfjs";
import express from "express";

const router = express.Router();

// Standalone training function that can be exported and used elsewhere
export const trainModel = async () => {
  try {
    // Create a model with a hidden layer (more like real ML models)
    const model = tf.sequential();

    const TrainingData = () => {
      return {
        income: tf.tensor2d(
          [
            1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 9000,
            10000, 12000, 15000,
          ],
          [14, 1]
        ),
        savings: tf.tensor2d(
          [
            150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000, 1200,
            1500,
          ],
          [14, 1]
        ),
        retirement: tf.tensor2d(
          [
            225, 300, 375, 450, 525, 600, 750, 900, 1050, 1200, 1350, 1500,
            1800, 2250,
          ],
          [14, 1]
        ),
        expenses: tf.tensor2d(
          [
            1125, 1500, 1875, 2100, 2300, 2500, 3000, 3500, 4000, 4500, 5000,
            5500, 6500, 8000,
          ],
          [14, 1]
        ),
        investments: tf.tensor2d(
          [
            190, 250, 310, 375, 440, 500, 625, 750, 875, 1000, 1125, 1250, 1500,
            1875,
          ],
          [14, 1]
        ),
      };
    };

    const TestData = () => {
      return {
        income: tf.tensor2d(
          [1000, 2250, 3500, 4500, 5500, 7500, 9500, 11000, 13000, 16000],
          [10, 1]
        ),
      };
    };

    // Get the data by calling the function
    const trainData = TrainingData();
    const testData = TestData();

    // First layer (hidden layer)
    model.add(
      tf.layers.dense({
        units: 8, // Increased number of neurons for better learning
        activation: "relu", // ReLU activation function
        inputShape: [1], // 1 input feature
      })
    );

    // Add a second hidden layer for better pattern recognition
    model.add(
      tf.layers.dense({
        units: 6, // Slightly fewer neurons in second layer
        activation: "relu",
      })
    );

    // Output layer - Change to 3 units to predict all three values
    model.add(tf.layers.dense({ units: 3 }));

    // Compile model
    model.compile({
      optimizer: "adamax",
      loss: "meanSquaredError",
    });

    // Create a combined output tensor with all three values
    const combinedOutput = tf.tensor2d([
      [150, 225, 190], // for income 1500
      [200, 300, 250], // for income 2000
      [250, 375, 310], // for income 2500
      [300, 450, 375], // for income 3000
      [350, 525, 440], // for income 3500
      [400, 600, 500], // for income 4000
      [500, 750, 625], // for income 5000
      [600, 900, 750], // for income 6000
      [700, 1050, 875], // for income 7000
      [800, 1200, 1000], // for income 8000
      [900, 1350, 1125], // for income 9000
      [1000, 1500, 1250], // for income 10000
      [1200, 1800, 1500], // for income 12000
      [1500, 2250, 1875], // for income 15000
    ]);

    console.log(
      "Training model with data:",
      trainData.income,
      "and labels:",
      combinedOutput
    );
    console.log("Starting training...");

    // Log training progress - only use income and combined output
    const output = await model.fit(trainData.income, combinedOutput, {
      epochs: 1500, // Increased for better learning with more data
      verbose: 1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 100 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(5)}`);
          }
        },
      },
    });

    console.log("Training completed!");
    console.log(
      "Final loss:",
      output.history.loss[output.history.loss.length - 1]
    );

    // Make predictions for several values
    const testValues = testData.income.dataSync();
    console.log("Making predictions for incomes:", testValues);

    // Get all predictions at once
    const predictions = model.predict(testData.income);
    const predictionData = predictions.dataSync();

    // Display predictions in a readable format
    testValues.forEach((value, i) => {
      const baseIndex = i * 3; // Each prediction has 3 values
      console.log(`For income $${value}:`);
      console.log(
        `  → Predicted Savings: $${predictionData[baseIndex].toFixed(2)}`
      );
      console.log(
        `  → Predicted Retirement: $${predictionData[baseIndex + 1].toFixed(2)}`
      );
      console.log(
        `  → Predicted Investments: $${predictionData[baseIndex + 2].toFixed(
          2
        )}`
      );
    });

    return {
      model,
      finalLoss: output.history.loss[output.history.loss.length - 1],
      samplePrediction: {
        income: 6000,
        prediction: model.predict(tf.tensor2d([[6000]])).dataSync(),
      },
    };
  } catch (error) {
    console.error("Training error:", error);
    throw error;
  }
};

// Create a route for the training endpoint
router.post("/train", async (req, res) => {
  try {
    // Get data from request body (if provided)
    const formData = req.body;
    console.log("Received form data:", formData);

    // Call the training function
    const result = await trainModel();

    // Add custom prediction if income was provided
    let customPrediction = null;
    if (formData && formData.income) {
      const incomeValue = Number(formData.income);
      const prediction = result.model.predict(tf.tensor2d([[incomeValue]]));
      const predictionValues = prediction.dataSync();

      customPrediction = {
        income: incomeValue,
        savings: predictionValues[0],
        retirement: predictionValues[1],
        investments: predictionValues[2],
      };

      console.log(`Prediction for income $${incomeValue}:`, customPrediction);
    }

    // Send response back to client
    res.status(200).json({
      message: "Model trained successfully",
      finalLoss: result.finalLoss,
      samplePrediction: result.samplePrediction,
      customPrediction: customPrediction,
    });
  } catch (error) {
    console.error("Training error:", error);
    res.status(500).json({
      error: "Error during training",
      message: error.message,
    });
  }
});

// Export the router as the default export
export default router;
