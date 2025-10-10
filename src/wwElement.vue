<template>
  <div class="appointment-calendar" :style="containerStyles">
    <div class="calendar-header">
      <div class="header-content" :style="headerContentStyles">
        <button
          class="nav-button prev-button"
          @click="previousMonth"
          :disabled="isEditing || isPreviousMonthDisabled"
          :style="headerButtonStyles"
        >
          <span v-html="prevIconHTML"></span>
        </button>

        <select
          class="month-selector"
          v-model="selectedMonth"
          @change="onMonthChange"
          :disabled="isEditing"
          :style="headerSelectStyles"
        >
          <option
            v-for="(month, index) in monthNames"
            :key="index"
            :value="index"
            :disabled="isMonthDisabled(index)"
          >
            {{ month }}
          </option>
        </select>

        <button
          class="nav-button next-button"
          @click="nextMonth"
          :disabled="isEditing"
          :style="headerButtonStyles"
        >
          <span v-html="nextIconHTML"></span>
        </button>

        <select
          class="year-selector"
          v-model="selectedYear"
          @change="onYearChange"
          :disabled="isEditing"
          :style="headerSelectStyles"
        >
          <option v-for="year in yearRange" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="calendar-weekdays">
      <div
        v-for="day in weekdayLabels"
        :key="day"
        class="weekday-label"
        :style="{ color: weekdayTextColor, fontSize: weekdayFontSize }"
      >
        {{ day }}
      </div>
    </div>
    
    <div class="calendar-grid">
      <CalendarDay
        v-for="(day, index) in calendarDays"
        :key="index"
        :date="day"
        :is-current-month="isInCurrentMonth(day)"
        :block-status="getBlockStatus(day)"
        :timezone="timezone"
        :available-color="availableColor"
        :weekday-block-color="weekdayBlockColor"
        :specific-block-color="specificBlockColor"
        :full-day-block-color="fullDayBlockColor"
        :current-day-border-color="currentDayBorderColor"
        :text-color="dayTextColor"
        :block-icon="blockIcon"
        :available-icon="availableIcon"
        :weekday-block-icon="weekdayBlockIcon"
        :partial-block-icon="partialBlockIcon"
        :show-time-label="showTimeLabel"
        :time-label-start-time="timeLabelStartTime"
        :time-label-end-time="timeLabelEndTime"
        :show-reason-label="showReasonLabel"
        :day-number-font-size="dayNumberFontSize"
        :time-label-font-size="timeLabelFontSize"
        :reason-label-font-size="reasonLabelFontSize"
        :is-editing="isEditing"
        @click="handleDayClick"
      />
    </div>

    <div v-if="showLegend" class="calendar-legend">
      <div class="legend-item" :style="{ fontSize: legendFontSize }">
        <span class="legend-color" :style="{ backgroundColor: availableColor }">
          <span v-if="availableIconHTML" class="legend-icon" v-html="availableIconHTML"></span>
        </span>
        <span class="legend-label">{{ legendLabels.available }}</span>
      </div>
      <div class="legend-item" :style="{ fontSize: legendFontSize }">
        <span class="legend-color" :style="{ backgroundColor: weekdayBlockColor }">
          <span v-if="weekdayBlockIconHTML" class="legend-icon" v-html="weekdayBlockIconHTML"></span>
        </span>
        <span class="legend-label">{{ legendLabels.weekdayBlock }}</span>
      </div>
      <div class="legend-item" :style="{ fontSize: legendFontSize }">
        <span class="legend-color" :style="{ backgroundColor: specificBlockColor }">
          <span v-if="partialBlockIconHTML" class="legend-icon" v-html="partialBlockIconHTML"></span>
        </span>
        <span class="legend-label">{{ legendLabels.partialBlock }}</span>
      </div>
      <div class="legend-item" :style="{ fontSize: legendFontSize }">
        <span class="legend-color full-block" :style="{ backgroundColor: fullDayBlockColor }">
          <span v-if="blockIconHTML" class="legend-icon" v-html="blockIconHTML"></span>
        </span>
        <span class="legend-label">{{ legendLabels.fullBlock }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import CalendarDay from './components/CalendarDay.vue';
import { 
  getCalendarDays, 
  isDateBlocked, 
  formatMonthYear, 
  formatDateISO,
  navigateMonth,
  isCurrentMonth as checkIsCurrentMonth
} from './utils/dateHelpers.js';

export default {
  name: 'AppointmentCalendar',
  components: {
    CalendarDay
  },
  props: {
    content: {
      type: Object,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    /* wwEditor:start */
    wwEditorState: {
      type: Object,
      required: true
    }
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    const currentDate = ref(new Date());
    const selectedMonth = ref(new Date().getMonth());
    const selectedYear = ref(new Date().getFullYear());

    const monthNames = computed(() =>
      props.content?.monthNames || [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ]
    );

    const yearRange = computed(() => {
      const currentYear = new Date().getFullYear();
      const startYear = props.content?.startYear || currentYear;
      const endYear = props.content?.endYear || currentYear + 10;
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      return years;
    });

    const isPreviousMonthDisabled = computed(() => {
      const today = new Date();
      const current = currentDate.value;
      return current.getFullYear() <= today.getFullYear() &&
             current.getMonth() <= today.getMonth();
    });

    const isMonthDisabled = (monthIndex) => {
      const today = new Date();
      const currentYear = selectedYear.value;

      // Se for ano passado, desabilitar todos os meses
      if (currentYear < today.getFullYear()) {
        return true;
      }

      // Se for o ano atual, desabilitar meses anteriores ao atual
      if (currentYear === today.getFullYear() && monthIndex < today.getMonth()) {
        return true;
      }

      return false;
    };
    
    const { value: selectedDate, setValue: setSelectedDate } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'selectedDate',
      type: 'string',
      defaultValue: null
    });

    const { value: currentMonth, setValue: setCurrentMonth } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'currentMonth',
      type: 'string',
      defaultValue: computed(() => formatMonthYear(currentDate.value))
    });

    const { value: blockId, setValue: setBlockId } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockId',
      type: 'string',
      defaultValue: null
    });

    const { value: blockDataInicio, setValue: setBlockDataInicio } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockDataInicio',
      type: 'string',
      defaultValue: null
    });

    const { value: blockDataFim, setValue: setBlockDataFim } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockDataFim',
      type: 'string',
      defaultValue: null
    });

    const { value: blockDiaInteiro, setValue: setBlockDiaInteiro } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockDiaInteiro',
      type: 'boolean',
      defaultValue: null
    });

    const { value: blockMotivo, setValue: setBlockMotivo } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockMotivo',
      type: 'string',
      defaultValue: null
    });

    const { value: blockCreatedAt, setValue: setBlockCreatedAt } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockCreatedAt',
      type: 'string',
      defaultValue: null
    });

    const { value: blockHorarioInicioUtc, setValue: setBlockHorarioInicioUtc } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockHorarioInicioUtc',
      type: 'array',
      defaultValue: []
    });

    const { value: blockHorarioFimUtc, setValue: setBlockHorarioFimUtc } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockHorarioFimUtc',
      type: 'array',
      defaultValue: []
    });

    const { value: isBlocked, setValue: setIsBlocked } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'isBlocked',
      type: 'boolean',
      defaultValue: false
    });

    const { value: blockType, setValue: setBlockType } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'blockType',
      type: 'string',
      defaultValue: 'available'
    });
    
    const calendarDays = computed(() => getCalendarDays(currentDate.value));
    
    const currentMonthYear = computed(() => formatMonthYear(currentDate.value));
    
    const weekdayLabels = computed(() => 
      props.content?.weekdayLabels || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    );
    
    const blockedWeekdays = computed(() => props.content?.blockedWeekdays || []);
    
    const specificBlocks = computed(() => props.content?.specificBlocks || []);
    
    const getBlockStatus = (date) => {
      return isDateBlocked(date, blockedWeekdays.value, specificBlocks.value);
    };
    
    const isInCurrentMonth = (date) => {
      return checkIsCurrentMonth(date, currentDate.value);
    };
    
    const handleDayClick = (date) => {
      if (isEditing.value) return;

      const blockStatus = getBlockStatus(date);
      const dateISO = formatDateISO(date);

      setSelectedDate(dateISO);
      setIsBlocked(blockStatus.blocked);
      setBlockType(blockStatus.type);

      // Preparar arrays de informações detalhadas dos bloqueios
      let blockDetailsArray = [];
      let horariosInicioUtc = [];
      let horariosFimUtc = [];

      if (blockStatus.blocked && blockStatus.blocks && blockStatus.blocks.length > 0) {
        // Processar TODOS os bloqueios daquela data
        blockDetailsArray = blockStatus.blocks.map(block => {
          const diaInteiro = block.dia_inteiro !== undefined
            ? block.dia_inteiro
            : block.dia_completo;

          // Adicionar horários UTC aos arrays se existirem
          if (block.horario_inicio) {
            horariosInicioUtc.push(block.horario_inicio);
          }
          if (block.horario_fim) {
            horariosFimUtc.push(block.horario_fim);
          }

          return {
            id: block.id || null,
            data_inicio: block.data_inicio || null,
            data_fim: block.data_fim || null,
            dia_inteiro: diaInteiro,
            created_at: block.created_at || null,
            motivo: block.motivo || null,
            horario_inicio: block.horario_inicio || null,
            horario_fim: block.horario_fim || null
          };
        });

        // Salvar dados do primeiro bloqueio nas variáveis individuais (retrocompatibilidade)
        const firstBlock = blockStatus.blocks[0];
        const diaInteiro = firstBlock.dia_inteiro !== undefined
          ? firstBlock.dia_inteiro
          : firstBlock.dia_completo;

        setBlockId(firstBlock.id || null);
        setBlockDataInicio(firstBlock.data_inicio || null);
        setBlockDataFim(firstBlock.data_fim || null);
        setBlockDiaInteiro(diaInteiro);
        setBlockCreatedAt(firstBlock.created_at || null);
        setBlockMotivo(firstBlock.motivo || null);
      } else {
        // Limpar variáveis se não houver bloqueio
        setBlockId(null);
        setBlockDataInicio(null);
        setBlockDataFim(null);
        setBlockDiaInteiro(null);
        setBlockCreatedAt(null);
        setBlockMotivo(null);
      }

      // Atualizar arrays de horários UTC
      setBlockHorarioInicioUtc(horariosInicioUtc);
      setBlockHorarioFimUtc(horariosFimUtc);

      emit('trigger-event', {
        name: 'dateClick',
        event: {
          date: dateISO,
          timestamp: date.getTime(),
          isBlocked: blockStatus.blocked,
          blockType: blockStatus.type,
          blockInfo: blockDetailsArray.length > 0 ? blockDetailsArray : null
        }
      });
    };
    
    const updateCalendar = (direction = null) => {
      setCurrentMonth(formatMonthYear(currentDate.value));
      selectedMonth.value = currentDate.value.getMonth();
      selectedYear.value = currentDate.value.getFullYear();

      if (direction) {
        emit('trigger-event', {
          name: 'monthChange',
          event: {
            month: formatMonthYear(currentDate.value),
            direction
          }
        });
      }
    };

    const onMonthChange = () => {
      if (isEditing.value) return;
      const newDate = new Date(currentDate.value);
      newDate.setMonth(selectedMonth.value);

      const today = new Date();
      // Não permitir selecionar meses anteriores ao atual
      if (newDate.getFullYear() < today.getFullYear() ||
          (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() < today.getMonth())) {
        selectedMonth.value = currentDate.value.getMonth();
        return;
      }

      currentDate.value = newDate;
      updateCalendar('selector');
    };

    const onYearChange = () => {
      if (isEditing.value) return;
      const newDate = new Date(currentDate.value);
      newDate.setFullYear(selectedYear.value);

      const today = new Date();
      // Não permitir selecionar anos anteriores ao atual
      if (newDate.getFullYear() < today.getFullYear() ||
          (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() < today.getMonth())) {
        selectedYear.value = currentDate.value.getFullYear();
        selectedMonth.value = currentDate.value.getMonth();
        return;
      }

      currentDate.value = newDate;
      updateCalendar('selector');
    };

    const previousMonth = () => {
      if (isEditing.value) return;
      const newDate = navigateMonth(currentDate.value, 'prev');
      const today = new Date();

      // Não permitir navegar para meses anteriores ao atual
      if (newDate.getFullYear() < today.getFullYear() ||
          (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() < today.getMonth())) {
        return;
      }

      currentDate.value = newDate;
      updateCalendar('previous');
    };

    const nextMonth = () => {
      if (isEditing.value) return;
      currentDate.value = navigateMonth(currentDate.value, 'next');
      updateCalendar('next');
    };
    
    const goToToday = () => {
      if (isEditing.value) return;
      currentDate.value = new Date();
      updateCalendar('today');
    };
    
    const goToDate = (dateString) => {
      if (isEditing.value) return;
      
      try {
        const newDate = new Date(dateString);
        if (isNaN(newDate.getTime())) {
          console.warn('Invalid date provided to goToDate:', dateString);
          return false;
        }
        currentDate.value = newDate;
        setCurrentMonth(formatMonthYear(currentDate.value));
        return true;
      } catch (e) {
        console.warn('Error in goToDate:', e);
        return false;
      }
    };
    
    const containerStyles = computed(() => ({
      backgroundColor: props.content?.backgroundColor || '#ffffff',
      padding: props.content?.padding || '20px',
      borderRadius: props.content?.borderRadius || '8px',
      boxShadow: props.content?.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)'
    }));

    const buttonStyles = computed(() => ({
      color: props.content?.buttonColor || '#007bff',
      backgroundColor: props.content?.buttonBackgroundColor || 'transparent'
    }));

    const headerContentStyles = computed(() => ({
      gap: headerGap.value
    }));

    const headerSelectStyles = computed(() => ({
      color: headerTextColor.value,
      fontSize: headerFontSize.value,
      borderRadius: headerBorderRadius.value,
      borderColor: headerBorderColor.value
    }));

    const headerButtonStyles = computed(() => ({
      borderRadius: headerBorderRadius.value,
      borderColor: headerBorderColor.value
    }));
    
    const headerTextColor = computed(() => props.content?.headerTextColor || '#212529');
    const weekdayTextColor = computed(() => props.content?.weekdayTextColor || '#6c757d');
    const dayTextColor = computed(() => props.content?.dayTextColor || '#212529');
    const availableColor = computed(() => props.content?.availableColor || '#d4edda');
    const weekdayBlockColor = computed(() => props.content?.weekdayBlockColor || '#e9ecef');
    const specificBlockColor = computed(() => props.content?.specificBlockColor || '#f8d7da');
    const fullDayBlockColor = computed(() => props.content?.fullDayBlockColor || '#dc3545');
    const currentDayBorderColor = computed(() => props.content?.currentDayBorderColor || '#007bff');

    const timezone = computed(() => props.content?.timezone || 'America/Sao_Paulo');
    const blockIcon = computed(() => props.content?.blockIcon || 'lock');
    const availableIcon = computed(() => props.content?.availableIcon || '');
    const weekdayBlockIcon = computed(() => props.content?.weekdayBlockIcon || '');
    const partialBlockIcon = computed(() => props.content?.partialBlockIcon || '');
    const showLegend = computed(() => props.content?.showLegend !== false);
    const showTimeLabel = computed(() => props.content?.showTimeLabel || false);
    const timeLabelStartTime = computed(() => props.content?.timeLabelStartTime || '');
    const timeLabelEndTime = computed(() => props.content?.timeLabelEndTime || '');
    const showReasonLabel = computed(() => props.content?.showReasonLabel || false);

    const headerGap = computed(() => props.content?.headerGap || '8px');
    const headerFontSize = computed(() => props.content?.headerFontSize || '15px');
    const headerBorderRadius = computed(() => props.content?.headerBorderRadius || '6px');
    const headerBorderColor = computed(() => props.content?.headerBorderColor || '#e0e0e0');
    const weekdayFontSize = computed(() => props.content?.weekdayFontSize || '12px');
    const dayNumberFontSize = computed(() => props.content?.dayNumberFontSize || '14px');
    const timeLabelFontSize = computed(() => props.content?.timeLabelFontSize || '10px');
    const reasonLabelFontSize = computed(() => props.content?.reasonLabelFontSize || '10px');
    const legendFontSize = computed(() => props.content?.legendFontSize || '12px');

    const legendLabels = computed(() => props.content?.legendLabels || {
      available: 'Disponível',
      weekdayBlock: 'Bloqueio semanal',
      partialBlock: 'Bloqueio parcial',
      fullBlock: 'Bloqueado'
    });

    const blockIconHTML = ref('');
    const availableIconHTML = ref('');
    const weekdayBlockIconHTML = ref('');
    const partialBlockIconHTML = ref('');

    watch(blockIcon, async () => {
      if (blockIcon.value) blockIconHTML.value = await getIcon(blockIcon.value);
    }, { immediate: true });

    watch(availableIcon, async () => {
      if (availableIcon.value) availableIconHTML.value = await getIcon(availableIcon.value);
    }, { immediate: true });

    watch(weekdayBlockIcon, async () => {
      if (weekdayBlockIcon.value) weekdayBlockIconHTML.value = await getIcon(weekdayBlockIcon.value);
    }, { immediate: true });

    watch(partialBlockIcon, async () => {
      if (partialBlockIcon.value) partialBlockIconHTML.value = await getIcon(partialBlockIcon.value);
    }, { immediate: true });
    
    const prevIcon = computed(() => props.content?.prevIcon || 'chevron-left');
    const nextIcon = computed(() => props.content?.nextIcon || 'chevron-right');
    
    const { getIcon } = wwLib.useIcons();
    const prevIconHTML = ref('');
    const nextIconHTML = ref('');
    
    watch(prevIcon, async () => {
      prevIconHTML.value = await getIcon(prevIcon.value);
    }, { immediate: true });
    
    watch(nextIcon, async () => {
      nextIconHTML.value = await getIcon(nextIcon.value);
    }, { immediate: true });
    
    return {
      isEditing,
      calendarDays,
      currentMonthYear,
      weekdayLabels,
      monthNames,
      yearRange,
      selectedMonth,
      selectedYear,
      isPreviousMonthDisabled,
      isMonthDisabled,
      getBlockStatus,
      isInCurrentMonth,
      handleDayClick,
      onMonthChange,
      onYearChange,
      previousMonth,
      nextMonth,
      goToToday,
      goToDate,
      containerStyles,
      buttonStyles,
      headerContentStyles,
      headerSelectStyles,
      headerButtonStyles,
      headerTextColor,
      weekdayTextColor,
      dayTextColor,
      availableColor,
      weekdayBlockColor,
      specificBlockColor,
      fullDayBlockColor,
      currentDayBorderColor,
      timezone,
      blockIcon,
      availableIcon,
      weekdayBlockIcon,
      partialBlockIcon,
      showLegend,
      showTimeLabel,
      timeLabelStartTime,
      timeLabelEndTime,
      showReasonLabel,
      legendLabels,
      blockIconHTML,
      availableIconHTML,
      weekdayBlockIconHTML,
      partialBlockIconHTML,
      prevIconHTML,
      nextIconHTML
    };
  }
};
</script>

<style scoped lang="scss">
.appointment-calendar {
  width: 100%;
  max-width: 100%;
  font-family: inherit;
}

.calendar-header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  padding-top: 8px;

  .header-content {
    display: flex;
    align-items: center;
    gap: v-bind(headerGap);

    select {
      background: #ffffff;
      border: 1px solid v-bind(headerBorderColor);
      border-radius: v-bind(headerBorderRadius);
      padding: 8px 12px;
      font-size: v-bind(headerFontSize);
      font-weight: 500;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s ease;

      &:focus {
        border-color: v-bind(currentDayBorderColor);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f5f5f5;
      }
    }

    .month-selector {
      min-width: 120px;
    }

    .year-selector {
      min-width: 80px;
    }
  }

  .nav-button {
    background: transparent;
    border: 1px solid v-bind(headerBorderColor);
    cursor: pointer;
    padding: 6px;
    border-radius: v-bind(headerBorderRadius);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: v-bind(currentDayBorderColor);
      outline: none;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    :deep(svg) {
      width: 18px;
      height: 18px;
    }
  }
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  
  .weekday-label {
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    padding: 8px 0;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-legend {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      border: 1px solid #dee2e6;
      display: flex;
      align-items: center;
      justify-content: center;

      .legend-icon {
        display: flex;
        align-items: center;
        justify-content: center;

        :deep(svg) {
          width: 12px;
          height: 12px;
        }
      }

      &.full-block {
        .legend-icon {
          filter: brightness(0) invert(1);
        }
      }
    }

    .legend-label {
      color: #6c757d;
      font-weight: 500;
    }
  }
}
</style>