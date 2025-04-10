import { ReadonlyFieldConfiguration } from '@libs/domain';
import ReadonlyField from '../readonly-field/readonly-field';

export function ReadonlyForm({
  fields,
}: {
  fields: ReadonlyFieldConfiguration[];
}) {
  return (
    <div className="form">
      {fields.map((field, index) => (
        <ReadonlyField key={index} {...field}></ReadonlyField>
      ))}
    </div>
  );
}

export default ReadonlyForm;
