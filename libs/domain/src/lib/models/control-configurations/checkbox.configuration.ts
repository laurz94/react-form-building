export interface CheckboxConfiguration {
  options: CheckboxOption[];
}

export interface CheckboxOption {
  label: string;
  value: string | boolean | number;
}
