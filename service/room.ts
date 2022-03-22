import { RoomType } from "./constants";
import { Week } from "./week";

// A simple class to represent an available time slot for a room on a given day
export class AvailableTimeSlot {
    public start: string;
    public end: string;
    public day: string;
    public room: Room;

    constructor(start: string, end: string, day: string, room: Room) {
        this.start = start;
        this.end = end;
        this.day = day;
        this.room = room;
    }
}

// A simple class to represent a room
export default class Room {
    public name: string;
    public floor: string;
    public type: RoomType;

    constructor(name: string, floor: string, type: RoomType) {
        this.name = name;
        this.floor = floor;
        this.type = type;
    }

    // Query the KOVS calendar page for the given room and return the first available time slot.
    public async getAvailableTimeSlot(date: string = ""): Promise<Week> {
        console.log(`Querying KOVS calendar for room ${this.name}...`);
        // FIXME: due to CORS, this will only work when the app runs outside the browser
        //  need to use a proxy server to make it work
        const QUERY_URL = `https://kovs-calendar.app.jyu.fi/room/${this.name}/week?date=${date}&lang=en`;
        const response = await fetch(QUERY_URL);
        const html = await response.text();
        const week = Week.parse(this, html);
        return week;
    }
}
