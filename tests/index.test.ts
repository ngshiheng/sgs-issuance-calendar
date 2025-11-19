import { BondRecord } from "../src/api";
import { createEventDescription, getOrCreateCalendar, updateOrCreateAllDayEvent } from "../src/index";

// Create a mock for ScriptApp
const mockScriptApp = {
    getProjectTriggers: jest.fn(),
    newTrigger: jest.fn().mockReturnThis(),
    timeBased: jest.fn().mockReturnThis(),
    onMonthDay: jest.fn().mockReturnThis(),
    atHour: jest.fn().mockReturnThis(),
    create: jest.fn(),
    deleteTrigger: jest.fn(),
};

// Mock the Logger
const mockLogger = {
    log: jest.fn(),
};

// Mock the CalendarApp module
const mockCalendarApp = {
    getCalendarsByName: jest.fn(),
    createCalendar: jest.fn(),
    setSelected: jest.fn(),
    setDescription: jest.fn(),
    setTimeZone: jest.fn(),
    getName: jest.fn(),
    Visibility: jest.fn(),
};

// Mock the GoogleAppsScript.Calendar.Calendar object
const mockCalendar = {
    isOwnedByMe: true,
    setDescription: jest.fn(),
    setSelected: jest.fn(),
    setTimeZone: jest.fn(),
    createAllDayEvent: jest.fn(() => mockEvent),
};

// Mock the GoogleAppsScript.Calendar.CalendarEvent object
const mockEvent = {
    getTitle: jest.fn(),
    setDescription: jest.fn(),
    setVisibility: jest.fn(),
    setAllDayDate: jest.fn(),
    setGuestsCanModify: jest.fn(),
    setGuestsCanSeeGuests: jest.fn(),
    setGuestsCanInviteOthers: jest.fn(),
};

// Mock the global objects
(global as any)["Logger"] = mockLogger;
(global as any)["ScriptApp"] = mockScriptApp;
(global as any)["CalendarApp"] = mockCalendarApp;
(global as any)["GoogleAppsScript"] = {
    Calendar: {
        Calendar: jest.fn(() => mockCalendar),
    },
};

describe("getOrCreateCalendar", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return an existing calendar if one exists", () => {
        mockCalendarApp.getCalendarsByName.mockReturnValue([mockCalendar]);
        mockCalendar.isOwnedByMe = true;

        const calendarName = "ExistingCalendar";
        const result = getOrCreateCalendar(calendarName);

        expect(result).toBe(mockCalendar);
        expect(mockCalendarApp.createCalendar).not.toHaveBeenCalled();
        expect(mockLogger.log).toHaveBeenCalledWith(`Calendar "${calendarName}" already exist`);
    });

    it("should create a new calendar if none exists", () => {
        mockCalendarApp.getCalendarsByName.mockReturnValue([]);
        mockCalendarApp.createCalendar.mockReturnValue(mockCalendar);

        const calendarName = "NewCalendar";
        const result = getOrCreateCalendar(calendarName);

        expect(result).toBe(mockCalendar);
        expect(mockCalendarApp.createCalendar).toHaveBeenCalledWith(calendarName);
        expect(mockLogger.log).toHaveBeenCalledWith(`Creating new "${calendarName}" calendar`);
    });
});

describe("updateOrCreateAllDayEvent", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update an existing event if one exists", () => {
        mockEvent.getTitle.mockReturnValue("Existing Event");
        const existingEvents = [mockEvent];

        const title = "Existing Event";
        const description = "Updated Description";
        const date = new Date();

        updateOrCreateAllDayEvent(title, description, date, mockCalendar as any, existingEvents as any);

        expect(mockCalendar.createAllDayEvent).not.toHaveBeenCalled();
        expect(mockEvent.setDescription).toHaveBeenCalledWith(description);
        expect(mockEvent.setAllDayDate).toHaveBeenCalledWith(date);
        expect(mockLogger.log).toHaveBeenCalledWith(`Event "${title}" already exist - updating...`);
    });

    it("should create a new event if none exists", () => {
        const title = "New Event";
        const description = "New Description";
        const date = new Date();

        updateOrCreateAllDayEvent(title, description, date, mockCalendar as any, []);

        expect(mockCalendar.createAllDayEvent).toHaveBeenCalledWith(title, date, { description });
        expect(mockEvent.setDescription).not.toHaveBeenCalled();
        expect(mockLogger.log).toHaveBeenCalledWith(`Creating "${title}"`);
    });
});

describe("createEventDescription", () => {
    it("should create an event description with all provided fields", () => {
        const record = {
            issue_code: "ABC123",
            isin_code: "XYZ987",
            ann_date: "2023-10-20",
            auction_date: "2023-11-05",
            last_day_to_apply: "2023-10-31",
            tender_date: "2023-11-01",
            issue_date: "2023-11-15",
            maturity_date: "2030-11-15",
            sgs_type: "Government Bond",
            auction_tenor: "5",
        };

        const expectedDescription = `<b>Allotment Date</b>: 2023-11-01
<b>Announcement Date</b>: 2023-10-20
<b>Auction Date</b>: 2023-11-05
<b>Closing Date</b>: 2023-10-31
<b>ISIN Code</b>: XYZ987
<b>Issue Code</b>: ABC123
<b>Issue Date</b>: 2023-11-15
<b>Maturity Date</b>: 2030-11-15
<b>SGS Type</b>: Government Bond
<b>Tenor</b>: 5 year

<b>More Details</b>: <a href='https://www.mas.gov.sg/bonds-and-bills/auctions-and-issuance-calendar'>MAS Bonds and Bills Auctions and Issuance Calendar</a>

<i>Feel free to report any issues or contribute to the source code on this <a href='https://github.com/ngshiheng/sgs-issuance-calendar'>GitHub repository</a>.</i>`;

        const description = createEventDescription(record as BondRecord);

        expect(description).toBe(expectedDescription);
    });

    it("should create an event description with missing fields omitted", () => {
        const recordWithMissingFields = {
            issue_code: "ABC123",
            isin_code: "XYZ987",
            ann_date: "2023-10-20",
            auction_tenor: "5",
        } as BondRecord;

        const expectedDescription = `<b>Announcement Date</b>: 2023-10-20
<b>ISIN Code</b>: XYZ987
<b>Issue Code</b>: ABC123
<b>Tenor</b>: 5 year

<b>More Details</b>: <a href='https://www.mas.gov.sg/bonds-and-bills/auctions-and-issuance-calendar'>MAS Bonds and Bills Auctions and Issuance Calendar</a>

<i>Feel free to report any issues or contribute to the source code on this <a href='https://github.com/ngshiheng/sgs-issuance-calendar'>GitHub repository</a>.</i>`;

        const description = createEventDescription(recordWithMissingFields);

        expect(description).toBe(expectedDescription);
    });

    it("should create an event description without null fields", () => {
        const recordWithMissingFields = {
            issue_code: "ABC123",
            isin_code: "XYZ987",
            ann_date: "2023-10-20",
            auction_tenor: "5",
            maturity_date: null,
        } as BondRecord;

        const expectedDescription = `<b>Announcement Date</b>: 2023-10-20
<b>ISIN Code</b>: XYZ987
<b>Issue Code</b>: ABC123
<b>Tenor</b>: 5 year

<b>More Details</b>: <a href='https://www.mas.gov.sg/bonds-and-bills/auctions-and-issuance-calendar'>MAS Bonds and Bills Auctions and Issuance Calendar</a>

<i>Feel free to report any issues or contribute to the source code on this <a href='https://github.com/ngshiheng/sgs-issuance-calendar'>GitHub repository</a>.</i>`;

        const description = createEventDescription(recordWithMissingFields);

        expect(description).toBe(expectedDescription);
    });

    it("should create only a default event description for an empty record", () => {
        const emptyRecord = {} as BondRecord;

        const expectedDescription = `

<b>More Details</b>: <a href='https://www.mas.gov.sg/bonds-and-bills/auctions-and-issuance-calendar'>MAS Bonds and Bills Auctions and Issuance Calendar</a>

<i>Feel free to report any issues or contribute to the source code on this <a href='https://github.com/ngshiheng/sgs-issuance-calendar'>GitHub repository</a>.</i>`;

        const description = createEventDescription(emptyRecord);

        expect(description).toBe(expectedDescription);
    });
});
