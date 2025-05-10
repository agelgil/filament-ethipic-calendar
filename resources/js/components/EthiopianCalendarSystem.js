import {default as BaseEthiopianCalendarSystem} from "@calidy/dayjs-calendarsystems/calendarSystems/EthiopianCalendarSystem";
import {generateMonthNames} from "@calidy/dayjs-calendarsystems/calendarUtils/IntlUtils";
import * as CalendarUtils from "@calidy/dayjs-calendarsystems/calendarUtils/fourmilabCalendar";
import {toEthiopian, toGregorian} from "ethiopian-date";

export default class EthiopianCalendarSystem extends BaseEthiopianCalendarSystem {
    constructor(locale = "en") {
        super(locale);

        this.firstDayOfWeek = 0; // Sunday
        this.locale = locale;
        this.intlCalendar = "ethiopic";
        this.firstMonthNameEnglish = "Meskerem";
        this.monthNamesLocalized = generateMonthNames(
            locale,
            "ethiopic",
            this.firstMonthNameEnglish
        );
    }

    convertFromJulian(jdn) {
        const gregorian = CalendarUtils.jd_to_gregorian(jdn);

        return toEthiopian([gregorian[0], gregorian[1] + 1, gregorian[2]]);
    }

    convertToJulian(year, month, day) {
        const gregorian = toGregorian([year, month + 1, day]);

        return CalendarUtils.gregorian_to_jd(gregorian[0], gregorian[1] - 1, gregorian[2]);
    }

    convertFromGregorian(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const result = toEthiopian([year, month, day]);

        return {
            year: result[0],
            month: result[1] - 1,
            day: result[2],
        };
    }

    convertToGregorian(year, month, day) {
        const result = toGregorian([year, month + 1, day]);

        return {
            year: result[0],
            month: result[1] - 1,
            day: result[2],
        };
    }

    daysInMonth(year = null, month = null) {
        if (month === null) {
            month = this.$M;
        }

        if (month >= 12) {
            return this.isLeapYear(year) ? 6 : 5;
        }

        return 30;
    }
}
