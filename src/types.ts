export interface Car {
  id: string;
  name: string;
  brand: string;
  image: string;
  year: number;
  price: number;
  engine: string;
  power: string;
  acceleration: string;
  topSpeed: string;
  details?: CarDetails;
}

export interface CarDetails {
  safetyFeatures: string[];
  interiorFeatures: string[];
  exteriorFeatures: string[];
  fuelEfficiency: string;
  performanceMetrics: string[];
  priceAnalysis: string;
  engineSpecifications: string;
}


export interface ComparisonState {
  car1: Car | null;
  car2: Car | null;
}

export interface Brand {
  name: string;
}
