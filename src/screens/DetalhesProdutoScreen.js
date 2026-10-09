import React, { useCallback, useState } from 'react';
import { ScrollView, Text, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { buscarProduto, excluirProduto, listarCategorias } from '../storage/storage';
import { ESTOQUE_BAIXO, formatarPreco } from '../services/validacoes';
import { cores, globais } from '../styles/theme';
export default function DetalhesProdutoScreen({ navigation, route }) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState();
  const [categorias, setCategorias] = useState([]);
  useFocusEffect(
    useCallback(() => {
      buscarProduto(produtoId).then(setProduto);
      listarCategorias().then(setCategorias);
    }, [produtoId]),
  );
  const confirmarExclusao = () => {
    Alert.alert('Excluir produto', `Tem certeza que deseja excluir "${produto?.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirProduto(produtoId);
          navigation.goBack();
        },
      },
    ]);
  };
  if (!produto) {
    return (
      <ScrollView style={globais.tela} contentContainerStyle={globais.conteudo}>
        <Text>Produto não encontrado.</Text>
      </ScrollView>
    );
  }
  const baixo = produto.quantidade < ESTOQUE_BAIXO;
  const categoria = categorias.find((c) => c.id === produto.categoriaId)?.nome ?? 'Sem categoria';
  return (
    <ScrollView style={globais.tela} contentContainerStyle={globais.conteudo}>
      <Header titulo={produto.nome} subtitulo={`Categoria: ${categoria}`} />

      <Text style={s.rotulo}>Descrição</Text>
      <Text style={s.valor}>{produto.descricao}</Text>

      <Text style={s.rotulo}>Preço</Text>
      <Text style={[s.valor, { color: cores.primaria, fontWeight: 'bold' }]}>
        {formatarPreco(produto.preco)}
      </Text>

      <Text style={s.rotulo}>Em estoque</Text>
      <Text style={[s.valor, { color: baixo ? cores.erro : cores.sucesso, fontWeight: 'bold' }]}>
        {produto.quantidade} unidades {baixo ? '(estoque baixo)' : ''}
      </Text>

      <BotaoPrincipal
        titulo="MOVIMENTAR ESTOQUE"
        onPress={() => navigation.navigate('Movimentacao', { produtoId })}
      />
      <BotaoPrincipal
        titulo="EDITAR"
        cor={cores.sucesso}
        onPress={() => navigation.navigate('CadastroProduto', { produtoId })}
      />
      <BotaoPrincipal titulo="EXCLUIR" cor={cores.erro} onPress={confirmarExclusao} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  rotulo: { fontWeight: 'bold', color: cores.textoClaro, marginTop: 14 },
  valor: { fontSize: 16, color: cores.texto, marginTop: 2 },
});
