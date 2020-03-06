var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'index',
  },
  {
    path: '/internet/',
    url: './internet.html',
    name: 'internet',
  }, 
  {
    path: '/dashboard/',
    url: './dashboard.html',
    name: 'dashboard',
  },
  {
    path: '/vst/',
    url: './vst.html',
    name: 'vst',
  },
  {
    path: '/no_vehdata/:qr_code/',
    url: './no_vehdata.html?qr_code={{qr_code}}',
    name: 'no_vehdata',
  },  
  {
    path: '/add_vst/:qr_code_txt/',
    url: './add_vst.html?qr_code_txt={{qr_code_txt}}',
    name: 'add_vst',
  },  
];
