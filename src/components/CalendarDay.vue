<template>
  <div
    class="calendar-day"
    :class="dayClasses"
    :style="dayStyles"
    @click="handleClick"
  >
    <span v-if="currentIconHTML" class="day-icon" v-html="currentIconHTML"></span>
    <span class="day-number" :style="{ fontSize: dayNumberFontSize }">{{ dayNumber }}</span>
    <span v-if="showTimeLabel && timeText && !isFullDayBlocked" class="time-label" :style="{ fontSize: timeLabelFontSize }">{{ timeText }}</span>
    <span v-if="showReasonLabel && reasonText" class="reason-label" :style="{ fontSize: reasonLabelFontSize }">{{ reasonText }}</span>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { format, isSameDay, isToday } from 'date-fns';
import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';

export default {
  name: 'CalendarDay',
  props: {
    date: {
      type: Date,
      required: true
    },
    isCurrentMonth: {
      type: Boolean,
      default: true
    },
    blockStatus: {
      type: Object,
      default: () => ({ blocked: false, type: 'available' })
    },
    availableColor: {
      type: String,
      default: '#d4edda'
    },
    weekdayBlockColor: {
      type: String,
      default: '#e9ecef'
    },
    specificBlockColor: {
      type: String,
      default: '#f8d7da'
    },
    fullDayBlockColor: {
      type: String,
      default: '#dc3545'
    },
    currentDayBorderColor: {
      type: String,
      default: '#007bff'
    },
    textColor: {
      type: String,
      default: '#212529'
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    blockIcon: {
      type: String,
      default: 'lock'
    },
    availableIcon: {
      type: String,
      default: ''
    },
    weekdayBlockIcon: {
      type: String,
      default: ''
    },
    partialBlockIcon: {
      type: String,
      default: ''
    },
    showTimeLabel: {
      type: Boolean,
      default: false
    },
    showReasonLabel: {
      type: Boolean,
      default: false
    },
    dayNumberFontSize: {
      type: String,
      default: '14px'
    },
    timeLabelFontSize: {
      type: String,
      default: '10px'
    },
    reasonLabelFontSize: {
      type: String,
      default: '10px'
    },
    timezone: {
      type: String,
      default: 'America/Sao_Paulo'
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const dayNumber = computed(() => format(props.date, 'd'));

    const isCurrentDay = computed(() => isToday(props.date));

    const blockInfo = computed(() => {
      if (props.blockStatus?.blocked && props.blockStatus?.type === 'specific') {
        return props.blockStatus.block;
      }
      return null;
    });

    const isFullDayBlocked = computed(() => {
      return props.blockStatus?.blocked &&
             props.blockStatus?.type === 'specific' &&
             (props.blockStatus?.block?.dia_completo === true || props.blockStatus?.block?.dia_inteiro === true);
    });

    const timeText = computed(() => {
      if (props.blockStatus?.blocked && props.blockStatus?.block) {
        const block = props.blockStatus.block;

        // Função para converter UTC para timezone configurado
        const convertUTCToTimezone = (dateTimeString) => {
          if (!dateTimeString) return null;

          try {
            // Se for apenas horário (HH:MM), assumir como horário local e retornar direto
            if (dateTimeString.match(/^\d{2}:\d{2}$/)) {
              return dateTimeString;
            }

            // Se for datetime completo ISO (com timezone), converter
            const utcDate = new Date(dateTimeString);
            if (isNaN(utcDate.getTime())) return null;

            // Debug: logar timezone e conversão
            console.log('Converting time:', {
              input: dateTimeString,
              utcDate: utcDate.toISOString(),
              timezone: props.timezone
            });

            // Converter para o timezone configurado usando date-fns-tz
            const zonedDate = utcToZonedTime(utcDate, props.timezone);
            const timeFormatted = format(zonedDate, 'HH:mm');

            console.log('Converted to:', timeFormatted);

            return timeFormatted;
          } catch (e) {
            console.warn('Error converting time to timezone:', e, dateTimeString);
            return null;
          }
        };

        const inicio = convertUTCToTimezone(block.horario_inicio || block.data_inicio);
        const fim = convertUTCToTimezone(block.horario_fim || block.data_fim);

        if (inicio && fim) {
          return `${inicio}-${fim}`;
        } else if (inicio) {
          return inicio;
        }
      }
      return null;
    });

    const reasonText = computed(() => {
      if (props.blockStatus?.blocked && props.blockStatus?.block) {
        return props.blockStatus.block.motivo || null;
      }
      return null;
    });

    const fullBlockIconHTML = ref('');
    const availableIconHTML = ref('');
    const weekdayBlockIconHTML = ref('');
    const partialBlockIconHTML = ref('');

    const loadIcons = async () => {
      if (typeof wwLib !== 'undefined' && wwLib.useIcons) {
        const { getIcon } = wwLib.useIcons();
        if (props.blockIcon) fullBlockIconHTML.value = await getIcon(props.blockIcon);
        if (props.availableIcon) availableIconHTML.value = await getIcon(props.availableIcon);
        if (props.weekdayBlockIcon) weekdayBlockIconHTML.value = await getIcon(props.weekdayBlockIcon);
        if (props.partialBlockIcon) partialBlockIconHTML.value = await getIcon(props.partialBlockIcon);
      }
    };

    watch(() => [props.blockIcon, props.availableIcon, props.weekdayBlockIcon, props.partialBlockIcon], loadIcons, { immediate: true });

    const currentIconHTML = computed(() => {
      if (isFullDayBlocked.value && fullBlockIconHTML.value) {
        return fullBlockIconHTML.value;
      } else if (props.blockStatus?.type === 'weekday' && weekdayBlockIconHTML.value) {
        return weekdayBlockIconHTML.value;
      } else if (props.blockStatus?.type === 'specific' && !isFullDayBlocked.value && partialBlockIconHTML.value) {
        return partialBlockIconHTML.value;
      } else if (!props.blockStatus?.blocked && availableIconHTML.value) {
        return availableIconHTML.value;
      }
      return null;
    });
    
    const dayClasses = computed(() => ({
      'is-current-month': props.isCurrentMonth,
      'is-other-month': !props.isCurrentMonth,
      'is-today': isCurrentDay.value,
      'is-blocked': props.blockStatus?.blocked,
      'is-available': !props.blockStatus?.blocked,
      'is-weekday-block': props.blockStatus?.type === 'weekday',
      'is-specific-block': props.blockStatus?.type === 'specific',
      'is-full-day-blocked': isFullDayBlocked.value
    }));
    
    const dayStyles = computed(() => {
      const styles = {
        color: props.textColor
      };

      if (isCurrentDay.value) {
        styles.border = `2px solid ${props.currentDayBorderColor}`;
      }

      if (isFullDayBlocked.value) {
        styles.backgroundColor = props.fullDayBlockColor;
        styles.color = '#ffffff';
      } else if (!props.blockStatus?.blocked) {
        styles.backgroundColor = props.availableColor;
      } else if (props.blockStatus?.type === 'weekday') {
        styles.backgroundColor = props.weekdayBlockColor;
      } else if (props.blockStatus?.type === 'specific') {
        styles.backgroundColor = props.specificBlockColor;
      }

      if (!props.isCurrentMonth) {
        styles.opacity = '0.4';
      }

      return styles;
    });
    
    const handleClick = () => {
      if (props.isEditing) return;
      emit('click', props.date);
    };

    return {
      dayNumber,
      isCurrentDay,
      blockInfo,
      isFullDayBlocked,
      timeText,
      reasonText,
      currentIconHTML,
      dayClasses,
      dayStyles,
      handleClick
    };
  }
};
</script>

<style scoped lang="scss">
.calendar-day {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
  min-height: 50px;

  &.is-other-month {
    pointer-events: none;
  }

  &.is-available:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &.is-blocked {
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  &.is-full-day-blocked {
    .day-icon {
      opacity: 1;
      filter: brightness(0) invert(1);
    }
  }

  .day-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }

  .day-number {
    font-weight: 500;
    z-index: 1;
  }

  &.is-today .day-number {
    font-weight: 700;
  }

  .time-label {
    z-index: 1;
    opacity: 0.9;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
  }

  .reason-label {
    z-index: 1;
    opacity: 0.9;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    font-style: italic;
  }
}
</style>