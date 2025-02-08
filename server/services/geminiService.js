import { genAI } from '../index.js';

/**
 * Fetches enhanced car data using Google's Gemini API
 * @param {Object} car - Basic car information
 * @returns {Promise<Object>} Enhanced car data
 */
export async function fetchCarDataFromGemini(car) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Provide comprehensive details about the ${car.brand} ${car.name} (${car.year}) in JSON format.
      Include these specific aspects:
      - Detailed engine specifications (engine type, displacement, cylinders, valve train, fuel system, horsepower, torque, redline)
      - Performance metrics (0-60 mph time, quarter-mile time, top speed, braking distance, handling characteristics)
      - Safety features (active safety, passive safety, crash test ratings)
      - Interior features (seating, technology, materials, comfort, cargo space)
      - Exterior features (design, lighting, wheels, aerodynamics)
      - Fuel efficiency (MPG city, MPG highway, combined MPG, fuel tank capacity)
      - Price analysis (base MSRP, typical options cost, market value, depreciation)

      Structure the JSON response with clear, concise keys for each category and feature. 
      Do not include any introductory or concluding text, only the JSON object.

      Known specifications to ensure accuracy and consistency:
      - Brand: ${car.brand}
      - Model: ${car.name}
      - Year: ${car.year}
      - Engine: ${car.engine}
      - Power: ${car.power}
      - Acceleration: ${car.acceleration}
      - Top Speed: ${car.topSpeed}
      - Price: $${car.price}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let enhancedData;
    try {
      enhancedData = JSON.parse(response.text());
    } catch (e) {
      console.error('Failed to parse Gemini API response:', response.text());
      enhancedData = { geminiParsingError: 'Failed to parse API response' };
    }


    return {
      ...car,
      details: enhancedData
    };
  } catch (error) {
    console.error('Error fetching data from Gemini:', error);
    return {
      ...car,
      details: { geminiError: 'API request failed', errorDetails: error.message }
    };
  }
}


/**
 * Generates a comparison analysis between two cars using Gemini
 * @param {Object} car1 - First car data
 * @param {Object} car2 - Second car data
 * @returns {Promise<Object>} Comparison analysis
 */
export async function generateComparison(car1, car2) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Provide an in-depth comparison between the ${car1.brand} ${car1.name} and ${car2.brand} ${car2.name} in JSON format.
      Focus on:
      - Performance: Detail the performance differences, highlighting which car excels in acceleration, speed, and handling.
      - Value for Money: Analyze which car offers better value considering price, features, and overall capabilities.
      - Target Audience: Define the ideal buyer for each car based on lifestyle, needs, and preferences.
      - Pros and Cons: List the advantages and disadvantages of each car in a structured format.
      - Recommendation: Based on various use cases (e.g., daily driving, performance enthusiast, family car), recommend which car is more suitable.

      Structure the JSON response to clearly present these comparison points. 
      Do not include any introductory or concluding text, only the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let comparisonData;
    try {
      comparisonData = JSON.parse(response.text());
    } catch (e) {
      console.error('Failed to parse Gemini comparison API response:', response.text());
      comparisonData = { geminiParsingError: 'Failed to parse API response' };
    }
    return comparisonData;
  } catch (error) {
    console.error('Error generating comparison:', error);
    return {
      error: 'Could not generate detailed comparison',
      basicComparison: {
        car1: car1.name,
        car2: car2.name
      },
      errorDetails: error.message
    };
  }
}
