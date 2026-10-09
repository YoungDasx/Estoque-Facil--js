import AsyncStorage from '@react-native-async-storage/async-storage';
const CHAVES = {
  categorias: '@estoque:categorias',
  produtos: '@estoque:produtos',
  movimentacoes: '@estoque:movimentacoes',
};
async function ler(chave, padrao) {
  try {
    const valor = await AsyncStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch {
    return padrao;
  }
}
async function salvar(chave, valor) {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}
const CATEGORIAS_INICIAIS = [
  { id: 1, nome: 'Informática', descricao: 'Computadores e acessórios' },
  { id: 2, nome: 'Material Escolar', descricao: 'Cadernos, canetas e afins' },
  { id: 3, nome: 'Eletrônicos', descricao: 'Aparelhos eletrônicos' },
];
// ---------- Categorias ----------
export async function listarCategorias() {
  const lista = await ler(CHAVES.categorias, null);
  if (lista === null) {
    await salvar(CHAVES.categorias, CATEGORIAS_INICIAIS);
    return CATEGORIAS_INICIAIS;
  }
  return lista;
}
export async function salvarCategoria(nome, descricao) {
  const lista = await listarCategorias();
  lista.push({ id: Date.now(), nome: nome.trim(), descricao: descricao.trim() });
  await salvar(CHAVES.categorias, lista);
}
// ---------- Produtos ----------
export const listarProdutos = () => ler(CHAVES.produtos, []);
export async function buscarProduto(id) {
  return (await listarProdutos()).find((p) => p.id === id);
}
export async function salvarProduto(dados, id) {
  const lista = await listarProdutos();
  if (id) {
    const i = lista.findIndex((p) => p.id === id);
    if (i >= 0) lista[i] = { ...lista[i], ...dados };
  } else {
    lista.push({ ...dados, id: Date.now() });
  }
  await salvar(CHAVES.produtos, lista);
}
export async function excluirProduto(id) {
  const produtos = (await listarProdutos()).filter((p) => p.id !== id);
  const movs = (await listarMovimentacoes()).filter((m) => m.produtoId !== id);
  await salvar(CHAVES.produtos, produtos);
  await salvar(CHAVES.movimentacoes, movs);
}
// ---------- Movimentações ----------
export const listarMovimentacoes = () => ler(CHAVES.movimentacoes, []);
export async function listarMovimentacoesDoProduto(produtoId) {
  const lista = await listarMovimentacoes();
  return lista.filter((m) => m.produtoId === produtoId).sort((a, b) => b.id - a.id);
}
// Registra a movimentação e atualiza a quantidade do produto.
export async function registrarMovimentacao(produtoId, tipo, quantidade, observacao) {
  const produtos = await listarProdutos();
  const i = produtos.findIndex((p) => p.id === produtoId);
  if (i < 0) throw new Error('Produto não encontrado.');
  if (tipo === 'SAIDA' && quantidade > produtos[i].quantidade) {
    throw new Error('Quantidade de saída maior que o estoque disponível.');
  }
  produtos[i].quantidade += tipo === 'ENTRADA' ? quantidade : -quantidade;
  const movs = await listarMovimentacoes();
  movs.push({
    id: Date.now(),
    tipo,
    quantidade,
    data: new Date().toLocaleString('pt-BR'),
    observacao: observacao.trim(),
    produtoId,
  });
  await salvar(CHAVES.produtos, produtos);
  await salvar(CHAVES.movimentacoes, movs);
}
