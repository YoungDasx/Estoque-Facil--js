import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { useFormulario } from '../hooks/useFormulario';
import { listarCategorias, salvarCategoria } from '../storage/storage';
import { obrigatorio } from '../services/validacoes';
import { cores, globais } from '../styles/theme';
const regras = {
  nome: obrigatorio('O nome da categoria é obrigatório.'),
  descricao: obrigatorio('A descrição é obrigatória.'),
};
export default function CategoriasScreen() {
  const [categorias, setCategorias] = useState([]);
  const { valores, erros, alterar, sair, limpar, formValido } = useFormulario(regras);
  const carregar = useCallback(() => {
    listarCategorias().then(setCategorias);
  }, []);
  useFocusEffect(carregar);
  const adicionar = async () => {
    try {
      await salvarCategoria(valores.nome, valores.descricao);
      limpar();
      carregar();
      Alert.alert('Sucesso', 'Categoria cadastrada com sucesso!');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a categoria.');
    }
  };
  return (
    <ScrollView
      style={globais.tela}
      contentContainerStyle={globais.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Header titulo="Categorias" />

      <CampoFormulario
        label="Nome"
        placeholder="Ex.: Limpeza"
        value={valores.nome}
        onChangeText={(t) => alterar('nome', t)}
        onBlur={() => sair('nome')}
        erro={erros.nome}
      />
      <CampoFormulario
        label="Descrição"
        placeholder="Descreva a categoria"
        value={valores.descricao}
        onChangeText={(t) => alterar('descricao', t)}
        onBlur={() => sair('descricao')}
        erro={erros.descricao}
      />
      <BotaoPrincipal titulo="ADICIONAR CATEGORIA" desabilitado={!formValido} onPress={adicionar} />

      <Text style={s.titulo}>Categorias cadastradas</Text>
      {categorias.map((c) => (
        <View key={c.id} style={s.item}>
          <Text style={s.nome}>{c.nome}</Text>
          <Text style={s.desc}>{c.descricao}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 10, color: cores.texto },
  item: {
    backgroundColor: cores.branco,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  nome: { fontWeight: 'bold', color: cores.texto },
  desc: { color: cores.textoClaro, fontSize: 12 },
});
