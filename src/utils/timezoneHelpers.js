import { parseISO, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Converte um horário UTC para um timezone específico
 * @param {string} dateStr - Data em formato ISO (e.g., '2024-01-15')
 * @param {string} timeStr - Horário em formato HH:mm (e.g., '14:30')
 * @param {string} timezone - Timezone IANA (e.g., 'America/Sao_Paulo')
 * @returns {string} - Horário convertido no formato HH:mm
 */
export function convertUtcToTimezone(dateStr, timeStr, timezone) {
  if (!dateStr || !timeStr || !timezone) {
    return timeStr || '';
  }

  try {
    // Criar timestamp UTC combinando data e horário
    const utcDateTimeStr = `${dateStr}T${timeStr}:00.000Z`;
    const utcDate = parseISO(utcDateTimeStr);

    // Converter para o timezone especificado
    const zonedDate = toZonedTime(utcDate, timezone);

    // Retornar apenas o horário formatado
    return format(zonedDate, 'HH:mm');
  } catch (error) {
    console.warn('Error converting timezone:', error);
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
