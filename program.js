const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

function convert(value, base) {
    return parseInt(value, base);
}

function solve(testcase) {
    const entries = Object.keys(testcase).filter(k => k !== "keys");
    const k = testcase.keys.k;
    const points = [];

    for (let key of entries) {
        const x = parseInt(key);
        const base = parseInt(testcase[key].base);
        const value = testcase[key].value;
        const y = convert(value, base);
        points.push([x, y]);
        if (points.length === k) break;
    }

    const matrix = [];
    const vector = [];

    for (let i = 0; i < k; i++) {
        const row = [];
        let x = points[i][0];
        for (let power = k - 1; power >= 0; power--) {
            row.push(x ** power);
        }
        matrix.push(row);
        vector.push(points[i][1]);
    }

    function gauss(A, b) {
        const n = A.length;
        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(A[j][i]) > Math.abs(A[maxRow][i])) {
                    maxRow = j;
                }
            }
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [b[i], b[maxRow]] = [b[maxRow], b[i]];

            for (let j = i + 1; j < n; j++) {
                const factor = A[j][i] / A[i][i];
                for (let k = i; k < n; k++) {
                    A[j][k] -= factor * A[i][k];
                }
                b[j] -= factor * b[i];
            }
        }

        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = b[i];
            for (let j = i + 1; j < n; j++) {
                sum -= A[i][j] * x[j];
            }
            x[i] = sum / A[i][i];
        }
        return x;
    }

    const coefficients = gauss(matrix, vector);
    return coefficients[coefficients.length - 1];
}

const c1 = solve(data.testcase1);
const c2 = solve(data.testcase2);

console.log("C for Testcase 1:", c1);
console.log("C for Testcase 2:", c2);
