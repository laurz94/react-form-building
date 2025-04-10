import { ButtonConfiguration } from './button.configuration';
import styles from './button.module.css';

export function LibButton({
  icon,
  id,
  isDisabled,
  isLoading,
  label,
  type,
  onClicked,
}: ButtonConfiguration) {
  function getIcon() {
    if (isLoading) {
      return (
        <i
          className={'icon fa-solid fa-spinner fa-spin-pulse' + styles['icon']}
          data-testid={id + '-button-loading-icon'}
        ></i>
      );
    } else if (icon) {
      return (
        <i
          className={icon + ' ' + styles['icon']}
          data-testid={id + '-button-icon'}
        ></i>
      );
    } else {
      return '';
    }
  }

  return (
    <button
      type="button"
      className={`${styles['lib-button']} ${styles[type]}`}
      id={id + '-button'}
      data-testid={id + '-button'}
      disabled={isDisabled}
      onClick={onClicked}
    >
      {getIcon()}
      {label}
    </button>
  );
}
