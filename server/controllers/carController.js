import { fetchCarDataFromGemini, generateComparison } from '../services/geminiService.js';
import { cache } from '../index.js';
import { cars as carData } from '../../src/data/cars.js';

const cars = carData.map(car => ({
  ...car,
  details: {} // Initialize details to avoid undefined errors
}));


// Get list of unique brands
export const getBrands = async (req, res, next) => {
  try {
    const brands = [...new Set(cars.map(car => car.brand))];
    res.json(brands.map(brand => ({ name: brand })));
  } catch (error) {
    next(error);
  }
};


// Get all cars or filter by brand
export const getCars = async (req, res, next) => {
  try {
    const { brand } = req.query;
    let filteredCars = cars;

    if (brand) {
      filteredCars = cars.filter(car => car.brand.toLowerCase() === brand.toString().toLowerCase());
    }

    const basicCarInfo = filteredCars.map(({ id, name, brand, image, year, price, engine, power, acceleration, topSpeed }) => ({
      id,
      name,
      brand,
      image,
      year,
      price,
      engine,
      power,
      acceleration,
      topSpeed
    }));

    res.json(basicCarInfo);
  } catch (error) {
    next(error);
  }
};


// Get detailed car information by ID
export const getCarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = cars.find(car => car.id === id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const cacheKey = `car_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData && cachedData.details && !cachedData.details.geminiError && !cachedData.details.geminiParsingError) {
      return res.json(cachedData);
    }


    const enhancedData = await fetchCarDataFromGemini(car);
    cache.set(cacheKey, enhancedData);

    res.json(enhancedData);
  } catch (error) {
    next(error);
  }
};

// Compare two cars
export const compareCars = async (req, res, next) => {
  try {
    const { car1: car1Id, car2: car2Id } = req.query;

    if (!car1Id || !car2Id) {
      return res.status(400).json({ message: 'Both car IDs are required' });
    }

    const firstCar = cars.find(car => car.id === car1Id);
    const secondCar = cars.find(car => car.id === car2Id);

    if (!firstCar || !secondCar) {
      return res.status(404).json({ message: 'One or both cars not found' });
    }

    const cacheKey = `compare_${car1Id}_${car2Id}`;
    const cachedComparison = cache.get(cacheKey);
    if (cachedComparison && !cachedComparison.differences?.geminiError && !cachedComparison.differences?.geminiParsingError) {
      return res.json(cachedComparison);
    }


    const [enhancedCar1, enhancedCar2] = await Promise.all([
      getCarByIdForComparison(car1Id),
      getCarByIdForComparison(car2Id)
    ]);


    const comparison = {
      car1: enhancedCar1,
      car2: enhancedCar2,
      differences: await generateComparison(enhancedCar1, enhancedCar2)
    };

    cache.set(cacheKey, comparison);
    res.json(comparison);

  } catch (error) {
    next(error);
  }
};


// Helper function to get car data for comparison (internal use, fetches fresh data)
const getCarByIdForComparison = async (carId) => {
  const car = cars.find(c => c.id === carId);
  if (!car) return null;

  // Bypass cache to get fresh data for comparison
  return await fetchCarDataFromGemini(car);
};
