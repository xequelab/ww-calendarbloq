<template>
  <div class="appointment-calendar" :style="containerStyles">
    <div class="calendar-header">
      <button
        class="nav-button"
        @click="previousMonth"
        :disabled="isEditing"
        :style="buttonStyles"
      >
        <span v-html="prevIconHTML"></span>
      </button>

      <div class="month-year-selectors">
        <select
          class="month-selector"
          v-model="selectedMonth"
          @change="onMonthChange"
          :disabled="isEditing"
          :style="{ color: headerTextColor }"
        >
          <option v-for="(month, index) in monthNames" :key="index" :value="index">
            {{ month }}
          </option>
        </select>

        <select
          class="year-selector"
          v-model="selectedYear"
          @change="onYearChange"
          :disabled="isEditing"
          :style="{ color: headerTextColor }"
        >
          <option v-for="year in yearRange" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <button
        class="nav-button"
        @click="nextMonth"
        :disabled="isEditing"
        :style="buttonStyles"
      >
        <span v-html="nextIconHTML"></span>
      </button>
    </div>
    
    <div class="calendar-weekdays">
      <div 
        v-for="day in weekdayLabels" 
        :key="day" 
        class="weekday-label"
        :style="{ color: weekdayTextColor }"
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
        :available-color="availableColor"
        :weekday-block-color="weekdayBlockColor"
        :specific-block-color="specificBlockColor"
        :current-day-border-color="currentDayBorderColor"
        :text-color="dayTextColor"
        :is-editing="isEditing"
        @click="handleDayClick"
      />
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
      const startYear = props.content?.startYear || currentYear - 10;
      const endYear = props.content?.endYear || currentYear + 10;
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      return years;
    });
    
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
      
      emit('trigger-event', {
        name: 'dateClick',
        event: {
          date: dateISO,
          timestamp: date.getTime(),
          isBlocked: blockStatus.blocked,
          blockType: blockStatus.type,
          blockInfo: blockStatus.block || null
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
      currentDate.value = newDate;
      updateCalendar('selector');
    };

    const onYearChange = () => {
      if (isEditing.value) return;
      const newDate = new Date(currentDate.value);
      newDate.setFullYear(selectedYear.value);
      currentDate.value = newDate;
      updateCalendar('selector');
    };

    const previousMonth = () => {
      if (isEditing.value) return;
      currentDate.value = navigateMonth(currentDate.value, 'prev');
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
    
    const headerTextColor = computed(() => props.content?.headerTextColor || '#212529');
    const weekdayTextColor = computed(() => props.content?.weekdayTextColor || '#6c757d');
    const dayTextColor = computed(() => props.content?.dayTextColor || '#212529');
    const availableColor = computed(() => props.content?.availableColor || '#d4edda');
    const weekdayBlockColor = computed(() => props.content?.weekdayBlockColor || '#e9ecef');
    const specificBlockColor = computed(() => props.content?.specificBlockColor || '#f8d7da');
    const currentDayBorderColor = computed(() => props.content?.currentDayBorderColor || '#007bff');
    
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
      headerTextColor,
      weekdayTextColor,
      dayTextColor,
      availableColor,
      weekdayBlockColor,
      specificBlockColor,
      currentDayBorderColor,
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .month-year-selectors {
    display: flex;
    gap: 8px;
    align-items: center;

    select {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;

      &:hover:not(:disabled) {
        border-color: #9ca3af;
      }

      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f3f4f6;
      }
    }

    .month-selector {
      min-width: 130px;
    }

    .year-selector {
      min-width: 90px;
    }
  }

  .nav-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    :deep(svg) {
      width: 20px;
      height: 20px;
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
    font-size: 12px;
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
</style>