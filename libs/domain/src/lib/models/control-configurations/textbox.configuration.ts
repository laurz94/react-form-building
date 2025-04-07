export interface TextboxConfiguration {
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  placeholder?: string;
  onInput?: (event: any) => void;
}
