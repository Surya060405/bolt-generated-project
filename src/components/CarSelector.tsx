import React from 'react';
import { Search, Clear } from 'lucide-react';
import type { Car, Brand } from '../types';
import { Autocomplete, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, InputAdornment, CircularProgress } from '@mui/material';

interface CarSelectorProps {
  label: string;
  cars: Car[];
  selectedCar: Car | null;
  onSelect: (car: Car) => void;
  disabled?: boolean;
  loading?: boolean;
  brandOptions: Brand[];
  onBrandChange: (event: React.ChangeEvent<HTMLInputElement>, value: Brand | null) => void;
}

export function CarSelector({ label, cars, selectedCar, onSelect, disabled, loading, brandOptions, onBrandChange }: CarSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState('');
  const [brandInputValue, setBrandInputValue] = React.useState('');
  const loadingAutocomplete = open && loading;


  return (
    <Box>
      <Autocomplete
        disabled={disabled}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={selectedCar}
        isOptionEqualToValue={(option, value) => value === null || option.id === value.id}
        getOptionLabel={(option) => `${option.brand} ${option.name}`}
        options={cars}
        loading={loadingAutocomplete}
        onInputChange={(event, newInputValue) => {
          setSearchInputValue(newInputValue);
        }}
        onChange={(event: any, newValue: Car | null) => {
          onSelect(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loadingAutocomplete ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.id}>
            <ListItemAvatar>
              <Avatar src={option.image} alt={`${option.brand} ${option.name}`} />
            </ListItemAvatar>
            <ListItemText
              primary={`${option.brand} ${option.name}`}
              secondary={`${option.engine} • ${option.power}`}
            />
          </ListItem>
        )}
      />
      <Autocomplete
        disabled={disabled}
        value={null}
        options={brandOptions}
        getOptionLabel={(option) => option.name}
        onInputChange={(event, newInputValue) => {
          setBrandInputValue(newInputValue);
        }}
        onChange={onBrandChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Brand (Optional)"
            margin="normal"
          />
        )}
      />
    </Box>
  );
}
