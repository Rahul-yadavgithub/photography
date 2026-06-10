import React from 'react';

function FooterBottomRow() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-gray-200/60 mt-12 text-[14px] text-gray-500">
      <p>© 2026 book my wed. All rights reserved.</p>
      <div className="flex space-x-8 mt-4 md:mt-0 font-medium">
        <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
        <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
        <a href="#" className="hover:text-gray-900 transition-colors">Sitemap</a>
      </div>
    </div>
  );
}

export default FooterBottomRow;
