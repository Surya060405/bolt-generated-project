import React, { useState, useEffect, useCallback } from 'react';
import { Car as CarIcon, GitCompare, ChevronDown, Gauge, Shield, Zap, Menu, X } from 'lucide-react';
import { CarSelector } from './components/CarSelector';
import { ComparisonSection } from './components/ComparisonSection';
import type { Car, ComparisonState, Brand } from './types';
import axios from 'axios';
import { Autocomplete, TextField, CircularProgress, Alert, Box, Button, Container, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

function App() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [comparison, setComparison] = useState<ComparisonState>({
    car1: null,
    car2: null,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingCars, setLoadingCars] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoadingBrands(true);
    setError(null);
    try {
      const response = await axios.get('/api/brands');
      setBrands(response.data);
    } catch (err) {
      setError('Failed to load brands.');
      console.error("Error fetching brands:", err);
    } finally {
      setLoadingBrands(false);
    }
  }, []);

  const fetchCarsByBrand = useCallback(async (brandName?: string) => {
    setLoadingCars(true);
    setError(null);
    let params: { brand?: string } = {};
    if (brandName) {
      params.brand = brandName;
    }
    try {
      const response = await axios.get('/api/cars', { params });
      setCars(response.data);
    } catch (err) {
      setError('Failed to load cars.');
      console.error("Error fetching cars:", err);
    } finally {
      setLoadingCars(false);
    }
  }, []);


  useEffect(() => {
    fetchBrands();
    fetchCarsByBrand(); // Fetch all cars initially
  }, [fetchBrands, fetchCarsByBrand]);

  const handleCarSelect = (position: 'car1' | 'car2', car: Car) => {
    setComparison(prev => ({
      ...prev,
      [position]: car
    }));
  };

  const resetComparison = () => {
    setComparison({ car1: null, car2: null });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    setIsMenuOpen(false);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>, value: Brand | null) => {
    if (value) {
      fetchCarsByBrand(value.name);
    } else {
      fetchCarsByBrand(); // Fetch all cars if no brand selected
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <AppBar position="fixed" sx={{ bgcolor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', color: 'white' }}>
              <CarIcon sx={{ mr: 1, width: 30, height: 30 }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '.1rem', color: 'white', textDecoration: 'none' }}
              >
                CarCompare
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, color: 'white' }}>
              <Button onClick={() => scrollToSection('features')} sx={{ color: 'white', '&:hover': { color: 'red' } }}>
                Features
              </Button>
              <Button onClick={() => scrollToSection('comparison')} sx={{ color: 'white', '&:hover': { color: 'red' } }}>
                Compare Cars
              </Button>
              <Button onClick={() => scrollToSection('about')} sx={{ color: 'white', '&:hover': { color: 'red' } }}>
                About
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                color="inherit"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={() => setIsMenuOpen(false)}
        >
          <List>
            {['Features', 'Compare Cars', 'About'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => scrollToSection(text.toLowerCase().replace(/ /g, ''))}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box className="relative h-screen bg-black" id="hero-section">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
          alt="Luxury car"
          className="w-full h-full object-cover opacity-70"
        />
        <Box className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <Box className="absolute inset-0 flex items-center justify-center">
          <Box className="text-center text-white">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <CarIcon sx={{ mr: 1, width: 60, height: 60 }} />
              <Typography variant="h2" sx={{ fontSize: { xs: '3rem', md: '5rem' }, fontWeight: 'bold' }}>CarCompare</Typography>
            </Box>
            <Typography variant="h5" sx={{ mt: 2, maxWidth: '80%', mx: 'auto', px: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              Discover the Pinnacle of Automotive Excellence
            </Typography>
            <Typography variant="body1" sx={{ mt: 4, maxWidth: '70%', mx: 'auto', px: 4, color: 'grey', fontSize: { xs: '1rem', md: '1.2rem' } }}>
              Compare the world's finest automobiles side by side. From supercars to daily drivers, make an informed decision.
            </Typography>
            <Box sx={{ mt: 8 }}>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={() => scrollToSection('comparison')}
                endIcon={<ChevronDown />}
                sx={{ borderRadius: '50px', px: 4, py: 2, fontWeight: 'semibold', '&:hover': { bgcolor: 'red' }, transform: 'scale(1)' , transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }}
              >
                Start Comparing
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Container id="features" maxWidth="lg" sx={{ py: 20, bgcolor: 'white' }}>
        <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: 'bold', mb: 10 }}>Why Choose CarCompare?</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: 'repeat(3, 1fr)', xs: '1fr' }, gap: 12 }}>
          <Box textAlign="center">
            <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 4, bgcolor: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gauge sx={{ width: 40, height: 40, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Precise Comparisons</Typography>
            <Typography color="textSecondary">Compare detailed specifications and performance metrics of any two vehicles side by side.</Typography>
          </Box>
          <Box textAlign="center">
            <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 4, bgcolor: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap sx={{ width: 40, height: 40, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Real-time Updates</Typography>
            <Typography color="textSecondary">Access the latest information about vehicle specifications, prices, and performance data.</Typography>
          </Box>
          <Box textAlign="center">
            <Box sx={{ width: 80, height: 80, mx: 'auto', mb: 4, bgcolor: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield sx={{ width: 40, height: 40, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Expert Insights</Typography>
            <Typography color="textSecondary">Make informed decisions with our comprehensive comparison tools and expert analysis.</Typography>
          </Box>
        </Box>
      </Container>

      {/* About Section */}
      <Container id="about" maxWidth="lg" sx={{ py: 20, bgcolor: 'grey.900', color: 'white' }}>
        <Box maxWidth="md" mx="auto" textAlign="center">
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>About CarCompare</Typography>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
            CarCompare is your ultimate destination for automotive comparison and research.
            We provide enthusiasts and buyers with detailed insights into the world's most
            exciting vehicles.
          </Typography>
          <Typography variant="body2" color="grey.400" sx={{ fontSize: '1rem' }}>
            Whether you're comparing supercars or everyday vehicles, our platform offers
            the most comprehensive and accurate information to help you make the right choice.
          </Typography>
        </Box>
      </Container>

      {/* Comparison Section */}
      <Container id="comparison" maxWidth="lg" sx={{ py: 20 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Compare Cars</Typography>
            <Typography variant="subtitle1" color="textSecondary">Select two cars to compare their specifications</Typography>
          </Box>
          {(comparison.car1 || comparison.car2) && (
            <Button onClick={resetComparison} color="error">
              Reset Selection
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { md: 'repeat(2, 1fr)', xs: '1fr' }, gap: 8, mb: 8 }}>
          <CarSelector
            label="Select First Car"
            cars={cars}
            selectedCar={comparison.car1}
            onSelect={(car) => handleCarSelect('car1', car)}
            loading={loadingCars}
            brandOptions={brands}
            onBrandChange={handleBrandChange}
          />
          <CarSelector
            label="Select Second Car"
            cars={cars.filter(car => car.id !== comparison.car1?.id)}
            selectedCar={comparison.car2}
            onSelect={(car) => handleCarSelect('car2', car)}
            disabled={!comparison.car1}
            loading={loadingCars}
            brandOptions={brands}
            onBrandChange={handleBrandChange}
          />
        </Box>

        {comparison.car1 && comparison.car2 && (
          <ComparisonSection car1={comparison.car1} car2={comparison.car2} />
        )}
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 12, bgcolor: 'black', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CarIcon sx={{ width: 40, height: 40 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>CarCompare</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'grey' }}>
              <GitCompare sx={{ width: 20, height: 20 }} />
              <Typography variant="body2">© 2024 CarCompare. All rights reserved.</Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export default App;
