import { ReactNode } from "react";
import { FieldRule } from "./field";
import { FormFieldType } from "./form.configuration";

/**
 * Represents the configuration for a section in a form.
 */
export interface SectionConfiguration {
    /**
     * * A unique identifier for the section input.
     */
    inputId: string;
    /**
     * * The title of the section.
     */
    title: string;
    /**
     * * An optional array of sub-sections or form fields associated with the section.
     * * This is an array of SectionConfiguration | FieldConfiguration | ReadonlyFieldConfiguration objects.
     * * These fields are used to render the form fields in the section.
     */
    fields?: FormFieldType[];
    /**
     * * An optional array of rules applied to the fields in the section.
     * * These rules are used to cross-validate the fields in this section only.
     *  * If you need cross-section rules, use the fieldRules property in the form configuration.
     */
    fieldRules?: FieldRule[];
    /**
     * * Optional child elements or components to be rendered within the section.
     * * This allows for more complex layouts or additional content within the section.
     */
    children?: ReactNode;
    /**
     * * An optional icon associated with the section.
     * * This can be used to visually represent the section's purpose or category.
     */
    icon?: string;
    /**
     * * Indicates whether the section can be collapsed.
     * * If true, the section can be expanded or collapsed by the user.
     */
    collapsable?: boolean;
    /**
     * * Indicates whether the section is initially collapsed.
     * * If true, the section will be displayed in a collapsed state when the form is first rendered.
     */
    isCollapsed?: boolean;
    /**
     * * Indicates whether the section is a subsection of another section.
     * * This can be used to apply different styles or behaviors to subsections.
     */
    isSubSection?: boolean;
    /**
     * * A callback function triggered when a field value within the section changes.
     * * It receives the new value and the name of the field as arguments.
     */
    onChanged?: (value: string | number, fieldName: string) => void;
  }

  export const getDefaultSectionConfiguration = (overrides?: Partial<SectionConfiguration>): SectionConfiguration => {
    return Object.assign({
      inputId: "",
      title: "",
      fields: [],
      fieldRules: [],
      children: null,
      icon: "",
      collapsable: false,
      isCollapsed: false,
      isSubSection: false,
    }, overrides);
  }