import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CardProduto from '../components/CardProduto';
import { listarCategorias, listarProdutos } from '../storage/storage';
import { cores, globais } from '../styles/theme';
export default function ListaProdutosScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState('');
  useFocusEffect(
    useCallback(() => {
      listarProdutos().then(setProdutos);
      listarCategorias().then(setCategorias);
    }, []),
  );
  const filtrados = produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));
  const nomeCategoria = (id) => categorias.find((c) => c.id === id)?.nome ?? 'Sem categoria';
  return (
    <View style={globais.tela}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <TextInput
          style={s.busca}
          placeholder="Buscar produto..."
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={s.vazio}>
            {produtos.length === 0
              ? 'Nenhum produto cadastrado ainda.'
              : 'Nenhum produto encontrado.'}
          </Text>
        }
        renderItem={({ item }) => (
          <CardProduto
            produto={item}
            categoriaNome={nomeCategoria(item.categoriaId)}
            onPress={() => navigation.navigate('DetalhesProduto', { produtoId: item.id })}
          />
        )}
      />

      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('CadastroProduto')}>
        <Text style={s.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  busca: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 10,
  },
  vazio: { textAlign: 'center', color: cores.textoClaro, marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabTexto: { color: '#fff', fontSize: 32, lineHeight: 36 },
});
