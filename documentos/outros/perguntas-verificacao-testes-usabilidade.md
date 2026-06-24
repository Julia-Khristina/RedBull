# Perguntas de Verificação para Início dos Testes de Usabilidade

**Projeto:** Red Bull 24 Horas  
**Artefato:** 15 — Perguntas de verificação para início dos testes  
**Seção WAD:** 5.2.1 b)  

---

## Descrição

Este documento contém as perguntas de verificação que devem ser respondidas antes do início dos testes de usabilidade, garantindo que o ambiente e os pré-requisitos estejam devidamente configurados para a realização dos testes.

---

## Perguntas de Verificação

1. O sistema permite cadastrar uma nova competição com nome, data e local obrigatórios, bloqueando o envio quando algum desses campos estiver vazio?

2. Ao salvar uma equipe, o sistema gera automaticamente um UUID único e exibe o botão "Copiar link" no card da equipe, permitindo que o link seja copiado corretamente para a área de transferência?

3. O painel operacional da equipe exibe corretamente os três blocos definidos na especificação: área de controle do juiz, fluxo de registro de checkpoint e tabela de dados da equipe, com o dropdown de atletas listando todos os membros da equipe selecionada?

4. Ao fotografar a tela da esteira, o sistema abre a câmera, captura a imagem e exibe o preview com os dados extraídos via OCR (distância em km, pace em min/km e tempo total), marcando em vermelho os campos com discrepância em relação à média histórica do atleta?

5. Ao confirmar um checkpoint, o sistema registra corretamente o dado no histórico da equipe, atualiza a contagem de etapas concluídas em tempo real e impede o registro duplicado caso o mesmo atleta tente registrar novamente dentro do intervalo mínimo definido?

6. O Dashboard exibe, para cada competição ativa, o número total de equipes cadastradas, o status de cada equipe (ativa/inativa) e o ranking parcial por distância acumulada?

7. A tela pública de acompanhamento da equipe (acessada via UUID) exibe corretamente o ranking parcial da equipe, o status atual do corredor em pista e a calculadora de descanso com os dados atualizados em tempo real?

8. O sistema exibe corretamente um aviso de inconsistência quando a distância registrada via OCR diverge significativamente da média histórica do atleta, permitindo que o operador revise o dado antes de confirmar?

9. A exportação de relatórios gera corretamente um arquivo com os dados históricos completos da competição, incluindo checkpoints, atletas, distâncias e timestamps de cada registro?

10. Quando a OCR falha em reconhecer os dados da tela da esteira (imagem borrada ou mal enquadrada), o sistema exibe uma mensagem de erro orientativa informando o motivo e oferece a opção de retomar a captura sem perder os dados já preenchidos no formulário de checkpoint?

---

## Critérios de Verificação

Cada pergunta deve ser respondida com:
- **SIM** — funcionalidade verificada e funcionando conforme especificado
- **NÃO** — funcionalidade não implementada ou com defeito
- **PARCIAL** — funcionalidade implementada parcialmente

---

*Documento gerado para a Sprint 05 — Testes de Usabilidade (Seção 5.2 do WAD)*