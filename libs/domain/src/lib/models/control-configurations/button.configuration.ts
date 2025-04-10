import { ButtonType } from "./button-type";

export interface ButtonConfiguration {
    id: string;
    icon?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    label?: string;
    type: ButtonType;
    onClicked?: () => void;
}