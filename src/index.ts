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
        const issueDate = new Date(record.issue_date);

        const eventTitle = `T-bill Issuance - ${issueCode}`;
        const eventDescription =
            `Announcement Date: ${record.ann_date}\n` +
            `Auction Date: ${record.auction_date}\n` +
            `Issue Date: ${record.issue_date}\n` +
            `Maturity Date: ${record.maturity_date}\n` +
            `Issue Code: ${record.issue_code}\n` +
            `ISIN Code: ${record.isin_code}`;

        const existingEvents = calendar.getEventsForDay(issueDate);
        const eventExists = existingEvents.some((event) => event.getTitle() === eventTitle);

        if (eventExists) {
            Logger.log(`Event "${eventTitle}" already exist`);
            continue;
        }

        Logger.log(`Creating "${eventTitle}"`);
        calendar.createAllDayEvent(eventTitle, issueDate, { description: eventDescription });
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
