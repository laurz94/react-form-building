
import { ReadonlyFieldConfiguration } from '@libs/domain';
import styles from './readonly-field.module.css';

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

export function ReadonlyField({
  hideLabel,
  hint,
  inputId,
  isCurrency,
  label,
  value,
  valueClassName,
}: ReadonlyFieldConfiguration) {
  return (
    <div className={styles['readonly-field']} data-testid={`${inputId ?? label}-readonly-field`}>
      {!hideLabel && (<div className={styles['label']}>{label}</div>)}
      <div className={`${styles['value']} ${valueClassName ?? ''}`.trim()}>
        {isCurrency ? formatCurrency(+value) : value}
      </div>
      <small className={styles['hint']}>{hint}</small>
    </div>
  );
}

export default ReadonlyField;
