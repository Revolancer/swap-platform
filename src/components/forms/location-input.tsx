import { FieldHookConfig, useField } from 'formik';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { config } from '@revolancer/ui';
import { relative } from 'path';

const { theme } = config;

export const LocationInput = (props: FieldHookConfig<any>) => {
  const [field, meta, helpers] = useField(props);
  const { value } = meta;
  const { setValue } = helpers;
  return (
    <GooglePlacesAutocomplete
      apiKey={process.env.NEXT_PUBLIC_MAPS_KEY}
      selectProps={{
        ...field,
        value,
        onChange: (newValue) => {
          setValue(newValue);
        },
        styles: {
          control: (provided, state) => ({
            ...provided,
            borderRadius: theme.radii['1'],
            boxShadow: theme.shadows['2'],
            borderColor: state.isFocused
              ? theme.colors['navy500']
              : theme.colors['neutral400'],
            borderWidth: state.isFocused
              ? theme.borderWidths['2']
              : theme.borderWidths['1'],
            paddingBlock: theme.sizes['3'],
            paddingInline: theme.sizes['5'],
            '&:hover': {
              backgroundColor: theme.colors['neutral100'],
            },
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            paddingBlock: 0,
            paddingInline: 0,
            color: theme.colors['neutral800'],
            '&:hover': {
              color: theme.colors['neutral800'],
            },
          }),
          indicatorSeparator: (provided, state) => ({
            ...provided,
            width: 0,
            paddingBlock: 0,
            paddingInline: 0,
          }),
          valueContainer: (provided, state) => ({
            ...provided,
            paddingBlock: 0,
            paddingInline: 0,
          }),
          input: (provided, state) => ({
            ...provided,
            paddingBlock: 0,
            paddingInline: 0,
            marginBlock: 0,
            marginInline: 0,
          }),
          menu: (provided, state) => ({
            ...provided,
            boxShadow: theme.shadows['1'],
            borderColor: theme.colors['neutral400'],
            borderWidth: theme.borderWidths['1'],
            borderRadius: theme.radii['1'],
          }),
          option: (provided, state) => ({
            ...provided,
            fontWeight: state.isFocused
              ? theme.fontWeights['bold']
              : theme.fontWeights['normal'],
            backgroundColor: state.isSelected
              ? theme.colors['navy300']
              : state.isFocused
                ? theme.colors['navy100']
                : 'unset',
            color: theme.colors['neutral900'],
          }),
        },
      }}
    />
  );
};
