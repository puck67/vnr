'use client';

import { EventType, Region } from '@/types';
import { getEventTypeName, getRegionName } from '@/lib/utils';

interface MapControlsProps {
  selectedTypes: EventType[];
  selectedRegions: Region[];
  onTypeToggle: (type: EventType) => void;
  onRegionToggle: (region: Region) => void;
  onReset: () => void;
}

export default function MapControls({
  selectedTypes,
  selectedRegions,
  onTypeToggle,
  onRegionToggle,
  onReset,
}: MapControlsProps) {
  const eventTypes: EventType[] = ['uprising', 'movement', 'political_event'];
  const regions: Region[] = ['bac_ky', 'trung_ky', 'nam_ky'];

  return (
    <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">Bộ lọc</h3>
        <button
          onClick={onReset}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Đặt lại
        </button>
      </div>

      {/* Loại sự kiện */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2 text-gray-700">Loại sự kiện</h4>
        <div className="space-y-1">
          {eventTypes.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeToggle(type)}
                className="rounded border-gray-300"
              />
              <span className="text-xs">{getEventTypeName(type)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Vùng miền */}
      <div>
        <h4 className="text-xs font-semibold mb-2 text-gray-700">Vùng miền</h4>
        <div className="space-y-1">
          {regions.map(region => (
            <label key={region} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => onRegionToggle(region)}
                className="rounded border-gray-300"
              />
              <span className="text-xs">{getRegionName(region)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

