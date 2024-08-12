const http = require('http');
const fs = require('fs');
const qs = require('querystring');

// Function to validate input for sum calculation
function isValidSumInput(input) {
    return /^[\d+\s]+$/.test(input) && !/[^\d+\s]/.test(input);
}

// Function to validate if all characters in the input are digits or whitespace
function isValidNumberInput(input) {
    return /^[\d\s]+$/.test(input);
}

// Function to calculate the sum of numbers in a string
function calculateSum(input) {
    if (!isValidSumInput(input)) {
        return 'Invalid input';
    }
    
    const numbers = input.split('+').map(Number);
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

// Function to modify string to uppercase first and last letters of each word
function uppercaseFirstAndLast(input) {
    return input.split(' ').map(word => {
        if (word.length === 0) return word;
        
        // Capitalize the first and last letters
        const firstLetter = word[0].toUpperCase();
        const lastLetter = word[word.length - 1].toUpperCase();
        
        // Capitalize only the first and last letters, and keep the middle letters unchanged
        if (word.length > 1) {
            return firstLetter + word.slice(1, -1) + lastLetter;
        }
        
        // If the word has only one letter
        return firstLetter;
    }).join(' ');
}

// Function to calculate the average and median
function calculateAverageAndMedian(input) {
    if (!isValidNumberInput(input)) {
        return { average: 'Invalid input', median: 'Invalid input' };
    }

    const numbers = input.split(' ').map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);

    if (numbers.length === 0) {
        return { average: 'Invalid input', median: 'Invalid input' };
    }

    const average = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;

    let median;
    const mid = Math.floor(numbers.length / 2);
    if (numbers.length % 2 === 0) {
        median = (numbers[mid - 1] + numbers[mid]) / 2;
    } else {
        median = numbers[mid];
    }

    return { average, median };
}
// Function to return the first 4 digits from a string
function findFirstFourDigits(input) {
    const parts = input.split(' ');
    for (const part of parts) {
        if (/^\d{4}$/.test(part)) {
            return part;
        }
    }
    return false;
}

// Create the server
http.createServer((req, res) => {
    // Serving the HTML form
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile('exercise1.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    // Handling form submissions
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedData = qs.parse(body);
            const input = parsedData.input.trim();

            let result = '';
            switch (req.url) {
                case '/sum':
                    result = `Sum: ${calculateSum(input)}`;
                    break;
                case '/modify':
                    const modifiedString = uppercaseFirstAndLast(input);
                    result = `Modified String: ${modifiedString}`;
                    break;
                case '/average':
                    const { average, median } = calculateAverageAndMedian(input);
                    result = `Average: ${average}<br>Median: ${median}`;
                    break;
                case '/first-four':
                    result = `First 4-Digits: ${findFirstFourDigits(input)}`;
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                    return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<h1 style="color: green;">Result</h1><p>${result}</p><a href="/" style="color: green; font-weight:bold;">Go Back</a>`);
        });
    }
}).listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
