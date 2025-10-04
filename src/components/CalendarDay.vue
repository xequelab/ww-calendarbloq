<template>
  <div
    class="calendar-day"
    :class="dayClasses"
    :style="dayStyles"
    @click="handleClick"
  >
    <span class="day-number">{{ dayNumber }}</span>
    <span v-if="blockInfo" class="block-indicator"></span>
  </div>
</template>

<script>
import { computed } from 'vue';
import { format, isSameDay, isToday } from 'date-fns';

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
    
    const dayClasses = computed(() => ({
      'is-current-month': props.isCurrentMonth,
      'is-other-month': !props.isCurrentMonth,
      'is-today': isCurrentDay.value,
      'is-blocked': props.blockStatus?.blocked,
      'is-available': !props.blockStatus?.blocked,
      'is-weekday-block': props.blockStatus?.type === 'weekday',
      'is-specific-block': props.blockStatus?.type === 'specific'
    }));
    
    const dayStyles = computed(() => {
      const styles = {
        color: props.textColor
      };
      
      if (isCurrentDay.value) {
        styles.border = `2px solid ${props.currentDayBorderColor}`;
      }
      
      if (!props.blockStatus?.blocked) {
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
  align-items: center;
  justify-content: center;
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
    cursor: not-allowed;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .day-number {
    font-size: 14px;
    font-weight: 500;
    z-index: 1;
  }
  
  .block-indicator {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #dc3545;
  }
  
  &.is-today .day-number {
    font-weight: 700;
  }
}
</style>