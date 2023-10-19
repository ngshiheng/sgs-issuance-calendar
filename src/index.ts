import { MASApiService } from "./api";

function main(): void {
    const masApiService = new MASApiService();

    const today = new Date();
    const startDate = `${today.getFullYear()}-01-01`;
    const endDate = `${today.getFullYear()}-12-31`;

    createMonthlyTrigger();
    createSGSBondsIssuanceCalendar(masApiService, startDate, endDate);
    createTBillsIssuanceCalendar(masApiService, startDate, endDate, 0.5);
    createTBillsIssuanceCalendar(masApiService, startDate, endDate, 1);
    createSavingsBondsIssuanceCalendar(masApiService, startDate, endDate);
}

function createMonthlyTrigger(): GoogleAppsScript.Script.Trigger {
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

function createTBillsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string, auctionTenor: number): void {
    let calendarName: string;

    switch (auctionTenor) {
        case 1:
            calendarName = "6-Month T-bill";
            break;
        case 0.5:
            calendarName = "1-Year T-bill";
            break;
        default:
            throw new Error("Invalid auction tenor for T-bill");
    }

    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getTBillsIssuanceCalendar(startDate, endDate, auctionTenor);
    const records = response.result.records;

    const existingEvents = calendar.getEvents(new Date(startDate), new Date(endDate));

    for (const record of records) {
        const issueCode = record.issue_code;
        const announcementDate = new Date(record.ann_date);
        const auctionDate = new Date(record.auction_date);

        const announcementTitle = `T-bill Announcement - ${issueCode}`;
        const auctionTitle = `T-bill Auction - ${issueCode}`;
        const eventDescription =
            `Announcement Date: <b>${record.ann_date}</b>\n` +
            `Auction Date: <b>${record.auction_date}</b>\n` +
            `Issue Date: <b>${record.issue_date}</b>\n` +
            `Maturity Date: <b>${record.maturity_date}</b>\n` +
            `Issue Code: <b>${record.issue_code}</b>\n` +
            `ISIN Code: <b>${record.isin_code}</b>`;

        const announcementEventExists = existingEvents.some((event) => event.getTitle() === announcementTitle);
        if (announcementEventExists) {
            Logger.log(`Event "${announcementTitle}" already exist`);
        } else {
            Logger.log(`Creating "${announcementTitle}"`);
            calendar
                .createAllDayEvent(announcementTitle, announcementDate, { description: eventDescription })
                .setGuestsCanSeeGuests(false);
        }

        const auctionEventExists = existingEvents.some((event) => event.getTitle() === auctionTitle);
        if (auctionEventExists) {
            Logger.log(`Event "${auctionTitle}" already exist`);
        } else {
            Logger.log(`Creating "${auctionTitle}"`);
            calendar
                .createAllDayEvent(auctionTitle, auctionDate, { description: eventDescription })
                .setGuestsCanSeeGuests(false);
        }
    }
}

function createSavingsBondsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string): void {
    const calendarName = "Savings Bonds";
    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getSavingsBondIssuanceCalendar(startDate, endDate);
    const records = response.result.records;

    const existingEvents = calendar.getEvents(new Date(startDate), new Date(endDate));

    for (const record of records) {
        const issueCode = record.issue_code;
        const announcementDate = new Date(record.ann_date);
        const closingDate = new Date(record.last_day_to_apply);

        const announcementTitle = `SSB Announcement - ${issueCode}`;
        const closingTitle = `SSB Closing - ${issueCode}`;

        const eventDescription =
            `Announcement Date: <b>${record.ann_date}</b>\n` +
            `Closing Date: <b>${record.last_day_to_apply}</b>\n` +
            `Allotment Date: <b>${record.tender_date}</b>\n` +
            `Issue Date: <b>${record.issue_date}</b>\n` +
            `Maturity Date: <b>${record.maturity_date}</b>\n` +
            `Issue Code: <b>${record.issue_code}</b>\n` +
            `ISIN Code: <b>${record.isin_code}</b>`;

        const announcementEventExists = existingEvents.some((event) => event.getTitle() === announcementTitle);
        if (announcementEventExists) {
            Logger.log(`Event "${announcementTitle}" already exist`);
        } else {
            Logger.log(`Creating "${announcementTitle}"`);
            calendar
                .createAllDayEvent(announcementTitle, announcementDate, { description: eventDescription })
                .setGuestsCanSeeGuests(false);
        }

        const auctionEventExists = existingEvents.some((event) => event.getTitle() === closingTitle);
        if (auctionEventExists) {
            Logger.log(`Event "${closingTitle}" already exist`);
        } else {
            Logger.log(`Creating "${closingTitle}"`);
            calendar
                .createAllDayEvent(closingTitle, closingDate, { description: eventDescription })
                .setGuestsCanSeeGuests(false);
        }
    }
}

function createSGSBondsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string): void {
    const calendarName = "SGS Bonds";
    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getSGSBondsIssuanceCalendar(startDate, endDate);
    const records = response.result.records;

    const existingEvents = calendar.getEvents(new Date(startDate), new Date(endDate));

    for (const record of records) {
        const issueCode = record.issue_code;
        const announcementDate = new Date(record.ann_date);
        const auctionDate = new Date(record.auction_date);

        const announcementTitle = `SGS Bonds Announcement - ${issueCode}`;
        const auctionTitle = `SGS Bonds Auction - ${issueCode}`;
        const eventDescription =
            `Announcement Date: <b>${record.ann_date}</b>\n` +
            `Auction Date: <b>${record.auction_date}</b>\n` +
            `Issue Date: <b>${record.issue_date}</b>\n` +
            `Maturity Date: <b>${record.maturity_date}</b>\n` +
            `Tenor: <b>${record.auction_tenor}-year</b>\n` +
            `Issue Code: <b>${record.issue_code}</b>\n` +
            `ISIN Code: <b>${record.isin_code}</b>\n` +
            `SGS Type: <b>${record.sgs_type}</b>`;

        const announcementEventExists = existingEvents.some((event) => event.getTitle() === announcementTitle);
        if (announcementEventExists) {
            Logger.log(`Event "${announcementTitle}" already exist`);
        } else {
            Logger.log(`Creating "${announcementTitle}"`);
            calendar
                .createAllDayEvent(announcementTitle, announcementDate, { description: eventDescription })
                .setGuestsCanSeeGuests(false);
        }

        const auctionEventExists = existingEvents.some((event) => event.getTitle() === auctionTitle);
        if (auctionEventExists) {
            Logger.log(`Event "${auctionTitle}" already exist`);
        } else {
            Logger.log(`Creating "${auctionTitle}"`);
            calendar
                .createAllDayEvent(auctionTitle, auctionDate, { description: eventDescription })
                .setGuestsCanSeeGuests(false);
        }
    }
}

function getOrCreateCalendar(calendarName: string): GoogleAppsScript.Calendar.Calendar {
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
