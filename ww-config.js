export default {
  editor: {
    label: {
      en: 'Appointment Calendar',
      pt: 'Calendário de Agendamentos'
    },
    icon: 'calendar'
  },
  triggerEvents: [
    {
      name: 'dateClick',
      label: { 
        en: 'On date click',
        pt: 'Ao clicar em data'
      },
      event: {
        date: '',
        timestamp: 0,
        isBlocked: false,
        blockType: '',
        blockInfo: null
      },
      default: true
    },
    {
      name: 'monthChange',
      label: { 
        en: 'On month change',
        pt: 'Ao mudar mês'
      },
      event: {
        month: '',
        direction: ''
      }
    }
  ],
  properties: {
    blockedWeekdays: {
      label: { 
        en: 'Blocked weekdays',
        pt: 'Dias da semana bloqueados'
      },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [0, 6],
      options: {
        expandable: true,
        getItemLabel(_, index) {
          return `Day ${index + 1}`;
        },
        item: {
          type: 'Number',
          defaultValue: 0,
          options: {
            min: 0,
            max: 6,
            step: 1
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind to an array of numbers (0-6) representing blocked weekdays. 0 = Sunday, 6 = Saturday. Example: [0, 6] blocks weekends'
      },
      propertyHelp: {
        tooltip: 'Array of weekday numbers to block (0 = Sunday, 1 = Monday, ..., 6 = Saturday). These days will be shown as unavailable across all weeks.'
      }
      /* wwEditor:end */
    },
    specificBlocks: {
      label: { 
        en: 'Specific date blocks',
        pt: 'Bloqueios específicos'
      },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      options: {
        expandable: true,
        getItemLabel(_, index) {
          return `Block ${index + 1}`;
        },
        item: {
          type: 'Object',
          defaultValue: {
            data_inicio: '2024-01-01',
            data_fim: '2024-01-01',
            dia_completo: true,
            horario_inicio: null,
            horario_fim: null
          },
          options: {
            item: {
              data_inicio: {
                label: { 
                  en: 'Start date',
                  pt: 'Data início'
                },
                type: 'Text',
                options: { placeholder: '2024-01-01' }
              },
              data_fim: {
                label: { 
                  en: 'End date',
                  pt: 'Data fim'
                },
                type: 'Text',
                options: { placeholder: '2024-01-01' }
              },
              dia_completo: {
                label: { 
                  en: 'Full day',
                  pt: 'Dia completo'
                },
                type: 'OnOff',
                defaultValue: true
              },
              horario_inicio: {
                label: { 
                  en: 'Start time',
                  pt: 'Horário início'
                },
                type: 'Text',
                options: { placeholder: '09:00' }
              },
              horario_fim: {
                label: { 
                  en: 'End time',
                  pt: 'Horário fim'
                },
                type: 'Text',
                options: { placeholder: '17:00' }
              }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind to an array of block objects from your Supabase "bloqueios_profissional" table. Each object should have: data_inicio (ISO date string), data_fim (ISO date string), dia_completo (boolean), horario_inicio (time string), horario_fim (time string)'
      },
      propertyHelp: {
        tooltip: 'Array of specific date blocks from your database. Each block should contain start date, end date, and optionally time ranges. These dates will be shown as specifically blocked (red) in the calendar.'
      }
      /* wwEditor:end */
    },
    weekdayLabels: {
      label: {
        en: 'Weekday labels',
        pt: 'Rótulos dos dias'
      },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      options: {
        expandable: true,
        getItemLabel(_, index) {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          return days[index] || `Day ${index + 1}`;
        },
        item: {
          type: 'Text',
          defaultValue: 'Day',
          options: { placeholder: 'Day label' }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind to an array of 7 strings representing weekday labels. Example: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] for Portuguese'
      },
      propertyHelp: {
        tooltip: 'Array of 7 labels for the weekdays, starting with Sunday. Customize these to match your language or preferred abbreviations.'
      }
      /* wwEditor:end */
    },
    monthNames: {
      label: {
        en: 'Month names',
        pt: 'Nomes dos meses'
      },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      options: {
        expandable: true,
        getItemLabel(_, index) {
          return `Month ${index + 1}`;
        },
        item: {
          type: 'Text',
          defaultValue: 'Month',
          options: { placeholder: 'Month name' }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind to an array of 12 strings representing month names in your preferred language'
      },
      propertyHelp: {
        tooltip: 'Array of 12 month names for the month selector dropdown'
      }
      /* wwEditor:end */
    },
    startYear: {
      label: {
        en: 'Start year',
        pt: 'Ano inicial'
      },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: null,
      options: {
        min: 1900,
        max: 2200,
        step: 1
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Starting year for the year selector. Leave empty to default to current year - 10'
      },
      propertyHelp: {
        tooltip: 'First year available in the year selector dropdown. Defaults to 10 years before current year if not set'
      }
      /* wwEditor:end */
    },
    endYear: {
      label: {
        en: 'End year',
        pt: 'Ano final'
      },
      type: 'Number',
      section: 'settings',
      bindable: true,
      defaultValue: null,
      options: {
        min: 1900,
        max: 2200,
        step: 1
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Ending year for the year selector. Leave empty to default to current year + 10'
      },
      propertyHelp: {
        tooltip: 'Last year available in the year selector dropdown. Defaults to 10 years after current year if not set'
      }
      /* wwEditor:end */
    },
    backgroundColor: {
      label: { 
        en: 'Background color',
        pt: 'Cor de fundo'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#ffffff',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string (hex, rgb, or rgba). Example: "#ffffff" or "rgb(255, 255, 255)"'
      },
      propertyHelp: {
        tooltip: 'Background color for the entire calendar component'
      }
      /* wwEditor:end */
    },
    headerTextColor: {
      label: { 
        en: 'Header text color',
        pt: 'Cor do texto do cabeçalho'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#212529',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string for the month/year header text'
      },
      propertyHelp: {
        tooltip: 'Color for the month and year text in the calendar header'
      }
      /* wwEditor:end */
    },
    weekdayTextColor: {
      label: { 
        en: 'Weekday text color',
        pt: 'Cor do texto dos dias da semana'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#6c757d',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string for weekday labels (Sun, Mon, etc.)'
      },
      propertyHelp: {
        tooltip: 'Color for the weekday labels row (Sun, Mon, Tue, etc.)'
      }
      /* wwEditor:end */
    },
    dayTextColor: {
      label: { 
        en: 'Day number color',
        pt: 'Cor dos números dos dias'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#212529',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string for day numbers in the calendar grid'
      },
      propertyHelp: {
        tooltip: 'Color for the day numbers displayed in each calendar cell'
      }
      /* wwEditor:end */
    },
    availableColor: {
      label: { 
        en: 'Available day color',
        pt: 'Cor dos dias disponíveis'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#d4edda',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string for available/bookable days. Recommended: light green shades'
      },
      propertyHelp: {
        tooltip: 'Background color for days that are available for booking (not blocked)'
      }
      /* wwEditor:end */
    },
    weekdayBlockColor: {
      label: { 
        en: 'Weekday block color',
        pt: 'Cor dos bloqueios semanais'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#e9ecef',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string for recurring weekday blocks. Recommended: light gray shades'
      },
      propertyHelp: {
        tooltip: 'Background color for days blocked by recurring weekday rules (e.g., all Sundays)'
      }
      /* wwEditor:end */
    },
    specificBlockColor: {
      label: {
        en: 'Specific block color',
        pt: 'Cor dos bloqueios específicos'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#f8d7da',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string for specific date blocks from database. Recommended: light red shades'
      },
      propertyHelp: {
        tooltip: 'Background color for days blocked by specific date ranges from your database (partial blocks)'
      }
      /* wwEditor:end */
    },
    fullDayBlockColor: {
      label: {
        en: 'Full day block color',
        pt: 'Cor do bloqueio completo'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#dc3545',
      options: {
        nullable: false
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a color string for full day blocks. Recommended: red shades'
      },
      propertyHelp: {
        tooltip: 'Background color for days that are completely blocked (dia_completo = true). Shows with lock icon.'
      }
      /* wwEditor:end */
    },
    blockIcon: {
      label: {
        en: 'Block icon',
        pt: 'Ícone de bloqueio'
      },
      type: 'SystemIcon',
      section: 'style',
      bindable: true,
      defaultValue: 'lock',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to a system icon name for full day blocked dates'
      },
      propertyHelp: {
        tooltip: 'Icon displayed on days that are completely blocked'
      }
      /* wwEditor:end */
    },
    showLegend: {
      label: {
        en: 'Show legend',
        pt: 'Mostrar legenda'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Set to true to show the calendar legend, false to hide it'
      },
      propertyHelp: {
        tooltip: 'Display a legend explaining the color codes and blocked status indicators'
      }
      /* wwEditor:end */
    },
    legendLabels: {
      label: {
        en: 'Legend labels',
        pt: 'Rótulos da legenda'
      },
      type: 'Object',
      section: 'settings',
      bindable: true,
      defaultValue: {
        available: 'Disponível',
        weekdayBlock: 'Bloqueio semanal',
        partialBlock: 'Bloqueio parcial',
        fullBlock: 'Bloqueado'
      },
      options: {
        item: {
          available: {
            type: 'Text',
            label: { en: 'Available label', pt: 'Rótulo disponível' },
            defaultValue: 'Disponível'
          },
          weekdayBlock: {
            type: 'Text',
            label: { en: 'Weekday block label', pt: 'Rótulo bloqueio semanal' },
            defaultValue: 'Bloqueio semanal'
          },
          partialBlock: {
            type: 'Text',
            label: { en: 'Partial block label', pt: 'Rótulo bloqueio parcial' },
            defaultValue: 'Bloqueio parcial'
          },
          fullBlock: {
            type: 'Text',
            label: { en: 'Full block label', pt: 'Rótulo bloqueado' },
            defaultValue: 'Bloqueado'
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'Object with legend label texts: { available, weekdayBlock, partialBlock, fullBlock }'
      },
      propertyHelp: {
        tooltip: 'Customize the text labels shown in the calendar legend'
      }
      /* wwEditor:end */
    },
currentDayBorderColor: {
label: { 
en: 'Current day border',
pt: 'Borda do dia atual'
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#007bff',
options: {
nullable: false
},
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a color string for the border around today\'s date'
},
propertyHelp: {
tooltip: 'Border color used to highlight the current day in the calendar'
}
/* wwEditor:end */
},
buttonColor: {
label: { 
en: 'Navigation button color',
pt: 'Cor dos botões de navegação'
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#007bff',
options: {
nullable: false
},
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a color string for the previous/next month navigation buttons'
},
propertyHelp: {
tooltip: 'Color for the navigation arrow buttons (previous/next month)'
}
/* wwEditor:end */
},
buttonBackgroundColor: {
label: { 
en: 'Button background',
pt: 'Fundo dos botões'
},
type: 'Color',
section: 'style',
bindable: true,
defaultValue: 'transparent',
options: {
nullable: true
},
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a color string for navigation button backgrounds. Use "transparent" for no background'
},
propertyHelp: {
tooltip: 'Background color for navigation buttons. Set to transparent for icon-only buttons'
}
/* wwEditor:end */
},
padding: {
label: { 
en: 'Padding',
pt: 'Espaçamento interno'
},
type: 'Length',
section: 'style',
bindable: true,
defaultValue: '20px',
options: {
unitChoices: [
{ value: 'px', label: 'px', min: 0, max: 100 },
{ value: 'rem', label: 'rem', min: 0, max: 10 }
]
},
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a length string with unit. Example: "20px" or "1.5rem"'
},
propertyHelp: {
tooltip: 'Internal padding around the calendar content'
}
/* wwEditor:end */
},
borderRadius: {
label: { 
en: 'Border radius',
pt: 'Raio da borda'
},
type: 'Length',
section: 'style',
bindable: true,
defaultValue: '8px',
options: {
unitChoices: [
{ value: 'px', label: 'px', min: 0, max: 50 },
{ value: '%', label: '%', min: 0, max: 50 }
]
},
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a length string with unit. Example: "8px" or "5%"'
},
propertyHelp: {
tooltip: 'Border radius for rounded corners of the calendar container'
}
/* wwEditor:end */
},
boxShadow: {
label: { 
en: 'Box shadow',
pt: 'Sombra'
},
type: 'Shadows',
section: 'style',
bindable: true,
defaultValue: '0 2px 8px rgba(0, 0, 0, 0.1)',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a CSS box-shadow string. Example: "0 2px 8px rgba(0, 0, 0, 0.1)"'
},
propertyHelp: {
tooltip: 'Shadow effect around the calendar container for depth'
}
/* wwEditor:end */
},
prevIcon: {
label: { 
en: 'Previous month icon',
pt: 'Ícone mês anterior'
},
type: 'SystemIcon',
section: 'style',
bindable: true,
defaultValue: 'chevron-left',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a system icon name for the previous month button'
},
propertyHelp: {
tooltip: 'Icon displayed in the previous month navigation button'
}
/* wwEditor:end */
},
nextIcon: {
label: { 
en: 'Next month icon',
pt: 'Ícone próximo mês'
},
type: 'SystemIcon',
section: 'style',
bindable: true,
defaultValue: 'chevron-right',
/* wwEditor:start */
bindingValidation: {
type: 'string',
tooltip: 'Bind to a system icon name for the next month button'
},
propertyHelp: {
tooltip: 'Icon displayed in the next month navigation button'
}
/* wwEditor:end */
}
},
actions: [
{
label: { 
en: 'Go to today',
pt: 'Ir para hoje'
},
action: 'goToToday'
},
{
label: { 
en: 'Go to specific date',
pt: 'Ir para data específica'
},
action: 'goToDate',
args: [
{
name: 'date',
type: 'string',
label: { 
en: 'Date (ISO format)',
pt: 'Data (formato ISO)'
}
}
]
}
]
};