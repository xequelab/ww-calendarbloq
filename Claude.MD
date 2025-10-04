---
name: Appointment Calendar
description: A monthly calendar component for appointment scheduling with visual availability indicators, support for recurring weekday blocks and specific date range blocks, and click events for workflow integration.
keywords: calendar, appointment, scheduling, availability, booking, date picker, monthly view, blocked dates, supabase integration
---

#### Appointment Calendar

***Purpose:***
A specialized calendar component designed for appointment and booking systems. It displays a monthly view with color-coded availability states, supports both recurring weekly blocks (e.g., weekends) and specific date range blocks from a database, and emits detailed click events for workflow integration in WeWeb.

***Features:***
- Clean monthly calendar view with intuitive navigation
- Month and year dropdown selectors for quick date navigation
- Arrow buttons for previous/next month navigation
- Three-tier blocking system: available days, recurring weekday blocks, and specific date blocks
- Visual distinction through color coding (green for available, gray for weekday blocks, red for specific blocks)
- Current day highlighting with customizable border
- Hover effects on clickable dates
- Responsive grid layout that adapts to container size
- Built with date-fns for reliable date manipulation
- Fully customizable colors and styling
- Bilingual labels (English/Portuguese)

***Properties:***
- blockedWeekdays: number[] - Array of weekday numbers (0-6, where 0=Sunday) to block across all weeks. Example: [0, 6] blocks all Sundays and Saturdays
- specificBlocks: object[] - Array of specific date blocks from database with structure: { data_inicio: '2024-01-01', data_fim: '2024-01-05', dia_completo: true, horario_inicio: '09:00', horario_fim: '17:00' }
- weekdayLabels: string[] - Array of 7 labels for weekdays starting with Sunday. Example: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
- monthNames: string[] - Array of 12 month names for the dropdown selector. Example: ['Janeiro', 'Fevereiro', 'Março', ...] (default: Portuguese names)
- startYear: number|null - First year available in year selector. Defaults to current year - 10 if not set
- endYear: number|null - Last year available in year selector. Defaults to current year + 10 if not set
- availableColor: string - Background color for available/bookable days (default: '#d4edda' - light green)
- weekdayBlockColor: string - Background color for recurring weekday blocks (default: '#e9ecef' - light gray)
- specificBlockColor: string - Background color for specific date blocks (default: '#f8d7da' - light red)
- currentDayBorderColor: string - Border color for today's date (default: '#007bff' - blue)
- backgroundColor: string - Calendar container background color
- headerTextColor: string - Color for month/year header text and selectors
- weekdayTextColor: string - Color for weekday labels row
- dayTextColor: string - Color for day numbers in calendar grid
- buttonColor: string - Color for navigation arrow buttons
- buttonBackgroundColor: string|null - Background color for navigation buttons (default: transparent)
- padding: string - Internal padding around calendar content (default: '20px')
- borderRadius: string - Border radius for rounded corners (default: '8px')
- boxShadow: string - Shadow effect around calendar (default: '0 2px 8px rgba(0, 0, 0, 0.1)')
- prevIcon: string - System icon name for previous month button (default: 'chevron-left')
- nextIcon: string - System icon name for next month button (default: 'chevron-right')

***Events:***
- dateClick: Triggered when user clicks on any date. Payload: { date: '2024-01-15' (ISO string), timestamp: 1705276800000, isBlocked: false, blockType: 'available'|'weekday'|'specific', blockInfo: {...} (block object if specific block) }
- monthChange: Triggered when user navigates to different month. Payload: { month: 'January 2024', direction: 'previous'|'next'|'today'|'selector' }

***Exposed Actions:***
- `goToToday`: Navigate calendar to current month. No arguments
- `goToDate`: Navigate calendar to specific date. Args: date (string) - ISO format date string like '2024-06-15'

***Exposed Variables:***
- selectedDate: Last clicked date in ISO format (path: variables['uid-selectedDate'])
- currentMonth: Currently displayed month and year (path: variables['uid-currentMonth'])

***Notes:***
- The component uses date-fns library for reliable date calculations and formatting
- Users can navigate months and years using either arrow buttons or dropdown selectors
- Month and year selectors are synchronized with arrow navigation
- The year range defaults to ±10 years from current year but can be customized with startYear and endYear properties
- Dates outside the current month are displayed with reduced opacity and are not clickable
- Block priority: specific blocks override weekday blocks when both apply to same date
- The specificBlocks property is designed to work directly with Supabase query results from a "bloqueios_profissional" table
- All date inputs should be in ISO format (YYYY-MM-DD) for consistency
- Time fields (horario_inicio, horario_fim) in specific blocks are stored but not currently used for visual display - they're available in the click event payload for workflow logic
- The calendar automatically highlights today's date with a distinctive border
- Navigation buttons and selectors are disabled in editor mode to prevent interference with editing
- All interactions are disabled when isEditing is true to ensure proper editor behavior
- The component is fully responsive and will adapt to its container width
- Color customization allows matching any design system or brand guidelines
- Month names are customizable and default to Portuguese, making it easy to support any language