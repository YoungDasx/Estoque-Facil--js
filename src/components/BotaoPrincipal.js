import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { cores } from '../styles/theme';
export default function BotaoPrincipal({ titulo, onPress, desabilitado, cor, style }) {
  return (
    <TouchableOpacity
      style={[
        s.botao,
        { backgroundColor: desabilitado ? cores.desabilitado : (cor ?? cores.primaria) },
        style,
      ]}
      onPress={onPress}
      disabled={desabilitado}
    >
      <Text style={s.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  botao: { padding: 14, borderRadius: 10, marginTop: 10 },
  texto: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
