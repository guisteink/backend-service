async function fibonacciNumberRecursive(num){
    if(num < 2) return num;
    else return await fibonacciNumberRecursive(num - 1) + await fibonacciNumberRecursive(num - 2);
};

module.exports = fibonacciNumberRecursive;
