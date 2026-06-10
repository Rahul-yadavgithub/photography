import React from 'react';

function FooterLinksColumn({ title, links }) {
  return (
    <div className="flex flex-col space-y-5">
      <h3 className="text-[13px] font-semibold tracking-[0.1em] text-gray-900 uppercase">{title}</h3>
      <ul className="flex flex-col space-y-3.5">
        {links.map((link, index) => (
          <li key={index}>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-[15px]">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterLinksColumn;
