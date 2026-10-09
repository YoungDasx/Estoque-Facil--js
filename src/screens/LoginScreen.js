import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import { useFormulario } from '../hooks/useFormulario';
import { validarEmail, validarSenha } from '../services/validacoes';
import { cores, globais } from '../styles/theme';
const regras = { email: validarEmail, senha: validarSenha };
export default function LoginScreen({ navigation }) {
  const { valores, erros, alterar, sair, formValido } = useFormulario(regras);
  return (
    <View style={[globais.tela, s.container]}>
      <Text style={s.logo}>EstoqueFácil</Text>
      <Text style={s.sub}>Controle de estoque simples</Text>

      <CampoFormulario
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={valores.email}
        onChangeText={(t) => alterar('email', t)}
        onBlur={() => sair('email')}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CampoFormulario
        label="Senha"
        placeholder="Digite sua senha (mín. 6 caracteres)"
        value={valores.senha}
        onChangeText={(t) => alterar('senha', t)}
        onBlur={() => sair('senha')}
        erro={erros.senha}
        secureTextEntry
        autoCapitalize="none"
      />

      <BotaoPrincipal
        titulo="ENTRAR"
        desabilitado={!formValido}
        onPress={() => navigation.replace('Home')}
      />
    </View>
  );
}
const s = StyleSheet.create({
  container: { padding: 24, justifyContent: 'center' },
  logo: { fontSize: 32, fontWeight: 'bold', color: cores.primaria, textAlign: 'center' },
  sub: { textAlign: 'center', color: cores.textoClaro, marginBottom: 30 },
});
