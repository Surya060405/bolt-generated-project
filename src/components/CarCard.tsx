import React from 'react';
import { Car } from '../types';
import { Car as CarIcon } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onClick: () => void;
  selected?: boolean;
}

export function CarCard({ car, onClick, selected }: CarCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        selected ? 'ring-2 ring-red-500' : ''
      }`}
    >
      <div className="relative h-48">
        <img
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{car.brand}</h3>
          <p className="text-sm opacity-90">{car.name}</p>
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold">
            ${car.price.toLocaleString()}
          </span>
          <CarIcon className="text-red-500" />
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Engine: {car.engine}</p>
          <p>Power: {car.power}</p>
          <p>0-60 mph: {car.acceleration}</p>
        </div>
      </div>
    </div>
  );
}
