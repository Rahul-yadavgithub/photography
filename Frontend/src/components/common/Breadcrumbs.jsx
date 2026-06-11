import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items, theme = 'light', className = '' }) => {
  const isDark = theme === 'dark';
  
  const baseText = isDark ? 'text-zinc-400' : 'text-gray-500';
  const hoverText = isDark ? 'hover:text-white' : 'hover:text-gray-900';
  const activeText = isDark ? 'text-white' : 'text-gray-900';
  const dividerColor = isDark ? 'text-zinc-600' : 'text-gray-400';

  return (
    <nav className={`flex items-center space-x-2 text-sm font-medium ${className || 'pb-6 pt-4'} ${baseText}`}>
      <Link to="/" className={`${hoverText} transition-colors flex items-center`}>
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className={`w-4 h-4 shrink-0 mx-1 ${dividerColor}`} />
          {index === items.length - 1 ? (
            <span className={`${activeText} font-bold truncate max-w-[200px] sm:max-w-xs`}>{item.label}</span>
          ) : (
            <Link to={item.path} className={`${hoverText} transition-colors truncate max-w-[150px] sm:max-w-xs`}>
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
