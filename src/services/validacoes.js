export const obrigatorio = (msg) => (v) => (v.trim() ? '' : msg);
export const validarEmail = (v) => {
  if (!v.trim()) return 'Informe o e-mail';
  if (!v.includes('@')) return 'Digite um e-mail válido';
  return '';
};
export const validarSenha = (v) => {
  if (!v) return 'Informe a senha';
  if (v.length < 6) return 'A senha deve ter no mínimo 6 caracteres';
  return '';
};
export const validarPreco = (v) => {
  if (!v.trim()) return 'Informe o preço do produto';
  const n = Number(v.replace(',', '.'));
  if (isNaN(n) || n <= 0) return 'Informe um preço válido (maior que zero)';
  return '';
};
export const validarQuantidade = (v) => {
  if (!v.trim()) return 'Informe a quantidade';
  const n = Number(v);
  if (isNaN(n) || !Number.isInteger(n) || n <= 0)
    return 'A quantidade deve ser um número inteiro maior que zero';
  return '';
};
// No cadastro de produto a quantidade inicial pode ser zero.
export const validarQuantidadeInicial = (v) => {
  if (!v.trim()) return 'Informe a quantidade';
  const n = Number(v);
  if (isNaN(n) || !Number.isInteger(n) || n < 0) return 'Informe um número inteiro (0 ou mais)';
  return '';
};
// função tradicional + template string
export function formatarPreco(n) {
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}
// função tradicional que retorna uma mensagem (como o gerarBoasVindas da Atividade 03)
export function gerarBoasVindas(nome) {
  return `Olá, ${nome}! Bem-vindo ao EstoqueFácil.`;
}
// arrow function (como o calcularMedia da Atividade 03)
export const calcularValorEmEstoque = (preco, quantidade) => preco * quantidade;
export const ESTOQUE_BAIXO = 5;
