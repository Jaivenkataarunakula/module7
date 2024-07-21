const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const port = 8080;

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/login' && method === 'POST') {
        // Handle login and set the cookie with the user's email
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { email } = querystring.parse(body);

            if (email) {
                res.setHeader('Set-Cookie', `email=${email}; HttpOnly`);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Login successful');
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Email is required');
            }
        });
    } else if (url === '/home') {
        // Retrieve cookies from the request
        const cookies = req.headers.cookie;
        let email = '';

        if (cookies) {
            const parsedCookies = cookies.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.split('=').map(c => c.trim());
                acc[key] = value;
                return acc;
            }, {});

            email = parsedCookies.email;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        if (email) {
            res.end(`Welcome to Home Page. Your email: ${email}`);
        } else {
            res.end('Welcome to Home Page. Please log in to see your email.');
        }
    } else if (url === '/status-codes') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const statusCodesInfo = [
            {
                code: 422,
                name: "Unprocessable Entity",
                purpose: "The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.",
                situation: "Often returned when the server cannot process a POST or PUT request due to semantic errors."
            },
            {
                code: 429,
                name: "Too Many Requests",
                purpose: "The user has sent too many requests in a given amount of time ('rate limiting').",
                situation: "Returned when a user exceeds the rate limits defined by the server."
            },
            {
                code: 502,
                name: "Bad Gateway",
                purpose: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
                situation: "Returned when the proxy server gets an invalid response from an external server."
            },
            {
                code: 503,
                name: "Service Unavailable",
                purpose: "The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.",
                situation: "Returned during high traffic events when the server is unable to handle the request due to being overloaded."
            },
            {
                code: 504,
                name: "Gateway Timeout",
                purpose: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
                situation: "Returned when a request times out at the proxy server because the upstream server did not respond in time."
            }
        ];
        res.end(JSON.stringify(statusCodesInfo, null, 2));
    } else {
        let filePath = '.' + url;

        // If the request URL is '/', serve index.html by default
        if (filePath === './') {
            filePath = './index.html';
        }

        // Resolve the file path to its absolute path
        filePath = path.resolve(filePath);

        // Check if the file exists
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // If file not found, respond with 404
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('Error: File not found');
                res.end();
            } else {
                // Determine the content type based on file extension
                let contentType = 'text/html';
                if (filePath.endsWith('.js')) {
                    contentType = 'text/javascript';
                } else if (filePath.endsWith('.css')) {
                    contentType = 'text/css';
                }

                // If file found, respond with the appropriate content type
                res.writeHead(200, { 'Content-Type': contentType });
                res.write(data);
                res.end();
            }
        });
    }
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
