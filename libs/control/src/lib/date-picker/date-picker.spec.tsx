import { render, screen, fireEvent } from '@testing-library/react';
import LibDatePicker from './date-picker';
import { FieldConfiguration, DatePickerConfiguration } from '@libs/domain';

describe('LibDatePicker', () => {
	const mockConfig: FieldConfiguration<DatePickerConfiguration> = {
		inputId: 'test-date-picker',
		isDisabled: false,
		controlConfig: {
			minDate: '2023-01-01',
			maxDate: '2023-12-31',
		},
	};

	it('should render the date picker with correct attributes', () => {
		render(<LibDatePicker config={mockConfig}></LibDatePicker>);
		const input = screen.getByTestId('test-date-picker-date-picker');

		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'date');
		expect(input).toHaveAttribute('id', 'test-date-picker-date-picker');
		expect(input).toHaveAttribute('min', '2023-01-01');
		expect(input).toHaveAttribute('max', '2023-12-31');
		expect(input).not.toBeDisabled();
	});

	it('should call onBlurred with the correct value when blurred', () => {
		const handleBlurred = jest.fn();
		render(<LibDatePicker config={mockConfig} onBlurred={handleBlurred} initialValue="2023-06-15" />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		fireEvent.blur(input);

		expect(handleBlurred).toHaveBeenCalledWith('2023-06-15');
	});

	it('should call onChanged with the correct value when changed', () => {
		const handleChanged = jest.fn();
		render(<LibDatePicker config={mockConfig} onChanged={handleChanged} />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		fireEvent.change(input, { target: { value: '2023-07-20' } });

		expect(handleChanged).toHaveBeenCalledWith('2023-07-20');
	});

	it('should call onFocused with the correct value when focused', () => {
		const handleFocused = jest.fn();
		render(<LibDatePicker config={mockConfig} onFocused={handleFocused} initialValue="2023-06-15" />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		fireEvent.focus(input);

		expect(handleFocused).toHaveBeenCalledWith('2023-06-15');
	});

	it('should apply the provided className', () => {
		render(<LibDatePicker config={mockConfig} className="custom-class" />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		expect(input).toHaveClass('form-control custom-class');
	});

	it('should disable the input when isDisabled is true', () => {
		const disabledConfig = { ...mockConfig, isDisabled: true };
		render(<LibDatePicker config={disabledConfig} />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		expect(input).toBeDisabled();
	});

	it('should render with an empty value if no initialValue is provided', () => {
		render(<LibDatePicker config={mockConfig} />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		expect(input).toHaveValue('');
	});

	it('should render with the provided initialValue', () => {
		render(<LibDatePicker config={mockConfig} initialValue="2023-05-10" />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		expect(input).toHaveValue('2023-05-10');
	});

	it('should not call onBlurred if not provided', () => {
		render(<LibDatePicker config={mockConfig} initialValue="2023-06-15" />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		fireEvent.blur(input);

		// No assertion needed, just ensuring no errors occur
	});

	it('should not call onChanged if not provided', () => {
		render(<LibDatePicker config={mockConfig} />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		fireEvent.change(input, { target: { value: '2023-07-20' } });

		// No assertion needed, just ensuring no errors occur
	});

	it('should not call onFocused if not provided', () => {
		render(<LibDatePicker config={mockConfig} initialValue="2023-06-15" />);
		const input = screen.getByTestId('test-date-picker-date-picker');

		fireEvent.focus(input);

		// No assertion needed, just ensuring no errors occur
	});
});
