import { FieldRuleAction } from "./field-rule-action";

export interface FieldRuleEffectedField {
    name: string;
    actions: FieldRuleAction[];
}