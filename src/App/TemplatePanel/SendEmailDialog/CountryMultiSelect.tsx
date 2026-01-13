import React from 'react';

import { Autocomplete, TextField } from '@mui/material';

import { COUNTRY_OPTIONS, getCountryName } from '../../../utils/countryMapping';

type CountryMultiSelectProps = {
  value: string[];
  onChange: (countries: string[]) => void;
};

export default function CountryMultiSelect({ value, onChange }: CountryMultiSelectProps) {
  return (
    <Autocomplete
      multiple
      options={COUNTRY_OPTIONS}
      getOptionLabel={(option) => `${option.code} - ${option.name}`}
      value={COUNTRY_OPTIONS.filter((country) => value.includes(country.code))}
      onChange={(_, newValue) => {
        onChange(newValue.map((country) => country.code));
      }}
      renderInput={(params) => (
        <TextField {...params} label="Filter by Country" placeholder="Select countries" />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <span
            key={option.code}
            {...getTagProps({ index })}
            style={{ margin: '2px' }}
          >
            {option.code}
          </span>
        ))
      }
    />
  );
}
