export interface DropdownConfiguration {
  options: DropdownOption[];
}

export interface DropdownOption {
  label: string;
  value: string | boolean | number;
}
