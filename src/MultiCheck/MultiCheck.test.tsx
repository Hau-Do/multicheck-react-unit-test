import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MultiCheck } from './MultiCheck';
import { Option } from '../types';

const testOptions: Option[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
];

describe('MultiCheck component', () => {
  it('should render the label if label provided', () => {
    render(<MultiCheck label="Test Label" options={testOptions} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render all options including Select All', () => {
    render(<MultiCheck options={testOptions} />);
    expect(screen.getByLabelText('Select All')).toBeInTheDocument();
    testOptions.forEach(option => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  it('should check all options when Select All is clicked', () => {
    render(<MultiCheck options={testOptions} />);
    fireEvent.click(screen.getByLabelText('Select All'));
    testOptions.forEach(option => {
      expect(screen.getByLabelText(option.label)).toBeChecked();
    });
  });

  it('should uncheck all options when Select All is clicked twice', () => {
    render(<MultiCheck options={testOptions} />);
    const selectAll = screen.getByLabelText('Select All');
    fireEvent.click(selectAll);
    fireEvent.click(selectAll);
    testOptions.forEach(option => {
      expect(screen.getByLabelText(option.label)).not.toBeChecked();
    });
  });

  it('should update Select All when all options are manually checked', () => {
    render(<MultiCheck options={testOptions} />);
    testOptions.forEach(option => {
      fireEvent.click(screen.getByLabelText(option.label));
    });
    expect(screen.getByLabelText('Select All')).toBeChecked();
  });

  it('should update Select All when any option is unchecked', () => {
    render(<MultiCheck options={testOptions} />);
    fireEvent.click(screen.getByLabelText('Select All'));
    fireEvent.click(screen.getByLabelText(testOptions[0].label));
    expect(screen.getByLabelText('Select All')).not.toBeChecked();
  });

  it('should call onChange with correct values when options are selected', () => {
    const onChange = jest.fn();
    render(<MultiCheck options={testOptions} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText(testOptions[0].label));
    expect(onChange).toHaveBeenCalledWith([testOptions[0]]);
  });  

  it('should respect initial values prop', () => {
    render(<MultiCheck options={testOptions} values={[testOptions[0].value]} />);
    expect(screen.getByLabelText(testOptions[0].label)).toBeChecked();
    expect(screen.getByLabelText(testOptions[1].label)).not.toBeChecked();
  });

  it('should update when values prop changes', () => {
    const { rerender } = render(<MultiCheck options={testOptions} values={[testOptions[0].value]} />);
    rerender(<MultiCheck options={testOptions} values={[testOptions[1].value]} />);
    expect(screen.getByLabelText(testOptions[0].label)).not.toBeChecked();
    expect(screen.getByLabelText(testOptions[1].label)).toBeChecked();
  });

  it('should render in multiple columns when specified', () => {
    const options: Option[] = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' },
      { label: 'Option 4', value: '4' },
    ];
    
    render(<MultiCheck options={options} columns={2} />);
    
    const columns = screen.getAllByTestId('MultiCheck-column');
    expect(columns).toHaveLength(2);
    
    expect(columns[0].querySelectorAll('input[type="checkbox"]')).toHaveLength(3);
    expect(columns[1].querySelectorAll('input[type="checkbox"]')).toHaveLength(2);
  });

  it('should handle values not in options', () => {
    render(<MultiCheck options={testOptions} values={['non-existent']} />);
    testOptions.forEach(option => {
      expect(screen.getByLabelText(option.label)).not.toBeChecked();
    });
  });

  it('should maintain internal state when onChange is not provided', () => {
    render(<MultiCheck options={testOptions} />);
    fireEvent.click(screen.getByLabelText(testOptions[0].label));
    expect(screen.getByLabelText(testOptions[0].label)).toBeChecked();
  });

  it('should work in uncontrolled mode when values prop is undefined', () => {
    render(<MultiCheck options={testOptions} />);
    fireEvent.click(screen.getByLabelText(testOptions[0].label));
    expect(screen.getByLabelText(testOptions[0].label)).toBeChecked();
  });
});