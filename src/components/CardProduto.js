import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { cores } from '../styles/theme';
import { ESTOQUE_BAIXO, formatarPreco } from '../services/validacoes';
export default function CardProduto({ produto, categoriaNome, onPress }) {
  const baixo = produto.quantidade < ESTOQUE_BAIXO;
  return (
    <TouchableOpacity style={s.card} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={s.nome}>{produto.nome}</Text>
        <Text style={s.categoria}>{categoriaNome}</Text>
        <Text style={s.preco}>{formatarPreco(produto.preco)}</Text>
      </View>
      <View style={[s.badge, { backgroundColor: baixo ? cores.erro : cores.sucesso }]}>
        <Text style={s.badgeTexto}>Qtd: {produto.quantidade}</Text>
      </View>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  nome: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  categoria: { fontSize: 12, color: cores.textoClaro, marginTop: 2 },
  preco: { fontSize: 14, fontWeight: 'bold', color: cores.primaria, marginTop: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
