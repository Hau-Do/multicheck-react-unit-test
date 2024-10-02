import { renderHook } from '@testing-library/react';
import useCalculatedLayout from './useCalculatedLayout';
import { Option } from '../../types';

describe('useCalculatedLayout hook', () => {
  const createOptions = (count: number): Option[] =>
    Array.from({ length: count }, (_, i) => ({ label: `Option ${i + 1}`, value: `${i + 1}` }));

  it('should distribute options evenly across columns', () => {
    const options = createOptions(5); // 5 options + "Select All" = 6 items total
    const { result } = renderHook(() => useCalculatedLayout(options, 3));

    expect(result.current.columnLayout).toHaveLength(3);
    expect(result.current.columnLayout[0]).toHaveLength(2); // Select All + 1 option
    expect(result.current.columnLayout[1]).toHaveLength(2);
    expect(result.current.columnLayout[2]).toHaveLength(2);
  });

  it('should always place "Select All" in the first column', () => {
    const options = createOptions(5);
    const { result } = renderHook(() => useCalculatedLayout(options, 3));

    expect(result.current.columnLayout[0][0]).toEqual({ label: 'Select All', value: 'select-all' });
  });

  it('should handle more columns than options', () => {
    const options = createOptions(2);
    const { result } = renderHook(() => useCalculatedLayout(options, 5));

    expect(result.current.columnLayout).toHaveLength(5);
    expect(result.current.columnLayout[0]).toHaveLength(1); // Select All
    expect(result.current.columnLayout[1]).toHaveLength(1);
    expect(result.current.columnLayout[2]).toHaveLength(1);
    expect(result.current.columnLayout[3]).toHaveLength(0);
    expect(result.current.columnLayout[4]).toHaveLength(0);
  });

  it('should handle single column case', () => {
    const options = createOptions(5);
    const { result } = renderHook(() => useCalculatedLayout(options, 1));

    expect(result.current.columnLayout).toHaveLength(1);
    expect(result.current.columnLayout[0]).toHaveLength(6); // Select All + 5 options
  });

  it('should distribute options evenly when perfectly divisible', () => {
    const options = createOptions(8);
    const { result } = renderHook(() => useCalculatedLayout(options, 3));

    expect(result.current.columnLayout).toHaveLength(3);
    expect(result.current.columnLayout[0]).toHaveLength(3); // Select All + 2 options
    expect(result.current.columnLayout[1]).toHaveLength(3);
    expect(result.current.columnLayout[2]).toHaveLength(3);
  });

  it('should handle empty options array', () => {
    const { result } = renderHook(() => useCalculatedLayout([], 3));

    expect(result.current.columnLayout).toHaveLength(3);
    expect(result.current.columnLayout[0]).toHaveLength(1); // Only Select All
    expect(result.current.columnLayout[1]).toHaveLength(0);
    expect(result.current.columnLayout[2]).toHaveLength(0);
  });

  it('should handle large number of options', () => {
    const options = createOptions(100);
    const { result } = renderHook(() => useCalculatedLayout(options, 4));

    expect(result.current.columnLayout).toHaveLength(4);
    expect(result.current.columnLayout[0]).toHaveLength(26); // 25 options + Select All
    expect(result.current.columnLayout[1]).toHaveLength(25);
    expect(result.current.columnLayout[2]).toHaveLength(25);
    expect(result.current.columnLayout[3]).toHaveLength(25);
  });

  it('should maintain order of options', () => {
    const options = createOptions(5);
    const { result } = renderHook(() => useCalculatedLayout(options, 3));

    expect(result.current.columnLayout[0][1]).toEqual(options[0]);
    expect(result.current.columnLayout[1][0]).toEqual(options[1]);
    expect(result.current.columnLayout[1][1]).toEqual(options[2]);
    expect(result.current.columnLayout[2][0]).toEqual(options[3]);
    expect(result.current.columnLayout[2][1]).toEqual(options[4]);
  });
});