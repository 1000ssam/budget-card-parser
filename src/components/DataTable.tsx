'use client';

import { ParsedRow } from '@/lib/parser';

interface DataTableProps {
  headers: string[];
  rows: ParsedRow[];
}

export default function DataTable({ headers, rows }: DataTableProps) {
  if (headers.length === 0 || rows.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-auto border border-[#e5e5e5] rounded-xl shadow-sm bg-white">
      <div className="max-h-[600px] overflow-auto">
        <table className="min-w-full divide-y divide-[#e5e5e5]">
          <thead className="bg-[#fafafa] sticky top-0 z-10">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-5 py-3.5 text-left text-xs font-medium text-[#525252] uppercase tracking-wider whitespace-nowrap border-r border-[#e5e5e5] last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#e5e5e5]">
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-[#fafafa] transition-colors"
              >
                {headers.map((header, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-5 py-3 text-sm text-[#171717] whitespace-nowrap border-r border-[#e5e5e5] last:border-r-0 select-text"
                  >
                    {row[header] !== undefined && row[header] !== null
                      ? String(row[header])
                      : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
