const fs = require('fs');

const files = [
  '../frontend1/src/pages/Bookings/InquiryDetailView.jsx',
  '../frontend1/src/pages/StoreOrders/OrderDetailView.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix all remaining instances of 'const result = await fetchWithAuth'
    content = content.replace(/const result = await fetchWithAuth/g, 'const fetchResult = await fetchWithAuth');
    content = content.replace(/json: async \(\) => result/g, 'json: async () => fetchResult');
    
    fs.writeFileSync(file, content);
    console.log("Fixed: " + file);
  }
});
