import { FieldRuleActionType } from "./field-rule-action-type";
import { FieldValue } from "./field-value";

export interface FieldRuleAction {
    action: FieldRuleActionType;
    value?: FieldValue;
}