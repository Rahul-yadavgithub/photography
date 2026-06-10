import React from 'react';

function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-6 py-2 rounded-md font-bold shadow-md transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
