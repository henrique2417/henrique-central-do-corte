# Product Requirements Document (PRD) — Central do Corte

## 1. Problema
A Central do Corte visa solucionar os gargalos operacionais gerados em barbearias de alto fluxo. 

**Qual dor existe hoje?** O cenário atual é marcado por filas de espera presenciais exaustivas e pela utilização de métodos de agendamento manuais, descentralizados e ineficientes, como cadernos físicos ou mensagens instantâneas.Adicionalmente, há períodos de ociosidade alternados com momentos de superlotação
**Quem sofre com essa dor?** O profissional/barbeiro, que sofre com a ineficiência operacional e a dificuldade de gerenciar sua demanda e sua agenda.
    O cliente, que lida com a frustração do tempo excessivo de espera, o que muitas vezes o leva a desistir do serviço.
**Por que essa solução é necessária?** Para modernizar a gestão de atendimento, eliminar a ociosidade da agenda, controlar melhor os horários de pico e garantir uma experiência de atendimento superior e sem frustrações para o cliente.

---

## 2. Público-Alvo
O sistema foi desenhado para atender a duas pontas distintas da jornada de serviços de barbearia:
**Gestores e Barbeiros Autônomos:** Profissionais que operam barbearias com alto fluxo de clientes diários, precisando de ferramentas visuais e ágeis para gerenciar sua rotina de cortes, serviços e preços sem interromper o trabalho.
**Clientes que as frequentam:** Pessoas que frequentam essas barbearias e valorizam a conveniência, a previsibilidade e a otimização do seu próprio tempo, preferindo agendar seus cortes antecipadamente a ter que esperar horas presencialmente.

---

## 3. Funcionalidades
**Para o Cliente:**
**Realizar cadastro:** Criar um perfil no sistema para facilitar identificações e agendamentos futuros.
**Visualizar horários em tempo real:** Consultar a disponibilidade da barbearia de forma autônoma para melhor planejamento
**Solicitar agendamentos:** Reservar um horário na agenda da barbearia sem a necessidade de intervenção manual de um atendente ou barbeiro.

**Para o Administrador (Barbeiro/Gestor):**
**Acessar painel de controle:** Visualizar de forma intuitiva a demanda diária e os horários reservados.
**Gerenciar a agenda:** Efetuar cancelamentos ou reagendamentos de horários para manter o fluxo organizado diante de imprevistos.
**Editar portfólio de serviços:** Atualizar os valores (preços) e os tipos de serviços oferecidos para que o cliente tenha sempre a informação correta na hora de agendar.

---

## 4. Fluxos
**Fluxo 1: Agendamento de Serviço (Cliente)**
1. Cliente acessa a plataforma da Central do Corte.
2. Realiza o login ou efetua o seu cadastro.
3. Visualiza os serviços oferecidos e os respectivos preços.
4. Consulta os horários disponíveis em tempo real.
5. Seleciona o serviço desejado e o horário de preferência.
6. Confirma a solicitação de agendamento.
7. O sistema bloqueia o horário e o cliente recebe a confirmação.

**Fluxo 2: Gestão Diária e Atualização de Agenda (Administrador)**
1. Barbeiro acessa o painel administrativo da plataforma.
2. Visualiza o consolidado da demanda diária com os horários preenchidos.
3. O barbeiro identifica a necessidade de alterar a agenda (por solicitação de um cliente ou imprevisto).
4. O barbeiro acessa o horário específico e realiza o reagendamento ou cancelamento.
5. O sistema libera imediatamente o horário para o público (em caso de cancelamento) e atualiza a visualização em tempo real para os clientes. 
6. O barbeiro atualiza os preços e serviços no sistema, que passam a refletir instantaneamente para os próximos acessos dos clientes.