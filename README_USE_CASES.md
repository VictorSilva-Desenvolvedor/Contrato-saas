# 📋 Casos de Uso — ContratoSaaS

## UC01 — Criar conta e empresa
**Ator:** Administrador  
**Fluxo:**
1. Acessa /login → clica em "Cadastrar"
2. Preenche: Nome da empresa, CNPJ, nome, email, senha
3. Sistema cria Company + User com role=admin
4. Redireciona ao Dashboard

**Resultado:** Empresa isolada no sistema (multi-tenant)

---

## UC02 — Criar template de contrato
**Ator:** Administrador  
**Fluxo:**
1. Menu → Templates → Novo Template
2. Preenche nome, categoria (serviço/obra/locação...)
3. Escreve o conteúdo padrão do contrato
4. Salva

**Resultado:** Template disponível para criação de contratos

---

## UC03 — Criar contrato a partir de template
**Ator:** Usuário  
**Fluxo:**
1. Menu → Contratos → Novo Contrato
2. Seleciona template (opcional) — conteúdo é preenchido automaticamente
3. Preenche: Título, Parte, CPF/CNPJ, Tipo, Valor, Datas
4. Revisa o conteúdo do contrato
5. Salva como Rascunho

**Resultado:** Contrato criado com status "draft"

---

## UC04 — Enviar contrato para assinatura
**Ator:** Usuário  
**Fluxo:**
1. Na listagem de Contratos, clica no ícone de envio
2. Escolhe canal: Email / WhatsApp / Ambos
3. Informa email ou número do destinatário
4. Sistema gera token único e registra SignatureRequest
5. Email é disparado com link de assinatura

**Resultado:** Contrato muda para "pending_signature"; parte recebe link

---

## UC05 — Assinar contrato (parte relacionada)
**Ator:** Parte externa (sem login)  
**Fluxo:**
1. Recebe email com link: /assinar/{token}
2. Vê o contrato completo com dados e valor
3. Lê o aviso legal
4. Clica em "✍️ Assinar Contrato"
5. Sistema atualiza SignatureRequest → signed, Contract → signed

**Resultado:** Contrato assinado; visível no Gerenciador como "Ativo"

---

## UC06 — Monitorar fila de assinaturas
**Ator:** Usuário  
**Fluxo:**
1. Menu → Assinaturas
2. Vê todos os envios com status: Aguardando / Assinado / Expirado
3. Pode copiar o link de assinatura para reenvio manual
4. Pode clicar em "Expirar pendentes antigas" para limpar fila

**Resultado:** Rastreabilidade completa de todas as tentativas

---

## UC07 — Gerenciar vigência de contratos
**Ator:** Usuário  
**Fluxo:**
1. Menu → Gerenciador
2. Vê alerta de contratos vencendo em 30 dias
3. Filtra por: Ativo / Vencendo / Encerrado
4. Para renovar: clica ícone Renovar → cria novo rascunho +1 ano
5. Para aditivo: clica FilePlus → cria rascunho de termo aditivo
6. Para encerrar: clica XCircle → status vira "encerrado"

**Resultado:** Ciclo de vida completo do contrato gerenciado

---

## UC08 — Criar obra vinculada a contrato
**Ator:** Usuário  
**Fluxo:**
1. Menu → Obras → Nova Obra
2. Preenche: Nome, Endereço, Orçamento, Data de Início
3. Vincula a um contrato assinado (opcional)
4. Sistema cria obra + roteiro padrão com 7 etapas

**Resultado:** Obra criada com checklist de fases automático

---

## UC09 — Executar roteiro de obra
**Ator:** Usuário  
**Fluxo:**
1. Menu → Obras → clica na seta da obra
2. Aba "Roteiro" mostra etapas por fase (Planejamento / Execução / Entrega)
3. Clica em cada etapa para marcar como concluída
4. Barra de progresso atualiza automaticamente

**Resultado:** Acompanhamento visual do andamento da obra

---

## UC10 — Lançar custo de obra
**Ator:** Usuário  
**Fluxo:**
1. Detalhe da Obra → aba "Custos"
2. Seleciona categoria: material / mão de obra / equipamento / transporte
3. Preenche descrição, valor e data
4. Clica "Lançar Custo"
5. Barra de budget na listagem atualiza em tempo real

**Resultado:** Controle orçamentário previsto vs realizado

---

## UC11 — Emitir Ordem de Compra
**Ator:** Usuário  
**Fluxo:**
1. Detalhe da Obra → aba "Ordens de Compra"
2. Preenche: CNPJ Pagador, Fornecedor, Itens, Valor Total
3. Clica "Emitir Ordem de Compra"
4. O.C. fica vinculada à obra e visível no histórico

**Resultado:** Ordem de Compra rastreada com CNPJ pagador

---

## UC12 — Registrar vistoria de obra
**Ator:** Usuário  
**Fluxo:**
1. Detalhe da Obra → aba "Vistorias"
2. Vê histórico de vistorias inicial e final
3. (via API) Registra tipo (inicial/final), descrição e fotos

**Resultado:** Comparativo antes/depois da obra documentado

---

## UC13 — Registrar manutenção
**Ator:** Usuário  
**Fluxo:**
1. Detalhe da Obra → aba futura "Manutenções" (já no backend)
2. Preenche: tipo, descrição, executor, custo, data
3. Salva no histórico da obra

**Resultado:** Histórico completo de intervenções no local

---

## UC14 — Gerar relatório de contratos
**Ator:** Usuário / Admin  
**Fluxo:**
1. Menu → Relatórios → aba Contratos
2. Vê: total, valor total, gráfico por tipo, tabela completa
3. Pode filtrar por status e tipo via query

**Resultado:** Visão gerencial consolidada para tomada de decisão

---

## UC15 — Gerenciar usuários da empresa (multi-tenant)
**Ator:** Administrador  
**Fluxo:**
1. Menu → Gestão de Usuários → Novo Usuário
2. Preenche nome, email, senha, role (admin/user)
3. Usuário criado pertence à mesma empresa (companyId)
4. Admin pode ver Audit Log com todas as ações do time

**Resultado:** Isolamento multi-tenant garantido por empresa

---

## UC16 — Upload de fotos de vistoria
**Ator:** Usuário  
**Fluxo:**
1. Envia POST /api/uploads com arquivo + entity=vistoria + entityId
2. Arquivo salvo em /uploads/ com nome único (uuid)
3. URL retornada: /uploads/{uuid}.jpg
4. Caminho armazenado na vistoria

**Resultado:** Registro fotográfico do estado do imóvel