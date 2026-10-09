import { useState } from 'react';
// Guarda os valores (useState) e as mensagens de erro (useState) de cada campo.
export function useFormulario(regras) {
  const campos = Object.keys(regras);
  const vazio = Object.fromEntries(campos.map((c) => [c, '']));
  const [valores, setValores] = useState(vazio);
  const [erros, setErros] = useState(vazio);
  // ao digitar: atualiza o valor e, se havia erro, revalida (a mensagem some quando corrigido)
  const alterar = (campo, valor) => {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) {
      setErros((prev) => ({ ...prev, [campo]: regras[campo](valor) }));
    }
  };
  // ao sair do campo: valida
  const sair = (campo) => {
    setErros((prev) => ({ ...prev, [campo]: regras[campo](valores[campo]) }));
  };
  const preencher = (novos) => {
    setValores(novos);
    setErros(vazio);
  };
  const limpar = () => {
    setValores(vazio);
    setErros(vazio);
  };
  const formValido = campos.every((c) => regras[c](valores[c]) === '');
  return { valores, erros, alterar, sair, preencher, limpar, formValido };
}
