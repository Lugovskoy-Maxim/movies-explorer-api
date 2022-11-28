const allowedCors = [ // список разрешенных адресов
  'https://api.lugovskoy-movies.nomoredomains.club',
  'http://api.lugovskoy-movies.nomoredomains.club',
  'https://jsdeveloper.ru',
  'http://jsdeveloper.ru',
  'https://lugovskoy-movies.nomoredomains.club',
  'http://lugovskoy-movies.nomoredomains.club',
  'http://localhost:3000',
  'http://localhost:3001',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,FETCH';
module.exports.cors = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;

  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
