---
name: Calendário de Agendamentos
description: Componente de calendário mensal para agendamentos com indicadores visuais de disponibilidade, suporte para bloqueios semanais recorrentes e bloqueios de datas específicas, e eventos de clique para integração de workflows.
keywords: calendário, agendamento, disponibilidade, reservas, seletor de datas, visualização mensal, datas bloqueadas, integração supabase, português
---

#### Calendário de Agendamentos

***Propósito:***
Componente especializado de calendário desenvolvido para sistemas de agendamento e reservas. Exibe uma visualização mensal com estados de disponibilidade codificados por cores, suporta bloqueios semanais recorrentes (ex: fins de semana) e bloqueios específicos de datas do banco de dados, emitindo eventos detalhados de clique para integração de workflows no WeWeb. **Configurado para o mercado brasileiro com navegação bloqueada para datas passadas.**

***Funcionalidades:***
- Visualização de calendário mensal limpa e com navegação intuitiva
- Seletores dropdown modernos para mês e ano com navegação rápida
- Botões de seta para navegação entre meses (anterior/próximo)
- **Bloqueio automático de datas passadas** - Impede seleção de meses/anos anteriores ao atual
- Sistema de bloqueio em quatro níveis: dias disponíveis, bloqueios semanais recorrentes, bloqueios parciais e bloqueios de dia completo
- **Conversão automática de timezone** - Horários UTC são convertidos automaticamente para o fuso horário configurado e exibidos nos dias bloqueados parcialmente
- **Suporte para múltiplos bloqueios por dia** - Detecta e processa todos os bloqueios de uma mesma data
- Distinção visual através de codificação por cores (verde para disponível, cinza para bloqueios semanais, vermelho claro para bloqueios parciais, vermelho escuro para bloqueios completos)
- Datas bloqueadas completamente exibem ícone de cadeado e fundo vermelho distinto
- Legenda interativa mostrando todos os estados de disponibilidade com indicadores de cores
- Destaque do dia atual com borda customizável
- Efeitos hover em datas clicáveis
- Layout em grade responsivo que se adapta ao tamanho do container
- Desenvolvido com date-fns e date-fns-tz para manipulação confiável de datas e timezones
- Cores, ícones e labels totalmente customizáveis
- Interface 100% em português do Brasil por padrão

***Propriedades:***
- blockedWeekdays: number[] - Array de números de dias da semana (0-6, onde 0=Domingo) para bloquear em todas as semanas. Exemplo: [0, 6] bloqueia todos os domingos e sábados
- specificBlocks: object[] - Array de bloqueios específicos do banco de dados com estrutura: { id: 'uuid', data_inicio: '2024-01-01', data_fim: '2024-01-05', dia_inteiro: true (ou dia_completo: true), motivo: 'texto', horario_inicio: 'HH:mm', horario_fim: 'HH:mm', profissional_id: 'uuid', created_at: 'timestamp' }
- timezone: string - Fuso horário IANA para conversão automática de horários UTC (padrão: 'America/Sao_Paulo'). Exemplos: 'America/New_York', 'Europe/London', 'Asia/Tokyo'
- weekdayLabels: string[] - Array de 7 rótulos para dias da semana começando com domingo. Padrão: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
- monthNames: string[] - Array de 12 nomes de meses para o seletor dropdown. Padrão: ['Janeiro', 'Fevereiro', 'Março', ...] (nomes em português)
- startYear: number|null - Primeiro ano disponível no seletor de ano. Padrão: ano atual (não permite anos passados)
- endYear: number|null - Último ano disponível no seletor de ano. Padrão: ano atual + 10
- availableColor: string - Cor de fundo para dias disponíveis/reserváveis (padrão: '#d4edda' - verde claro)
- weekdayBlockColor: string - Cor de fundo para bloqueios semanais recorrentes (padrão: '#e9ecef' - cinza claro)
- specificBlockColor: string - Cor de fundo para bloqueios parciais de datas (padrão: '#f8d7da' - vermelho claro)
- fullDayBlockColor: string - Cor de fundo para dias completamente bloqueados com ícone de cadeado (padrão: '#dc3545' - vermelho)
- blockIcon: string - Nome do ícone do sistema para datas totalmente bloqueadas (padrão: 'lock')
- showLegend: boolean - Exibir legenda explicando códigos de cores e tipos de bloqueio (padrão: true)
- legendLabels: object - Rótulos de texto customizáveis da legenda: { available: 'Disponível', weekdayBlock: 'Bloqueio semanal', partialBlock: 'Bloqueio parcial', fullBlock: 'Bloqueado' }
- currentDayBorderColor: string - Cor da borda para a data de hoje (padrão: '#007bff' - azul)
- backgroundColor: string - Cor de fundo do container do calendário
- headerTextColor: string - Cor do texto do cabeçalho mês/ano e seletores
- weekdayTextColor: string - Cor da linha de rótulos dos dias da semana
- dayTextColor: string - Cor dos números dos dias na grade do calendário
- buttonColor: string - Cor dos botões de seta de navegação
- buttonBackgroundColor: string|null - Cor de fundo dos botões de navegação (padrão: transparent)
- padding: string - Padding interno ao redor do conteúdo do calendário (padrão: '20px')
- borderRadius: string - Raio da borda para cantos arredondados (padrão: '8px')
- boxShadow: string - Efeito de sombra ao redor do calendário (padrão: '0 2px 8px rgba(0, 0, 0, 0.1)')
- prevIcon: string - Nome do ícone do sistema para botão de mês anterior (padrão: 'chevron-left')
- nextIcon: string - Nome do ícone do sistema para botão de próximo mês (padrão: 'chevron-right')

***Eventos:***
- dateClick: Disparado quando o usuário clica em qualquer data. Payload: { date: '2024-01-15' (string ISO), timestamp: 1705276800000, isBlocked: false, blockType: 'available'|'weekday'|'specific', blockInfo: [{ id, data_inicio, data_fim, dia_inteiro, created_at, motivo, horario_inicio, horario_fim }, ...] (array de bloqueios) ou null, blockIds: ['uuid1', 'uuid2', ...] (array com IDs de todos os bloqueios da data) }
- monthChange: Disparado quando o usuário navega para um mês diferente. Payload: { month: 'Janeiro 2024', direction: 'previous'|'next'|'today'|'selector' }

***Ações Expostas:***
- `goToToday`: Navegar calendário para o mês atual. Sem argumentos
- `goToDate`: Navegar calendário para uma data específica. Args: date (string) - String de data em formato ISO como '2024-06-15'

***Variáveis Expostas:***
- selectedDate: Última data clicada em formato ISO (caminho: variables['uid-selectedDate'])
- currentMonth: Mês e ano atualmente exibidos (caminho: variables['uid-currentMonth'])
- isBlocked: Boolean indicando se a data clicada está bloqueada (caminho: variables['uid-isBlocked'])
- blockType: Tipo de bloqueio: 'available', 'weekday' ou 'specific' (caminho: variables['uid-blockType'])
- blockIds: Array com IDs de todos os bloqueios da data clicada (caminho: variables['uid-blockIds'])
- blockId: ID do primeiro bloqueio no banco de dados (caminho: variables['uid-blockId']) - retrocompatibilidade
- blockDataInicio: Data de início do primeiro bloqueio (caminho: variables['uid-blockDataInicio']) - retrocompatibilidade
- blockDataFim: Data de fim do primeiro bloqueio (caminho: variables['uid-blockDataFim']) - retrocompatibilidade
- blockDiaInteiro: Boolean indicando se o primeiro bloqueio é de dia inteiro (caminho: variables['uid-blockDiaInteiro']) - retrocompatibilidade
- blockMotivo: Motivo do primeiro bloqueio (caminho: variables['uid-blockMotivo']) - retrocompatibilidade
- blockCreatedAt: Timestamp de criação do primeiro bloqueio (caminho: variables['uid-blockCreatedAt']) - retrocompatibilidade
- blockHorarioInicioUtc: Array com horários de início UTC de todos os bloqueios da data (caminho: variables['uid-blockHorarioInicioUtc'])
- blockHorarioFimUtc: Array com horários de fim UTC de todos os bloqueios da data (caminho: variables['uid-blockHorarioFimUtc'])

***Notas Importantes:***
- O componente utiliza a biblioteca date-fns para cálculos e formatação confiável de datas
- **🚫 Navegação de datas passadas bloqueada**: Usuários NÃO podem navegar para meses/anos anteriores ao atual usando setas ou seletores
- O botão de "mês anterior" é automaticamente desabilitado quando o calendário está no mês atual
- Usuários podem navegar por meses e anos usando botões de seta ou seletores dropdown
- Seletores de mês e ano são sincronizados com a navegação por setas
- O intervalo de anos padrão é do ano atual até ano atual + 10 (customizável com startYear e endYear)
- Datas fora do mês atual são exibidas com opacidade reduzida e não são clicáveis
- **Hierarquia de bloqueios**: Bloqueios de dia completo (dia_inteiro = true ou dia_completo = true) são visualmente distintos com ícone de cadeado e fundo vermelho; bloqueios parciais aparecem em vermelho claro; bloqueios semanais em cinza
- A propriedade specificBlocks foi projetada para trabalhar diretamente com resultados de consultas Supabase da tabela "bloqueios_profissional"
- O campo `dia_inteiro` (ou `dia_completo` para retrocompatibilidade) determina se um bloqueio específico aparece como bloqueado completamente (com ícone) ou bloqueio parcial
- **Suporte para múltiplos bloqueios por dia**: O componente detecta e retorna TODOS os bloqueios de uma data específica através do evento dateClick (blockInfo é um array)
- **Todos os dados do bloqueio** (id, data_inicio, data_fim, dia_inteiro, created_at, motivo, horario_inicio, horario_fim) são passados no evento dateClick através de blockInfo como array, permitindo workflows complexos no WeWeb
- **IDs de bloqueios expostos**: A variável blockIds e o campo blockIds no evento dateClick contêm arrays com todos os IDs dos bloqueios da data clicada, facilitando operações de atualização/exclusão em massa no banco de dados
- **Horários UTC expostos**: As variáveis blockHorarioInicioUtc e blockHorarioFimUtc contêm arrays com os horários UTC de todos os bloqueios, prontos para conversão de timezone via JavaScript
- Todas as entradas de data devem estar em formato ISO (YYYY-MM-DD) para consistência
- Campos de horário (horario_inicio, horario_fim) em bloqueios específicos são incluídos no payload do evento de clique e nas variáveis expostas para conversão de timezone
- O calendário destaca automaticamente a data de hoje com uma borda distintiva
- Botões de navegação e seletores são desabilitados no modo de edição para prevenir interferência
- Todas as interações são desabilitadas quando isEditing é true para garantir comportamento adequado do editor
- O componente é totalmente responsivo e se adapta à largura do container
- A legenda pode ser ocultada definindo showLegend como false
- Todos os rótulos da legenda são customizáveis para suporte multi-idioma
- Customização de cores permite combinar com qualquer sistema de design ou diretrizes de marca
- O ícone de bloqueio pode ser alterado para qualquer ícone do sistema (lock, ban, x-circle, etc.)
- **Interface 100% em português brasileiro** com labels, meses e dias da semana traduzidos por padrão