import './MultiCheck.css';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {FC} from 'react';

export type Option = {
  label: string,
  value: string
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. All the options (including the "Select All") should be split into several columns, and the order is from top to bottom in each column
 */
type Props = {
  // the label text of the whole component
  label?: string,
  // Assume no duplicated labels or values
  // It may contain any values, so be careful for you "Select All" option
  options: Option[],
  // Always be non-negative integer.
  // The default value is 1
  // 0 is considered as 1
  // We only check [0, 1, 2, ... 10], but it should work for greater number
  columns?: number,
  // Which options should be selected.
  // - If `undefined`, makes the component in uncontrolled mode with no default options checked, but the component is still workable;
  // - if not undefined, it's considered as the default value to render the component. And when it changes, it will be considered as the NEW default value to render the component again
  // - Assume no duplicated values.
  // - It may contain values not in the options.
  values?: string[]
  // if not undefined, when checked options are changed, they should be passed to outside
  // if undefined, the options can still be selected, but won't notify the outside
  onChange?: (options: Option[]) => void,
}

export const MultiCheck: FC<Props> = ({ label, options, columns = 1, values, onChange }) => {
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(values || []));

  useEffect(() => {
    setSelectedValues(new Set(values));
  }, [values]);

  const handleOptionChange = useCallback((value: string) => {
    setSelectedValues((prevValues) => {
      const newValues = new Set(prevValues);
      if (newValues.has(value)) {
        newValues.delete(value);
      } else {
        newValues.add(value);
      }
      onChange?.(options.filter(option => newValues.has(option.value)));
      return newValues;
    });
  }, [options, onChange]);

  const handleSelectAllChange = useCallback(() => {
    setSelectedValues((prevValues) => {
      const allSelected = options.every(option => prevValues.has(option.value));
      const newValues: Set<string> = allSelected ? new Set() : new Set(options.map(option => option.value));
      onChange?.(options.filter(option => newValues.has(option.value)));
      return newValues;
    });
  }, [options, onChange]);

  const isAllSelected = useMemo(() => 
    options.length > 0 && options.every(option => selectedValues.has(option.value)),
    [options, selectedValues]
  );

  const columnLayout = useMemo(() => {
    const allOptions = [{ label: 'Select All', value: 'select-all' }, ...options];
    const totalItems = allOptions.length;
    const baseItemsPerColumn = Math.floor(totalItems / columns);
    const extraItems = totalItems % columns;

    const layout: Option[][] = Array.from({ length: columns }, (_, index) => {
      const columnItems = baseItemsPerColumn + (index < extraItems ? 1 : 0);
      return allOptions.slice(
        index * baseItemsPerColumn + Math.min(index, extraItems),
        index * baseItemsPerColumn + Math.min(index, extraItems) + columnItems
      );
    });

    return layout;
  }, [options, columns]);
  
  return (
    <div className='MultiCheck'>
      {label && <div className="MultiCheck-label">{label}</div>}
      <div className="MultiCheck-columns" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {columnLayout.map((column, columnIndex) => (
          <div key={columnIndex} className="MultiCheck-column">
            {column.map((option) => (
              <label key={option.value} className="MultiCheck-option">
                <input
                  type="checkbox"
                  checked={option.value === 'select-all' ? isAllSelected : selectedValues.has(option.value)}
                  onChange={() => option.value === 'select-all' ? handleSelectAllChange() : handleOptionChange(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
