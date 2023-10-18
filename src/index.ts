import { MASApiService } from "./api";

function main(): void {
    const masApiService = new MASApiService();

    const today = new Date();
    const startDate = `${today.getFullYear()}-01-01`;
    const endDate = `${today.getFullYear()}-12-31`;

    createMonthlyTrigger();
    createSixMonthTBillsIssuanceCalendar(masApiService, startDate, endDate, 0.5);

    // TODO: Create createOneYearTBillsIssuanceCalendar
    // TODO: Create createSavingsBondsIssuanceCalendar
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

function createSixMonthTBillsIssuanceCalendar(api: MASApiService, startDate: string, endDate: string, auctionTenor: number) {
    const calendarName = "6-Month T-bill";
    const calendar = getOrCreateCalendar(calendarName);

    const response = api.getTBillsIssuanceCalendar(startDate, endDate, auctionTenor);
    const records = response.result.records;

    for (const record of records) {
        const issueCode = record.issue_code;
        const auctionDate = new Date(record.auction_date);

        const eventTitle = `T-bill Auction - ${issueCode}`;
        const eventDescription =
            `Announcement Date: <b>${record.ann_date}</b>\n` +
            `Auction Date: <b>${record.auction_date}</b>\n` +
            `Issue Date: <b>${record.issue_date}</b>\n` +
            `Maturity Date: <b>${record.maturity_date}</b>\n` +
            `Issue Code: <b>${record.issue_code}</b>\n` +
            `ISIN Code: <b>${record.isin_code}</b>`;

        const existingEvents = calendar.getEventsForDay(auctionDate);
        const eventExists = existingEvents.some((event) => event.getTitle() === eventTitle);

        if (eventExists) {
            Logger.log(`Event "${eventTitle}" already exist`);
            continue;
        }

        Logger.log(`Creating "${eventTitle}"`);
        calendar.createAllDayEvent(eventTitle, auctionDate, { description: eventDescription });
    }
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
