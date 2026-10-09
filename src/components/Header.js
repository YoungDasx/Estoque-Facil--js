import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores } from '../styles/theme';
export default function Header({ titulo, subtitulo }) {
  return (
    <View style={s.box}>
      <Text style={s.titulo}>{titulo}</Text>
      {!!subtitulo && <Text style={s.subtitulo}>{subtitulo}</Text>}
    </View>
  );
}
const s = StyleSheet.create({
  box: { marginBottom: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto },
  subtitulo: { fontSize: 14, color: cores.textoClaro, marginTop: 2 },
});
