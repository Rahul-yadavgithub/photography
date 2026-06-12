const fs = require('fs');

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
    content = content.replace(/const result = await fetchWithAuth\((.*)\);/g, 'const fetchResult = await fetchWithAuth($1);');
    content = content.replace(/const response = { ok: true, json: async \(\) => result };/g, 'const response = { ok: true, json: async () => fetchResult };');
    fs.writeFileSync(file, content);
  }
});
