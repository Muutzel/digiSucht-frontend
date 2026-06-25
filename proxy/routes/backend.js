const { createProxyMiddleware } = require('http-proxy-middleware');

const apiUrl = process.env.REACT_APP_API_URL;

module.exports = () => {
	if (!apiUrl) return [];

	const target = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;

	return [
		{
			name: 'backend-proxy',
			middleware: createProxyMiddleware({
				target,
				changeOrigin: true,
				secure: false,
				xfwd: true,
				on: {
					error: (err, req, res) => {
						console.error('[backend-proxy] error:', err.message);
						if (res && !res.headersSent) {
							res.writeHead(502, { 'Content-Type': 'text/plain' });
							res.end('Proxy error: ' + err.message);
						}
					}
				}
			})
		}
	];
};
