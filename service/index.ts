
// import fetch from "node-fetch";
import { SPACES, BUILDINGS, FLOORS, RoomType } from "./constants";
import Room, { AvailableTimeSlot } from "./room";

const TARGET_WEEK = "2022-03-21";
const TARGET_DAYS: string[] = [];
const TARGET_START_FROM = "8:30";
const TARGET_END_BEFORE = "16:00";
const TARGET_DURATION = "3:00";
const TARGET_BUILDING = "Kirjasto Lähde (B)";
const TARGET_ROOM_TYPES = [RoomType["Teamwork room"]];

// convert minutes to hours and minutes
const minutesFromDayStartToHour = (min: number) => {
    const hours = Math.floor(min / 60) + 8;
    const minutes = min % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

// convert hours to minutes
const hourToMinutes = (hour: string, fromDayStart: boolean = true) => {
    const [hours, minutes] = hour.split(":");
    return (parseInt(hours) - (fromDayStart ? 8 : 0)) * 60 + parseInt(minutes);
}

// for grouping the available time slots by room, adapted from https://stackoverflow.com/a/48981669
const groupBy = (xs: any[], f: { (timeSlot: any): any; (arg0: any): any; }) =>
    xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});



export default class FreeRoomSearcher {

    private allRooms: Room[];

    // constructor
    constructor(roomTypes: RoomType[] = TARGET_ROOM_TYPES) {
        // find the cross-section between buildings, floors and spaces, and return the rooms that match the criteria
        this.allRooms = SPACES.filter(s =>
            s.spaceCategoryExtension && roomTypes.includes(s.spaceCategoryExtension.id) && FLOORS.filter(f =>
                f.buildingId === BUILDINGS.find(b =>
                    b.name === TARGET_BUILDING
                )?.id
            ).map(f => f.id).includes(s.floorId)
        ).map(s => new Room(
            s.spaceLabel,
            FLOORS.find(f => f.id === s.floorId)?.name || "",
            s.spaceCategoryExtension?.id || 0,
        ));
        console.log(`Found ${this.allRooms.length} rooms.`);
    }



    // get the available time slots for each room
    public async find(date: string = TARGET_WEEK, days: string[] = TARGET_DAYS, startFrom: string = TARGET_START_FROM, endBefore: string = TARGET_END_BEFORE, duration: string = TARGET_DURATION): Promise<AvailableTimeSlot[]> {
        const availableTimeSlots = this.allRooms.map(async room => room.getAvailableTimeSlot(date));

        // wait for all the time slots to be available
        const roomWeeks = await Promise.all(availableTimeSlots);

        // find the first available time slot matching the target time and day using a flatMap
        const results = roomWeeks.flatMap(week => {
            const targetDays = days.length == 0 ? week.days : week.days.filter(day => days.includes(day.name));
            return targetDays.flatMap(targetDay => {
                const targetTimeSlot = targetDay.findMatchingFreeSlots(
                    hourToMinutes(startFrom),
                    hourToMinutes(endBefore),
                    hourToMinutes(duration, false)
                );
                if (targetTimeSlot.length > 0) {
                    // console.log(`Room ${week.room.name} (${week.room.floor}) is free from ${} until ${minutesFromDayStartToHour(slot.minuteFromDayStart + slot.minuteDuration)} on ${targetDay.name}`));
                    return targetTimeSlot.map(slot => new AvailableTimeSlot(
                        minutesFromDayStartToHour(slot.minuteFromDayStart),
                        minutesFromDayStartToHour(slot.minuteFromDayStart + slot.minuteDuration),
                        targetDay.name,
                        week.room
                    ));
                } else {
                    console.log(`No time slot found for room ${week.room} on ${targetDay.name}`);
                    console.log(JSON.stringify(targetDay, null, 2));
                    return [];
                }
            });
        });

        return results;
    };
};