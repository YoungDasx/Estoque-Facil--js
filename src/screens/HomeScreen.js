import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { listarProdutos } from '../storage/storage';
import {
  ESTOQUE_BAIXO,
  calcularValorEmEstoque,
  formatarPreco,
  gerarBoasVindas,
} from '../services/validacoes';
import { cores, globais } from '../styles/theme';
// objeto com informações do aplicativo (como o objeto "aplicativo" da Atividade 05)
const aplicativo = {
  nome: 'EstoqueFácil',
  categoria: 'Gestão',
  quantidadeTelas: 7,
  possuiLogin: true,
};
export default function HomeScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  useFocusEffect(
    useCallback(() => {
      listarProdutos().then(setProdutos);
    }, []),
  );
  // filter: produtos com estoque baixo
  const produtosBaixo = produtos.filter((p) => p.quantidade < ESTOQUE_BAIXO);
  // find: primeiro produto esgotado
  const produtoEsgotado = produtos.find((p) => p.quantidade === 0);
  // map: valor de cada produto em estoque (preço x quantidade)
  const valores = produtos.map((p) => calcularValorEmEstoque(p.preco, p.quantidade));
  let valorTotal = 0;
  valores.forEach((v) => {
    valorTotal += v;
  });
  // template string
  const descricaoApp = `O aplicativo ${aplicativo.nome} pertence à categoria ${aplicativo.categoria} e possui ${aplicativo.quantidadeTelas} telas.`;
  const mostrarResumo = () => {
    Alert.alert(
      'Resumo do estoque',
      `Produtos cadastrados: ${produtos.length}\nEstoque baixo: ${produtosBaixo.length}\nValor total em estoque: ${formatarPreco(valorTotal)}`,
    );
  };
  const abrirSobre = () => {
    Alert.alert('Sobre o app', descricaoApp);
  };
  return (
    <ScrollView style={globais.tela} contentContainerStyle={globais.conteudo}>
      <Text style={s.boasVindas}>{gerarBoasVindas('usuário')}</Text>

      <View style={s.linha}>
        <View style={s.card}>
          <Text style={[s.numero, { color: cores.primaria }]}>{produtos.length}</Text>
          <Text style={s.legenda}>Produtos</Text>
        </View>
        <View style={s.card}>
          <Text style={[s.numero, { color: cores.erro }]}>{produtosBaixo.length}</Text>
          <Text style={s.legenda}>Estoque baixo</Text>
        </View>
      </View>

      <Text style={s.secao}>Valor total em estoque</Text>
      <Text style={s.valor}>{formatarPreco(valorTotal)}</Text>

      <Text style={s.secao}>Produtos com estoque baixo</Text>
      {produtosBaixo.length === 0 ? (
        <Text style={s.legenda}>Nenhum produto com estoque baixo.</Text>
      ) : (
        produtosBaixo.map((p) => (
          <Text key={p.id} style={s.item}>
            - {p.nome} ({p.quantidade} un.)
          </Text>
        ))
      )}

      <Text style={s.secao}>Produto esgotado</Text>
      {produtoEsgotado ? (
        <Text style={[s.item, { color: cores.erro }]}>{produtoEsgotado.nome}</Text>
      ) : (
        <Text style={s.legenda}>Nenhum produto esgotado.</Text>
      )}

      <BotaoPrincipal titulo="PRODUTOS" onPress={() => navigation.navigate('ListaProdutos')} />
      <BotaoPrincipal
        titulo="CADASTRAR PRODUTO"
        onPress={() => navigation.navigate('CadastroProduto')}
      />
      <BotaoPrincipal titulo="CATEGORIAS" onPress={() => navigation.navigate('Categorias')} />

      {/* Button com onPress (Atividade 05 - Questão 9) */}
      <View style={{ marginTop: 14 }}>
        <Button title="Mostrar resumo do estoque" onPress={mostrarResumo} />
      </View>

      {/* TouchableOpacity com Image e texto (Atividade 05 - Questão 10) */}
      <TouchableOpacity style={s.sobre} onPress={abrirSobre}>
        <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={s.imagem} />
        <Text style={s.sobreTexto}>Sobre o aplicativo</Text>
      </TouchableOpacity>

      <BotaoPrincipal titulo="SAIR" cor="#757575" onPress={() => navigation.replace('Login')} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  boasVindas: { fontSize: 20, fontWeight: 'bold', color: cores.texto, marginBottom: 16 },
  linha: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  numero: { fontSize: 32, fontWeight: 'bold' },
  legenda: { color: cores.textoClaro },
  secao: { fontSize: 16, fontWeight: 'bold', marginTop: 18, marginBottom: 6, color: cores.texto },
  valor: { fontSize: 24, fontWeight: 'bold', color: cores.sucesso },
  item: { color: cores.texto, marginBottom: 2 },
  sobre: {
    marginTop: 14,
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: 15,
    borderRadius: 10,
  },
  imagem: { width: 60, height: 60, marginBottom: 8 },
  sobreTexto: { fontWeight: 'bold', color: cores.primaria },
});
