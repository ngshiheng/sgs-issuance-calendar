import { createMonthlyTrigger, getOrCreateCalendar, updateOrCreateAllDayEvent } from "../src/index";

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

describe("createMonthlyTrigger", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return an existing trigger if one exists", () => {
        mockScriptApp.getProjectTriggers.mockReturnValue([
            {
                getHandlerFunction: jest.fn().mockReturnValue("main"),
            },
        ]);

        createMonthlyTrigger();
        expect(mockScriptApp.newTrigger).not.toHaveBeenCalled();
    });

    it("should create a new trigger if none exists", () => {
        mockScriptApp.getProjectTriggers.mockReturnValue([]);

        createMonthlyTrigger();
        expect(mockScriptApp.newTrigger).toHaveBeenCalled();
    });
});

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
        expect(mockLogger.log).toHaveBeenCalledWith(`Event "${title}" already exist`);
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
