import React from 'react';

interface AppTextProps extends React.InputHTMLAttributes<{}> {
  label: string;
}

const AppText: React.FC<AppTextProps> = (props) => {
  const { className, label, ...inputProps } = props;

  return (
    <div className={`relative ${className}`}>
      <input id={label} type="checkbox" {...inputProps} />

      <label className="ml-2" htmlFor={label}>
        {label}
      </label>
    </div>
  );
};

export default AppText;
