import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import ItemLista from '../components/ItemLista';
import { useFormulario } from '../hooks/useFormulario';
import {
  buscarProduto,
  listarMovimentacoesDoProduto,
  registrarMovimentacao,
} from '../storage/storage';
import { validarQuantidade } from '../services/validacoes';
import { cores, globais } from '../styles/theme';
const regras = { quantidade: validarQuantidade, observacao: () => '' };
export default function MovimentacaoScreen({ route }) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState();
  const [historico, setHistorico] = useState([]);
  const [tipo, setTipo] = useState('ENTRADA');
  const { valores, erros, alterar, sair, limpar, formValido } = useFormulario(regras);
  const carregar = useCallback(() => {
    buscarProduto(produtoId).then(setProduto);
    listarMovimentacoesDoProduto(produtoId).then(setHistorico);
  }, [produtoId]);
  useFocusEffect(carregar);
  const registrar = async () => {
    try {
      await registrarMovimentacao(produtoId, tipo, Number(valores.quantidade), valores.observacao);
      limpar();
      carregar();
      Alert.alert('Sucesso', 'Movimentação registrada com sucesso!');
    } catch (e) {
      Alert.alert('Erro', e?.message ?? 'Não foi possível registrar a movimentação.');
    }
  };
  return (
    <ScrollView
      style={globais.tela}
      contentContainerStyle={globais.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Header
        titulo={produto?.nome ?? 'Produto'}
        subtitulo={`Estoque atual: ${produto?.quantidade ?? 0} unidades`}
      />

      <View style={s.tipos}>
        <TouchableOpacity
          style={[
            s.tipo,
            tipo === 'ENTRADA' && { backgroundColor: cores.sucesso, borderColor: cores.sucesso },
          ]}
          onPress={() => setTipo('ENTRADA')}
        >
          <Text style={[s.tipoTexto, tipo === 'ENTRADA' && { color: '#fff' }]}>ENTRADA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            s.tipo,
            tipo === 'SAIDA' && { backgroundColor: cores.erro, borderColor: cores.erro },
          ]}
          onPress={() => setTipo('SAIDA')}
        >
          <Text style={[s.tipoTexto, tipo === 'SAIDA' && { color: '#fff' }]}>SAÍDA</Text>
        </TouchableOpacity>
      </View>

      <CampoFormulario
        label="Quantidade"
        placeholder="Ex.: 5"
        value={valores.quantidade}
        onChangeText={(t) => alterar('quantidade', t)}
        onBlur={() => sair('quantidade')}
        erro={erros.quantidade}
        keyboardType="numeric"
      />
      <CampoFormulario
        label="Observação"
        placeholder="Motivo (opcional)"
        value={valores.observacao}
        onChangeText={(t) => alterar('observacao', t)}
      />

      <BotaoPrincipal titulo="REGISTRAR" desabilitado={!formValido} onPress={registrar} />

      <Text style={s.hist}>Histórico</Text>
      {historico.length === 0 ? (
        <Text style={{ color: cores.textoClaro }}>Nenhuma movimentação registrada.</Text>
      ) : (
        historico.map((m) => <ItemLista key={m.id} mov={m} />)
      )}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  tipos: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tipo: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    alignItems: 'center',
  },
  tipoTexto: { fontWeight: 'bold', color: cores.texto },
  hist: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 10, color: cores.texto },
});
