import { render } from '@testing-library/react';

import { ReadonlyFieldConfiguration } from '@libs/domain';
import ReadonlyForm from './readonly-form';

describe('ReadonlyForm', () => {
  const fields: ReadonlyFieldConfiguration[] = [
    { label: 'First Name', value: 'Ted', hint: 'Name given at birth' },
    { label: 'Last Name', value: 'Lasso', hint: 'Family or Sur Name' },
    { label: 'Salary', value: 1000000, isCurrency: true },
    {
      label: 'Home State',
      value: 'Kansas',
      hideLabel: true,
      valueClassName: 'emphasized-value',
    },
  ];
  it('should render successfully', () => {
    const { baseElement } = render(<ReadonlyForm fields={fields} />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div
            class="form"
          >
            <div
              class="readonly-field"
              data-testid="First Name-readonly-field"
            >
              <div
                class="label"
              >
                First Name
              </div>
              <div
                class="value"
              >
                Ted
              </div>
              <small
                class="hint"
              >
                Name given at birth
              </small>
            </div>
            <div
              class="readonly-field"
              data-testid="Last Name-readonly-field"
            >
              <div
                class="label"
              >
                Last Name
              </div>
              <div
                class="value"
              >
                Lasso
              </div>
              <small
                class="hint"
              >
                Family or Sur Name
              </small>
            </div>
            <div
              class="readonly-field"
              data-testid="Salary-readonly-field"
            >
              <div
                class="label"
              >
                Salary
              </div>
              <div
                class="value"
              >
                $1,000,000.00
              </div>
              <small
                class="hint"
              />
            </div>
            <div
              class="readonly-field"
              data-testid="Home State-readonly-field"
            >
              <div
                class="value emphasized-value"
              >
                Kansas
              </div>
              <small
                class="hint"
              />
            </div>
          </div>
        </div>
      </body>
    `);
  });
});
