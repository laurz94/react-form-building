import { getDefaultFormConfiguration, getDefaultSectionConfiguration } from '@libs/domain';
import './product-builder.css';

export function ProductBuilder() {
  const formFields = Object.keys(getDefaultFormConfiguration());
  const sectionFields = Object.keys(getDefaultSectionConfiguration());

  return (
    <div className='page'>
      <div></div>
      <div className='content'>
        <h1>Welcome to ProductBuilder!</h1>
        <div className='form'>
          <h2>Form Fields</h2>
          {formFields.map((field) => (
            <div key={field} className='form-field'>
              {' '}
              {field}
            </div>
          ))}
        </div>
        <div className='form'>
          <h2>Section Fields</h2>
          {sectionFields.map((field) => (
            <div key={field} className='form-field'>
              {field}
            </div>
          ))}
          </div>
      </div>
      <div></div>
    </div>
  );
}

export default ProductBuilder;
