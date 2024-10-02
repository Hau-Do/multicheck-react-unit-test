import { useMemo } from "react";
import { Option } from "../../types";

const useCalculatedLayout = (options: Option[], columns: number) => {

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

    return { columnLayout };
};

export default useCalculatedLayout;