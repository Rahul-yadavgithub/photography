const fs = require('fs');
const path = require('path');

const files = [
  '../frontend1/src/pages/Bookings/InquiryDetailView.jsx',
  '../frontend1/src/pages/Bookings/InquiryListView.jsx',
  '../frontend1/src/pages/StoreOrders/OrderListView.jsx',
  '../frontend1/src/pages/StoreOrders/StoreOrdersDashboard.jsx',
  '../frontend1/src/pages/StoreOrders/OrderDetailView.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add import
    if (!content.includes('useApi')) {
      const depth = file.split('/').length - 4;
      const relativePath = depth === 2 ? '../../hooks/useApi' : '../../../hooks/useApi';
      content = `import { useApi } from '${relativePath}';\n` + content;
    }
    
    // Inject hook
    content = content.replace(/(const [A-Za-z]+ = \([^\)]*\) => {)/, '$1\n  const { fetchWithAuth } = useApi();');
    
    // Replace fetch calls
    content = content.replace(/const response = await fetch\(`\$\{backendUrl\}(\/api\/bookings[^`]*)`(?:,\s*([\s\S]*?))?\);/g, (match, p1, p2) => {
      if (p2) {
        return `const result = await fetchWithAuth('${p1}', ${p2});\n        const response = { ok: true, json: async () => result };`;
      }
      return `const result = await fetchWithAuth('${p1}');\n        const response = { ok: true, json: async () => result };`;
    });
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
