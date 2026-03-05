import React from 'react';

import { Autocomplete, TextField } from '@mui/material';

import { LANGUAGE_OPTIONS } from '../../../utils/countryMapping';

type LanguageMultiSelectProps = {
  value: string[];
  onChange: (languages: string[]) => void;
};

export default function LanguageMultiSelect({ value, onChange }: LanguageMultiSelectProps) {
  return (
    <Autocomplete
      multiple
      options={LANGUAGE_OPTIONS}
      getOptionLabel={(option) => `${option.name} (${option.code})`}
      value={LANGUAGE_OPTIONS.filter((lang) => value.includes(lang.code))}
      onChange={(_, newValue) => {
        onChange(newValue.map((lang) => lang.code));
      }}
      renderInput={(params) => (
        <TextField {...params} label="Preferred Language" placeholder="Select languages" />
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
