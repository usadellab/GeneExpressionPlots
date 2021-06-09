import React from 'react';

export default function GeneCard({ color, accession, geneInfo, ...props }) {
  return (
    <div className={props.className}>
      <div className="flex items-center mb-4">
        <div
          className={`font-semibold text-lg ${props.className}`}
          style={{ color: color ?? '' }}
        >
          {accession}
        </div>
        {props.actions}
      </div>
      {geneInfo.size > 0
        ? [...geneInfo.entries()].map(([colName, cellValue]) => (
          <div key={`${accession}-${colName}`} className="flex">
            <div className="flex flex-shrink-0 ml-2 py-1 w-36 uppercase text-yellow-700">
              {colName}
            </div>
            <div className="flex ml-5 py-1 break-all">{cellValue}</div>
          </div>
        ))
        : 'No information available for this gene.'}
    </div>
  );
}
