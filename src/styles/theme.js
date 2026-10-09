import { StyleSheet } from 'react-native';
export const cores = {
  primaria: '#1A56DB',
  fundo: '#F5F7FA',
  branco: '#FFFFFF',
  texto: '#222222',
  textoClaro: '#666666',
  borda: '#CCCCCC',
  erro: '#D32F2F',
  sucesso: '#2E7D32',
  desabilitado: '#B0BEC5',
};
export const globais = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.texto, marginBottom: 16 },
  label: { fontWeight: 'bold', marginBottom: 4, color: cores.texto },
});
