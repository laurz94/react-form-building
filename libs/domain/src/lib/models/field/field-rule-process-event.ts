import { FieldRuleUpdateEvent } from "./field-rule-update-event";
import { FieldValue } from "./field-value";

export interface FieldRuleProcessEvent {
    action: FieldRuleUpdateEvent;
    fieldName: string;
    value: FieldValue;
}