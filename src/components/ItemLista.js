import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores } from '../styles/theme';
export default function ItemLista({ mov, produtoNome }) {
  const entrada = mov.tipo === 'ENTRADA';
  return (
    <View style={s.item}>
      <View style={{ flex: 1 }}>
        {!!produtoNome && <Text style={s.produto}>{produtoNome}</Text>}
        <Text style={s.tipo}>
          {entrada ? 'Entrada' : 'Saída'} - {mov.data}
        </Text>
        {!!mov.observacao && <Text style={s.obs}>{mov.observacao}</Text>}
      </View>
      <Text style={[s.qtd, { color: entrada ? cores.sucesso : cores.erro }]}>
        {entrada ? '+' : '-'}
        {mov.quantidade}
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  produto: { fontWeight: 'bold', color: cores.texto },
  tipo: { color: cores.textoClaro, fontSize: 12 },
  obs: { color: cores.textoClaro, fontSize: 12, fontStyle: 'italic' },
  qtd: { fontSize: 16, fontWeight: 'bold' },
});
