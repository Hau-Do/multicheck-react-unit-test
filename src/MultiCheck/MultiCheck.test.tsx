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
});