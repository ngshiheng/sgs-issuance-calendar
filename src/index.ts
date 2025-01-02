import { BondRecord, MASApiService } from "./api";

function main(): void {
    const api = new MASApiService();

    const today = new Date();

    const currentYear = today.getFullYear();

    for (const year of [currentYear, currentYear + 1]) {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        createMonthlyTrigger();
        createSGSBondsIssuanceCalendar(api, startDate, endDate);
        createTBillsIssuanceCalendar(api, startDate, endDate, 0.5);
        createTBillsIssuanceCalendar(api, startDate, endDate, 1);
        createSavingsBondsIssuanceCalendar(api, startDate, endDate);
        createMASBillsIssuanceCalendar(api, startDate, endDate);
        createMASFRNIssuanceCalendar(api, startDate, endDate);
    }
}

export function getRelativeDate(daysOffset: number, hour: number, date = new Date()) {
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hour);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function createSGSBondsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string): void {
    const calendarName = "SGS Bonds";
    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getSGSBondsIssuanceCalendar(startDate, endDate);
    const records = response.result.records;
    if (records.length === 0) {
        Logger.log("No SGS Bonds issuance calendar available");
    }

    const existingEvents = calendar.getEvents(new Date(startDate), getRelativeDate(365, 0, new Date(endDate)));

    for (const record of records) {
        const eventDescription = createEventDescription(record);

        const announcementDate = new Date(record.ann_date);
        const announcementTitle = `SGS Bonds Announcement - ${record.issue_code}`;
        updateOrCreateAllDayEvent(announcementTitle, eventDescription, announcementDate, calendar, existingEvents);

        const auctionDate = new Date(record.auction_date);
        const auctionTitle = `SGS Bonds Auction - ${record.issue_code}`;
        updateOrCreateAllDayEvent(auctionTitle, eventDescription, auctionDate, calendar, existingEvents);
    }
}

function createTBillsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string, auctionTenor: number): void {
    let calendarName: string;

    switch (auctionTenor) {
        case 0.5:
            calendarName = "6-Month T-bill";
            break;
        case 1:
            calendarName = "1-Year T-bill";
            break;
        default:
            throw new Error("Invalid auction tenor for T-bill");
    }

    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getTBillsIssuanceCalendar(startDate, endDate, auctionTenor);
    const records = response.result.records;
    if (records.length === 0) {
        Logger.log("No T-bill issuance calendar available");
        return;
    }

    const existingEvents = calendar.getEvents(new Date(startDate), getRelativeDate(365, 0, new Date(endDate)));

    for (const record of records) {
        const eventDescription = createEventDescription(record);

        const announcementDate = new Date(record.ann_date);
        const announcementTitle = `T-bill Announcement - ${record.issue_code}`;
        updateOrCreateAllDayEvent(announcementTitle, eventDescription, announcementDate, calendar, existingEvents);

        const auctionDate = new Date(record.auction_date);
        const auctionTitle = `T-bill Auction - ${record.issue_code}`;
        updateOrCreateAllDayEvent(auctionTitle, eventDescription, auctionDate, calendar, existingEvents);
    }
}

function createSavingsBondsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string): void {
    const calendarName = "Savings Bonds";
    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getSavingsBondIssuanceCalendar(startDate, endDate);
    const records = response.result.records;
    if (records.length === 0) {
        Logger.log("No Savings Bonds issuance calendar available");
        return;
    }

    const existingEvents = calendar.getEvents(new Date(startDate), getRelativeDate(365, 0, new Date(endDate)));

    for (const record of records) {
        const eventDescription = createEventDescription(record);

        const announcementDate = new Date(record.ann_date);
        const announcementTitle = `SSB Announcement - ${record.issue_code}`;
        updateOrCreateAllDayEvent(announcementTitle, eventDescription, announcementDate, calendar, existingEvents);

        const closingDate = new Date(record.last_day_to_apply);
        const closingTitle = `SSB Closing - ${record.issue_code}`;
        updateOrCreateAllDayEvent(closingTitle, eventDescription, closingDate, calendar, existingEvents);
    }
}

function createMASBillsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string): void {
    const calendarName = "MAS Bills";
    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getMASBillsIssuanceCalendar(startDate, endDate);
    const records = response.result.records;
    if (records.length === 0) {
        Logger.log("No MAS Bills issuance calendar available");
        return;
    }

    const existingEvents = calendar.getEvents(new Date(startDate), getRelativeDate(365, 0, new Date(endDate)));

    for (const record of records) {
        const eventDescription = createEventDescription(record, "week");

        const announcementDate = new Date(record.ann_date);
        const announcementTitle = `MAS Bills Announcement - ${record.issue_code}`;
        updateOrCreateAllDayEvent(announcementTitle, eventDescription, announcementDate, calendar, existingEvents);

        const auctionDate = new Date(record.auction_date);
        const auctionTitle = `MAS Bills Auction - ${record.issue_code}`;
        updateOrCreateAllDayEvent(auctionTitle, eventDescription, auctionDate, calendar, existingEvents);
    }
}

function createMASFRNIssuanceCalendar(api: MASApiService, startDate: string, endDate: string): void {
    const calendarName = "MAS FRN";
    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getMASFRNIssuanceCalendar(startDate, endDate);
    const records = response.result.records;
    if (records.length === 0) {
        Logger.log("No MAS FRN issuance calendar available");
        return;
    }

    const existingEvents = calendar.getEvents(new Date(startDate), getRelativeDate(365, 0, new Date(endDate)));

    for (const record of records) {
        const eventDescription = createEventDescription(record, "month");

        const announcementDate = new Date(record.ann_date);
        const announcementTitle = `MAS FRN Announcement - ${record.issue_code}`;
        updateOrCreateAllDayEvent(announcementTitle, eventDescription, announcementDate, calendar, existingEvents);

        const auctionDate = new Date(record.auction_date);
        const auctionTitle = `MAS FRN Auction - ${record.issue_code}`;
        updateOrCreateAllDayEvent(auctionTitle, eventDescription, auctionDate, calendar, existingEvents);
    }
}

export function createMonthlyTrigger(): GoogleAppsScript.Script.Trigger {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        const triggerExist = trigger.getHandlerFunction() === main.name;
        if (triggerExist) {
            Logger.log(`Trigger "${main.name}" already exist`);
            return trigger;
        }
    }

    Logger.log(`Creating new monthly trigger`);
    return ScriptApp.newTrigger(main.name).timeBased().onMonthDay(1).atHour(1).create();
}

export function getOrCreateCalendar(calendarName: string): GoogleAppsScript.Calendar.Calendar {
    const calendars = CalendarApp.getCalendarsByName(calendarName);

    const existingCalendar = calendars.find((calendar) => calendar.isOwnedByMe);
    if (!!existingCalendar) {
        Logger.log(`Calendar "${calendarName}" already exist`);
        return existingCalendar;
    }

    Logger.log(`Creating new "${calendarName}" calendar`);
    const newCalendar = CalendarApp.createCalendar(calendarName);

    newCalendar.setDescription(
        "For more information, visit https://www.mas.gov.sg/bonds-and-bills/auctions-and-issuance-calendar",
    );
    newCalendar.setSelected(true);
    newCalendar.setTimeZone("Asia/Singapore");

    return newCalendar;
}

export function updateOrCreateAllDayEvent(
    title: string,
    description: string,
    date: Date,
    calendar: GoogleAppsScript.Calendar.Calendar,
    existingEvents: GoogleAppsScript.Calendar.CalendarEvent[],
): GoogleAppsScript.Calendar.CalendarEvent {
    const event = existingEvents.find((event) => event.getTitle() === title);

    if (!!event) {
        Logger.log(`Event "${title}" already exist - updating...`);
        event.setDescription(description);
        event.setAllDayDate(date);
        return event;
    }

    Logger.log(`Creating "${title}"`);
    const newEvent = calendar.createAllDayEvent(title, date, { description });
    newEvent.setGuestsCanModify(false);
    newEvent.setGuestsCanSeeGuests(false);
    newEvent.setGuestsCanInviteOthers(false);
    newEvent.setVisibility(CalendarApp.Visibility.PUBLIC);
    return newEvent;
}

export function createEventDescription(record: BondRecord, tenorUnit: string = "year"): string {
    const fields = [
        { key: "Allotment Date", value: record.tender_date },
        { key: "Announcement Date", value: record.ann_date },
        { key: "Auction Date", value: record.auction_date },
        { key: "Closing Date", value: record.last_day_to_apply },
        { key: "ISIN Code", value: record.isin_code },
        { key: "Issue Code", value: record.issue_code },
        { key: "Issue Date", value: record.issue_date },
        { key: "Maturity Date", value: record.maturity_date },
        { key: "SGS Type", value: record.sgs_type },
        { key: "Tenor", value: record.auction_tenor ? `${record.auction_tenor} ${tenorUnit}` : null },
    ];

    const masCalendarLink = "https://www.mas.gov.sg/bonds-and-bills/auctions-and-issuance-calendar";

    const githubRepoLink = "https://github.com/ngshiheng/sgs-issuance-calendar";

    const description = fields
        .filter((field) => field.value)
        .map((field) => `<b>${field.key}</b>: ${field.value}`)
        .join("\n");

    const moreDetails = `<b>More Details</b>: <a href='${masCalendarLink}'>MAS Bonds and Bills Auctions and Issuance Calendar</a>`;
    const githubInfo = `<i>Feel free to report any issues or contribute to the source code on this <a href='${githubRepoLink}'>GitHub repository</a>.</i>`;

    return `${description}\n\n${moreDetails}\n\n${githubInfo}`;
}
