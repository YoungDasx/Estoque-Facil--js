import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { cores } from '../styles/theme';
export default function CampoFormulario({ label, erro, style, ...rest }) {
  return (
    <View style={s.grupo}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        {...rest}
        placeholderTextColor="#999"
        style={[s.input, !!erro && s.inputErro, style]}
      />
      {!!erro && <Text style={s.erro}>{erro}</Text>}
    </View>
  );
}
const s = StyleSheet.create({
  grupo: { marginBottom: 14 },
  label: { fontWeight: 'bold', marginBottom: 4, color: cores.texto },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 10,
    backgroundColor: cores.branco,
  },
  inputErro: { borderColor: cores.erro },
  erro: { color: cores.erro, marginTop: 4, fontSize: 13 },
});
