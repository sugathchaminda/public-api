module.exports = (req, res, next) => {
  // Add default CORS headers for every request
  res.cors({
    methods: 'GET, PATCH, POST, PUT, DELETE, OPTIONS',
    headers: 'Content-Type, Authorization, Content-Length, X-Requested-With'
  });

  const allowedOrigins = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'https://qipproxy-test.qvalia.com',
    'https://qipproxy-qa.qvalia.com',
    'https://qipproxy.qvalia.com',
    'https://beta.qvalia.com',
    'https://app-test.qvalia.com',
    'https://app-qa.qvalia.com',
    'https://app.qvalia.com'
  ];
  const { origin } = req.headers;
  // console.log('Origin was:', origin);

  if (allowedOrigins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*'); // Won't work with https
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Authorization');

  next();
};
