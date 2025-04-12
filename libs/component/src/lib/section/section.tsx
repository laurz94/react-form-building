import { FieldConfiguration, FieldRule, ReadonlyFieldConfiguration } from '@libs/domain';
import { ReactNode, useState } from 'react';
import styles from './section.module.css';

export interface SectionConfiguration {
  inputId: string;
  title: string;
  fields?: (FieldConfiguration<any> | SectionConfiguration | ReadonlyFieldConfiguration)[];
  fieldRules?: FieldRule[];
  children?: ReactNode;
  icon?: string;
  collapsable?: boolean;
  isCollapsed?: boolean;
  isSubSection?: boolean;

  onChanged?: (value: string | number, fieldName: string) => void;
}

export function Section({
  inputId,
  title,
  fields,
  fieldRules,
  children,
  icon,
  collapsable,
  isCollapsed,
  isSubSection,
  onChanged,
}: SectionConfiguration) {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [toggleIcon, setToggleIcon] = useState(
    isCollapsed ? 'fa-solid fa-plus ' : 'fa-solid fa-minus '
  );
  const toggle = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);
    setToggleIcon(newValue ? 'fa-solid fa-plus ' : 'fa-solid fa-minus ');
  };
  return (
    <section
      key={inputId}
      id={inputId + '-section'}
      className={isSubSection ? styles['sub-section'] : styles['section']}
    >
      {!isSubSection && (
        <header className={styles['header']}>
          {icon && <i className={styles['icon'] + ' ' + icon}></i>}
          <div className={styles['title']}>{title}</div>
          {collapsable && (
            <button
              className={styles['toggle']}
              id="collapse-toggle-button"
              onClick={toggle}
            >
              <i className={toggleIcon + styles['icon']}></i>
            </button>
          )}
        </header>
      )}
      <div className={styles['body']}>
        {(!collapsable || !collapsed) && <>{children}</>}
      </div>
    </section>
  );
}

export default Section;
