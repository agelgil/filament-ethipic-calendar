import dayjs from 'dayjs/esm'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import calendarSystems from "@calidy/dayjs-calendarsystems";
import EthiopianCalendarSystem from "./EthiopianCalendarSystem";

dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(calendarSystems)
dayjs.registerCalendarSystem("ethiopic", new EthiopianCalendarSystem());

window.dayjs = dayjs

export default function filamentEthiopicCalendarComponent({
                                                        displayFormat,
                                                        firstDayOfWeek,
                                                        isAutofocused,
                                                        locale,
                                                        shouldCloseOnDateSelection,
                                                        state,
                                                        months,
                                                        dayLabel,
                                                        dayShortLabel
                                                    }) {
    const timezone = dayjs.tz.guess()

    return {
        daysInFocusedMonth: [],

        displayText: '',

        emptyDaysInFocusedMonth: [],

        focusedDate: null,

        focusedMonth: null,

        focusedYear: null,

        hour: null,

        isClearingState: false,

        minute: null,

        second: null,

        state,

        dayLabels: [],

        months,

        dayLabel,

        dayShortLabel,

        init: function () {
            dayjs.locale(locales[locale] ?? locales['en']);
            this.focusedDate = dayjs().tz(timezone).toCalendarSystem("ethiopic")
            let date =
                this.getSelectedDate() ??
                dayjs().tz(timezone).toCalendarSystem("ethiopic").hour(0).minute(0).second(0)

            if (this.getMaxDate() !== null && date.isAfter(this.getMaxDate())) {
                date = null
            } else if (
                this.getMinDate() !== null &&
                date.isBefore(this.getMinDate())
            ) {
                date = null
            }

            this.hour = date?.hour() ?? 0
            this.minute = date?.minute() ?? 0
            this.second = date?.second() ?? 0

            this.setDisplayText()
            this.setMonths()
            this.setDayLabels()

            if (isAutofocused) {
                this.$nextTick(() =>
                    this.togglePanelVisibility(this.$refs.button),
                )
            }

            this.$watch('focusedMonth', () => {
                this.focusedMonth = +this.focusedMonth

                if (this.focusedDate.month() === this.focusedMonth) {
                    return
                }

                this.focusedDate = this.focusedDate.month(this.focusedMonth)
            })

            this.$watch('focusedYear', () => {
                if (this.focusedYear?.length > 4) {
                    this.focusedYear = this.focusedYear.substring(0, 4)
                }

                if (!this.focusedYear || this.focusedYear?.length !== 4) {
                    return
                }

                let year = +this.focusedYear

                if (!Number.isInteger(year)) {
                    year = dayjs().tz(timezone).toCalendarSystem("ethiopic").year()

                    this.focusedYear = year
                }

                if (this.focusedDate.year() === year) {
                    return
                }

                this.focusedDate = this.focusedDate.year(year)
            })

            this.$watch('focusedDate', () => {
                let month = this.focusedDate.month()
                let year = this.focusedDate.year()

                if (this.focusedMonth !== month) {
                    this.focusedMonth = month
                }

                if (this.focusedYear !== year) {
                    this.focusedYear = year
                }

                this.setupDaysGrid()
            })

            this.$watch('hour', () => {
                let hour = +this.hour

                if (!Number.isInteger(hour)) {
                    this.hour = 0
                } else if (hour > 23) {
                    this.hour = 0
                } else if (hour < 0) {
                    this.hour = 23
                } else {
                    this.hour = hour
                }

                if (this.isClearingState) {
                    return
                }

                let date = this.getSelectedDate() ?? this.focusedDate

                this.setState(date.hour(this.hour ?? 0))
            })

            this.$watch('minute', () => {
                let minute = +this.minute

                if (!Number.isInteger(minute)) {
                    this.minute = 0
                } else if (minute > 59) {
                    this.minute = 0
                } else if (minute < 0) {
                    this.minute = 59
                } else {
                    this.minute = minute
                }

                if (this.isClearingState) {
                    return
                }

                let date = this.getSelectedDate() ?? this.focusedDate

                this.setState(date.minute(this.minute ?? 0))
            })

            this.$watch('second', () => {
                let second = +this.second

                if (!Number.isInteger(second)) {
                    this.second = 0
                } else if (second > 59) {
                    this.second = 0
                } else if (second < 0) {
                    this.second = 59
                } else {
                    this.second = second
                }

                if (this.isClearingState) {
                    return
                }

                let date = this.getSelectedDate() ?? this.focusedDate

                this.setState(date.second(this.second ?? 0))
            })

            this.$watch('state', () => {
                if (this.state === undefined) {
                    return
                }

                let date = this.getSelectedDate()

                if (date === null) {
                    this.clearState()

                    return
                }

                if (
                    this.getMaxDate() !== null &&
                    date?.isAfter(this.getMaxDate())
                ) {
                    date = null
                }
                if (
                    this.getMinDate() !== null &&
                    date?.isBefore(this.getMinDate())
                ) {
                    date = null
                }

                const newHour = date?.hour() ?? 0
                if (this.hour !== newHour) {
                    this.hour = newHour
                }

                const newMinute = date?.minute() ?? 0
                if (this.minute !== newMinute) {
                    this.minute = newMinute
                }

                const newSecond = date?.second() ?? 0
                if (this.second !== newSecond) {
                    this.second = newSecond
                }

                this.setDisplayText()
            })
        },

        clearState: function () {
            this.isClearingState = true

            this.setState(null)

            this.hour = 0
            this.minute = 0
            this.second = 0

            this.$nextTick(() => (this.isClearingState = false))
        },

        dateIsDisabled: function (date) {
            if (
                this.$refs?.disabledDates &&
                JSON.parse(this.$refs.disabledDates.value ?? []).some(
                    (disabledDate) => {
                        disabledDate = dayjs(disabledDate)

                        if (!disabledDate.isValid()) {
                            return false
                        }

                        return disabledDate.isSame(date.toCalendarSystem("gregory"), 'day')
                    },
                )
            ) {
                return true
            }

            if (this.getMaxDate() && date.isAfter(this.getMaxDate())) {
                return true
            }
            if (this.getMinDate() && date.isBefore(this.getMinDate())) {
                return true
            }

            return false
        },

        dayIsDisabled: function (day) {
            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            return this.dateIsDisabled(this.focusedDate.date(day))
        },

        dayIsSelected: function (day) {
            let selectedDate = this.getSelectedDate()

            if (selectedDate === null) {
                return false
            }

            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            return (
                selectedDate.date() === day &&
                selectedDate.month() === this.focusedDate.month() &&
                selectedDate.year() === this.focusedDate.year()
            )
        },

        dayIsToday: function (day) {
            let date = dayjs().tz(timezone).toCalendarSystem("ethiopic")
            this.focusedDate ??= date

            return (
                date.date() === day &&
                date.month() === this.focusedDate.month() &&
                date.year() === this.focusedDate.year()
            )
        },

        focusPreviousDay: function () {
            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            this.focusedDate = this.focusedDate.subtract(1, 'day')
        },

        focusPreviousWeek: function () {
            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            this.focusedDate = this.focusedDate.subtract(1, 'week')
        },

        focusNextDay: function () {
            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            this.focusedDate = this.focusedDate.add(1, 'day')
        },

        focusNextWeek: function () {
            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            this.focusedDate = this.focusedDate.add(1, 'week')
        },

        getDayLabels: function () {
            let flag = this.$el.dataset.weekdaysShort;
            let labels = [];
            if (flag === 'short') {
                if (typeof this.dayShortLabel !== 'object') {
                    labels = dayjs.weekdaysShort()
                } else {
                    labels = Object.values(this.dayShortLabel);
                }
            } else {
                if (typeof this.dayLabel !== 'object') {
                    labels = dayjs.weekdays()
                } else {
                    labels = Object.values(this.dayLabel);
                }
            }

            if (firstDayOfWeek === 0) {
                return labels
            }

            return [
                ...labels.slice(firstDayOfWeek),
                ...labels.slice(0, firstDayOfWeek),
            ]
        },

        getMaxDate: function () {
            let date = dayjs(this.$refs.maxDate?.value)

            return date.isValid() ? date.toCalendarSystem("ethiopic") : null
        },

        getMinDate: function () {
            let date = dayjs(this.$refs.minDate?.value)

            return date.isValid() ? date.toCalendarSystem("ethiopic") : null
        },

        getSelectedDate: function () {
            if (this.state === undefined) {
                return null
            }

            if (this.state === null) {
                return null
            }

            let date = dayjs(this.state).toCalendarSystem("ethiopic")

            if (!date.isValid()) {
                return null
            }

            return date
        },

        togglePanelVisibility: function () {
            if (!this.isOpen()) {
                this.focusedDate =
                    this.getSelectedDate() ??
                    this.getMinDate() ??
                    dayjs().tz(timezone).toCalendarSystem("ethiopic")

                this.setupDaysGrid()
            }

            this.$refs.panel.toggle(this.$refs.button)
        },

        selectDate: function (day = null) {
            if (day) {
                this.setFocusedDay(day)
            }

            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            this.setState(this.focusedDate)

            if (shouldCloseOnDateSelection) {
                this.togglePanelVisibility()
            }
        },

        setDisplayText: function () {
            this.displayText = this.getSelectedDate()
                ? this.getSelectedDate().format(displayFormat)
                : ''
        },

        setMonths: function () {
            if (typeof this.months !== 'object' || !Array.isArray(this.months) || this.months === null) {
                this.months = dayjs.months()
            }
        },

        setDayLabels: function () {
            this.dayLabels = this.getDayLabels()
        },

        setupDaysGrid: function () {
            this.focusedDate ??= dayjs().tz(timezone).toCalendarSystem("ethiopic")

            this.emptyDaysInFocusedMonth = Array.from(
                {
                    length: this.focusedDate.date(7 - firstDayOfWeek).day(),
                },
                (_, i) => i + 1,
            )

            this.daysInFocusedMonth = Array.from(
                {
                    length: this.focusedDate.daysInMonth(),
                },
                (_, i) => i + 1,
            )
        },

        setFocusedDay: function (day) {
            const diff = day - this.focusedDate.date();
            this.focusedDate = this.focusedDate.add(diff, 'day')
        },

        setState: function (date) {
            if (date === null) {
                this.state = null
                this.setDisplayText()

                return
            }

            if (this.dateIsDisabled(date)) {
                return
            }

            this.state = date
                .hour(this.hour ?? 0)
                .minute(this.minute ?? 0)
                .second(this.second ?? 0)
                .toCalendarSystem('gregory')
                .format('YYYY-MM-DD HH:mm:ss')

            this.setDisplayText()
        },

        isOpen: function () {
            return this.$refs.panel?.style.display === 'block'
        },
    }
}

const locales = {
    am: require('dayjs/locale/am'),
    en: require('dayjs/locale/en'),
}
