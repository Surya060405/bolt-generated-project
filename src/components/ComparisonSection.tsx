import React from 'react';
import { ArrowRight, Wine as Engine, Gauge, Zap, DollarSign, Timer, SafetyCone, Stars, Car as CarIconComponent, FuelPump, Speedometer } from 'lucide-react';
import type { Car } from '../types';
import { Box, Grid, Typography, Paper, Avatar, Chip } from '@mui/material';

interface ComparisonSectionProps {
  car1: Car | null;
  car2: Car | null;
}

interface SpecRowProps {
  label: string;
  value1: string | string[];
  value2: string | string[];
  icon: React.ReactNode;
  highlight?: boolean;
}

function SpecRow({ label, value1, value2, icon, highlight }: SpecRowProps) {
  const renderValues = (values: string | string[]) => {
    if (Array.isArray(values)) {
      return values.map((value, index) => <li key={index}>{value}</li>);
    }
    return values;
  };

  return (
    <Grid container className={`py-3 ${highlight ? 'bg-gray-50' : ''} rounded-md`} alignItems="center">
      <Grid item xs={12} md={4} textAlign="right" paddingRight={2}>
        <Typography fontWeight="medium">{Array.isArray(value1) ? <ul>{renderValues(value1)}</ul> : value1}</Typography>
      </Grid>
      <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center" color="grey">
        {icon}
        <Typography component="span" sx={{ ml: 1, display: { xs: 'none', md: 'inline' } }}>{label}</Typography>
      </Grid>
      <Grid item xs={12} md={4} paddingLeft={2}>
        <Typography fontWeight="medium">{Array.isArray(value2) ? <ul>{renderValues(value2)}</ul> : value2}</Typography>
      </Grid>
    </Grid>
  );
}

export function ComparisonSection({ car1, car2 }: ComparisonSectionProps) {
  if (!car1 || !car2) return null;

  const specs = [
    {
      label: 'Engine',
      value1: car1.engine,
      value2: car2.engine,
      icon: <Engine />,
      highlight: true
    },
    {
      label: 'Power',
      value1: car1.power,
      value2: car2.power,
      icon: <Zap />
    },
    {
      label: 'Acceleration (0-60 mph)',
      value1: car1.acceleration,
      value2: car2.acceleration,
      icon: <Speedometer />,
      highlight: true
    },
    {
      label: 'Top Speed',
      value1: car1.topSpeed,
      value2: car2.topSpeed,
      icon: <Gauge />
    },
    {
      label: 'Price',
      value1: `$${car1.price.toLocaleString()}`,
      value2: `$${car2.price.toLocaleString()}`,
      icon: <DollarSign />,
      highlight: true
    },
    {
      label: 'Safety Features',
      value1: car1.details?.safetyFeatures || 'N/A',
      value2: car2.details?.safetyFeatures || 'N/A',
      icon: <SafetyCone />
    },
    {
      label: 'Fuel Efficiency',
      value1: car1.details?.fuelEfficiency || 'N/A',
      value2: car2.details?.fuelEfficiency || 'N/A',
      icon: <FuelPump />
    },
    {
      label: 'Interior Features',
      value1: car1.details?.interiorFeatures || 'N/A',
      value2: car2.details?.interiorFeatures || 'N/A',
      icon: <Stars />
    },
    {
      label: 'Exterior Features',
      value1: car1.details?.exteriorFeatures || 'N/A',
      value2: car2.details?.exteriorFeatures || 'N/A',
      icon: <CarIconComponent />
    }
  ];

  return (
    <Paper elevation={3} sx={{ borderRadius: '15px', padding: 4, mt: 6 }}>
      <Grid container spacing={4} mb={4} alignItems="center">
        <Grid item md={5} xs={12} textAlign="center">
          <Box position="relative" borderRadius="lg" overflow="hidden">
            <img
              src={car1.image}
              alt={car1.name}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <Box position="absolute" bottom={0} left={0} right={0} bgcolor="rgba(0,0,0,0.5)" color="white" padding={2}>
              <Typography variant="h6" component="h3">{car1.brand} {car1.name}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item md={2} xs={12} display="flex" justifyContent="center" alignItems="center">
          <ArrowRight style={{ width: 50, height: 50, color: 'red' }} />
        </Grid>
        <Grid item md={5} xs={12} textAlign="center">
          <Box position="relative" borderRadius="lg" overflow="hidden">
            <img
              src={car2.image}
              alt={car2.name}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <Box position="absolute" bottom={0} left={0} right={0} bgcolor="rgba(0,0,0,0.5)" color="white" padding={2}>
              <Typography variant="h6" component="h3">{car2.brand} {car2.name}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        {specs.map((spec) => (
          <SpecRow
            key={spec.label}
            label={spec.label}
            value1={spec.value1}
            value2={spec.value2}
            icon={spec.icon}
            highlight={spec.highlight}
          />
        ))}
      </Box>
    </Paper>
  );
}
