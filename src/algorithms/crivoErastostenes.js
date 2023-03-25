function crivoEratostenes(n) {
  // Inicializa uma lista com números de 2 até n
  let numeros = Array.from({length: n-1}, (_, i) => i + 2);
  // Inicializa uma lista vazia para armazenar os primos
  let primos = [];
  // Loop enquanto ainda houver números na lista de números
  while (numeros.length > 0) {
    // Seleciona o primeiro número da lista de números
    let primo = numeros[0];
    // Adiciona o número à lista de primos
    primos.push(primo);
    // Remove todos os múltiplos do número da lista de números
    numeros = numeros.filter((num) => num % primo !== 0);
  }
  return primos;
}

module.exports = crivoEratostenes;
