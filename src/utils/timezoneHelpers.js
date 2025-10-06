/**
 * Converte um horário UTC para um timezone específico usando API nativa
 * @param {string} dateStr - Data em formato ISO (e.g., '2024-01-15')
 * @param {string} timeStr - Horário em formato HH:mm ou HH:mm:ss (e.g., '14:30' ou '14:30:25')
 * @param {string} timezone - Timezone IANA (e.g., 'America/Sao_Paulo')
 * @returns {string} - Horário convertido no formato HH:mm
 */
export function convertUtcToTimezone(dateStr, timeStr, timezone) {
  if (!dateStr || !timeStr || !timezone) {
    return timeStr || '';
  }

  try {
    // Normalizar o formato do horário (remover segundos se existir)
    let normalizedTime = timeStr;
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      const parts = timeStr.split(':');
      normalizedTime = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }

    // Criar timestamp UTC completo
    const utcDateTimeStr = `${dateStr}T${normalizedTime}:00Z`;

    // Usar API nativa Intl.DateTimeFormat para conversão
    const date = new Date(utcDateTimeStr);

    // Formatar para o timezone especificado
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return formatter.format(date);
  } catch (error) {
    // Em caso de erro, retornar o horário original normalizado
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      const parts = timeStr.split(':');
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return timeStr;
  }
}

/**
 * Formata um range de horários convertidos
 * @param {string} dateStr - Data em formato ISO
 * @param {string} startTimeUtc - Horário inicial UTC
 * @param {string} endTimeUtc - Horário final UTC
 * @param {string} timezone - Timezone IANA
 * @returns {string} - Range formatado (e.g., '11:30 - 13:00')
 */
export function formatTimeRange(dateStr, startTimeUtc, endTimeUtc, timezone) {
  if (!startTimeUtc && !endTimeUtc) {
    return '';
  }

  const start = startTimeUtc ? convertUtcToTimezone(dateStr, startTimeUtc, timezone) : '';
  const end = endTimeUtc ? convertUtcToTimezone(dateStr, endTimeUtc, timezone) : '';

  if (start && end) {
    return `${start} - ${end}`;
  } else if (start) {
    return start;
  } else if (end) {
    return end;
  }

  return '';
}
