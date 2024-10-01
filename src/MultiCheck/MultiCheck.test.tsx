import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MultiCheck, Option } from './MultiCheck';

const testOptions: Option[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
];

describe('MultiCheck', () => {
  it('renders the label if label provided', () => {
    render(<MultiCheck label="Test Label" options={testOptions} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders all options including Select All', () => {
    render(<MultiCheck options={testOptions} />);
    expect(screen.getByLabelText('Select All')).toBeInTheDocument();
    testOptions.forEach(option => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  it('checks all options when Select All is clicked', () => {
    render(<MultiCheck options={testOptions} />);
    fireEvent.click(screen.getByLabelText('Select All'));
    testOptions.forEach(option => {
      expect(screen.getByLabelText(option.label)).toBeChecked();
    });
  });

  it('unchecks all options when Select All is clicked twice', () => {
    render(<MultiCheck options={testOptions} />);
    const selectAll = screen.getByLabelText('Select All');
    fireEvent.click(selectAll);
    fireEvent.click(selectAll);
    testOptions.forEach(option => {
      expect(screen.getByLabelText(option.label)).not.toBeChecked();
    });
  });

  it('updates Select All when all options are manually checked', () => {
    render(<MultiCheck options={testOptions} />);
    testOptions.forEach(option => {
      fireEvent.click(screen.getByLabelText(option.label));
    });
    expect(screen.getByLabelText('Select All')).toBeChecked();
  });

  it('updates Select All when any option is unchecked', () => {
    render(<MultiCheck options={testOptions} />);
    fireEvent.click(screen.getByLabelText('Select All'));
    fireEvent.click(screen.getByLabelText(testOptions[0].label));
    expect(screen.getByLabelText('Select All')).not.toBeChecked();
  });

  it('calls onChange with correct values when options are selected', () => {
    const onChange = jest.fn();
    render(<MultiCheck options={testOptions} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText(testOptions[0].label));
    expect(onChange).toHaveBeenCalledWith([testOptions[0]]);
  });  
});