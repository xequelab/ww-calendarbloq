import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  getDay,
  parseISO,
  isValid
} from 'date-fns';

export function getCalendarDays(currentDate) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function isDateBlocked(date, blockedWeekdays, specificBlocks) {
  // Check if day of week is blocked
  const dayOfWeek = getDay(date);
  if (blockedWeekdays && blockedWeekdays.includes(dayOfWeek)) {
    return { blocked: true, type: 'weekday' };
  }
  
  // Check if date falls within specific block
  if (specificBlocks && Array.isArray(specificBlocks)) {
    for (const block of specificBlocks) {
      if (!block) continue;
      
      let startDate, endDate;
      
      // Parse start date
      if (block.data_inicio) {
        startDate = typeof block.data_inicio === 'string' 
          ? parseISO(block.data_inicio) 
          : new Date(block.data_inicio);
      }
      
      // Parse end date
      if (block.data_fim) {
        endDate = typeof block.data_fim === 'string'
          ? parseISO(block.data_fim)
          : new Date(block.data_fim);
      }
      
      // If only start date exists, check if same day
      if (startDate && isValid(startDate) && !endDate) {
        if (isSameDay(date, startDate)) {
          return { blocked: true, type: 'specific', block };
        }
      }
      
      // If both dates exist, check if within interval
      if (startDate && isValid(startDate) && endDate && isValid(endDate)) {
        try {
          // Verificar se start e end são no mesmo dia (bloqueio parcial de horário)
          if (isSameDay(startDate, endDate)) {
            // Se for mesmo dia, verificar se o dia do calendário é esse dia
            if (isSameDay(date, startDate)) {
              return { blocked: true, type: 'specific', block };
            }
          } else {
            // Se for intervalo de dias diferentes, verificar se está dentro do intervalo
            if (isWithinInterval(date, { start: startDate, end: endDate })) {
              return { blocked: true, type: 'specific', block };
            }
          }
        } catch (e) {
          console.warn('Invalid date interval:', e);
        }
      }
    }
  }
  
  return { blocked: false, type: 'available' };
}

export function formatMonthYear(date) {
  return format(date, 'MMMM yyyy');
}

export function formatDateISO(date) {
  return format(date, 'yyyy-MM-dd');
}

export function navigateMonth(currentDate, direction) {
  return direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
}

export function isCurrentMonth(date, currentDate) {
  return format(date, 'MM-yyyy') === format(currentDate, 'MM-yyyy');
}