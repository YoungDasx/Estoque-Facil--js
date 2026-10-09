import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import Header from '../components/Header';
import { useFormulario } from '../hooks/useFormulario';
import { buscarProduto, listarCategorias, salvarProduto } from '../storage/storage';
import { obrigatorio, validarPreco, validarQuantidadeInicial } from '../services/validacoes';
import { cores, globais } from '../styles/theme';
const regras = {
  nome: obrigatorio('O nome é obrigatório.'),
  descricao: obrigatorio('A descrição é obrigatória.'),
  categoria: obrigatorio('Selecione uma categoria.'),
  preco: validarPreco,
  quantidade: validarQuantidadeInicial,
};
export default function CadastroProdutoScreen({ navigation, route }) {
  const produtoId = route.params?.produtoId;
  const { valores, erros, alterar, sair, preencher, formValido } = useFormulario(regras);
  const [categorias, setCategorias] = useState([]);
  useFocusEffect(
    useCallback(() => {
      listarCategorias().then(setCategorias);
    }, []),
  );
  // modo edição: carrega os dados do produto
  React.useEffect(() => {
    if (!produtoId) return;
    buscarProduto(produtoId).then((p) => {
      if (p) {
        preencher({
          nome: p.nome,
          descricao: p.descricao,
          categoria: String(p.categoriaId),
          preco: String(p.preco),
          quantidade: String(p.quantidade),
        });
      }
    });
  }, [produtoId]);
  const salvar = async () => {
    try {
      await salvarProduto(
        {
          nome: valores.nome.trim(),
          descricao: valores.descricao.trim(),
          categoriaId: Number(valores.categoria),
          preco: Number(valores.preco.replace(',', '.')),
          quantidade: Number(valores.quantidade),
        },
        produtoId,
      );
      Alert.alert(
        'Sucesso',
        produtoId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o produto. Tente novamente.');
    }
  };
  return (
    <ScrollView
      style={globais.tela}
      contentContainerStyle={globais.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Header titulo={produtoId ? 'Editar Produto' : 'Cadastro de Produto'} />

      <CampoFormulario
        label="Nome do Produto"
        placeholder="Ex.: Caderno universitário"
        value={valores.nome}
        onChangeText={(t) => alterar('nome', t)}
        onBlur={() => sair('nome')}
        erro={erros.nome}
      />

      <CampoFormulario
        label="Descrição"
        placeholder="Descreva o produto"
        value={valores.descricao}
        onChangeText={(t) => alterar('descricao', t)}
        onBlur={() => sair('descricao')}
        erro={erros.descricao}
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
      />

      <Text style={globais.label}>Categoria</Text>
      <View style={s.chips}>
        {categorias.map((c) => {
          const ativo = valores.categoria === String(c.id);
          return (
            <TouchableOpacity
              key={c.id}
              style={[s.chip, ativo && s.chipAtivo]}
              onPress={() => {
                alterar('categoria', String(c.id));
                sair('categoria');
              }}
            >
              <Text style={[s.chipTexto, ativo && { color: '#fff' }]}>{c.nome}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!erros.categoria && <Text style={s.erro}>{erros.categoria}</Text>}

      <View style={{ height: 14 }} />

      <CampoFormulario
        label="Preço"
        placeholder="Ex.: 49.90"
        value={valores.preco}
        onChangeText={(t) => alterar('preco', t)}
        onBlur={() => sair('preco')}
        erro={erros.preco}
        keyboardType="numeric"
      />

      <CampoFormulario
        label="Quantidade"
        placeholder="Ex.: 10"
        value={valores.quantidade}
        onChangeText={(t) => alterar('quantidade', t)}
        onBlur={() => sair('quantidade')}
        erro={erros.quantidade}
        keyboardType="numeric"
      />

      <BotaoPrincipal
        titulo={produtoId ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR'}
        desabilitado={!formValido}
        onPress={salvar}
      />
      <BotaoPrincipal titulo="CANCELAR" cor="#757575" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
  },
  chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { color: cores.texto },
  erro: { color: cores.erro, marginTop: 4, fontSize: 13 },
});
