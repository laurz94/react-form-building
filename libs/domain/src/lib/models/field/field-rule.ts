import { FieldRuleEffectedField } from "./field-rule-effected-field";
import { FieldRuleUpdateEvent } from "./field-rule-update-event";
import { FieldValue } from "./field-value";

export interface FieldRule {
    fieldName: string;
    valueToMatch: FieldValue;
    effectedFields: FieldRuleEffectedField[];
    updateOn: typeof FieldRuleUpdateEvent;
}
