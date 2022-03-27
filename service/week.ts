import * as cheerio from 'cheerio';
import Room from './room';


// the Week class is used to represent a calendar week with days and events.
// the Week class has a parse method that takes a string and parses it into a week object.
// the string is the HTML representation of the week.

export class FreeSlot {
    // Day starts at 08:00 so if minuteFromDayStart is 120, the free slot starts at 10:00
    public minuteFromDayStart: number = 0
    public minuteDuration: number = 0;
}

export class Day {
    public name: string = "";
    public times: FreeSlot[] = [];

    // Find all FreeSlots that occur within the specified range
    // Day starts at 08:00 which is equivalent to minuteFromDayStart=0, so if minuteFromDayStart is 120, the free slot starts at 10:00
    // The FreeSlot must be at least minuteDuration minutes long
    public findMatchingFreeSlots(anytimeStartingFrom: number, anytimeEndingBefore: number, minuteDuration: number): FreeSlot[] {
        let matchingFreeSlots: FreeSlot[] = [];
        for (let freeSlot of this.times) {
            const freeSlotStart = freeSlot.minuteFromDayStart;
            const freeSlotEnd = freeSlotStart + freeSlot.minuteDuration;
            if (freeSlotEnd >= anytimeStartingFrom && freeSlotStart < anytimeEndingBefore && freeSlot.minuteDuration >= minuteDuration
                && (freeSlotStart + minuteDuration <= anytimeEndingBefore)) {
                matchingFreeSlots.push(freeSlot);
            }
        }
        return matchingFreeSlots;
    }
}

export class Week {
    public days: Day[] = [];
    public room: Room = new Room("", "", 0);
    public static parse(room: Room, html: string): Week {
        const $ = cheerio.load(html);
        const week = new Week();
        const $main = $('main');

        // an element in $days is a day, we just care about the index
        // 0 is monday, 6 is sunday
        const $days = $main.find('.reservation-grid');

        week.days = [];
        week.room = room;

        // iterate over all days and find the free slots
        $days.each((index, day) => {
            const dayObj = new Day();
            // index to weekday name
            dayObj.name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];

            // free slots for the whole week.
            // a free slot has a start and end time.
            // the start time is defined by the attribute data-minfromdaystart
            // the end time is defined by the attribute data-min
            const $freeSlots = $(day).find('.free.slot');

            // iterate over all free slots and create a free slot object
            $freeSlots.each((index, freeSlot) => {
                const freeSlotObj = new FreeSlot();
                freeSlotObj.minuteFromDayStart = parseInt($(freeSlot).attr('data-minfromdaystart') || '0');
                freeSlotObj.minuteDuration = parseInt($(freeSlot).attr('data-min') || '0');
                dayObj.times.push(freeSlotObj);
            });

            week.days.push(dayObj);

        });

        return week;
    }

}