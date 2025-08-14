import React from 'react';


const formatLabel = (key) => {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const DataRow = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-b-0">
    <dt className="font-semibold text-gray-600">{label}:</dt>
    <dd className="col-span-2 text-gray-800">{value.toString()}</dd>
  </div>
);

const SubmissionDataViewer = ({ data }) => {
  return (
    <dl>
      {Object.entries(data).map(([key, value]) => (
        <DataRow key={key} label={formatLabel(key)} value={value} />
      ))}
    </dl>
  );
};

export default SubmissionDataViewer;