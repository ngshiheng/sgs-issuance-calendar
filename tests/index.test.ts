import { createMonthlyTrigger, getOrCreateCalendar } from "../src/index";

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
};

// Mock the GoogleAppsScript.Calendar.Calendar object
const mockCalendar = {
    isOwnedByMe: true,
    setDescription: jest.fn(),
    setSelected: jest.fn(),
    setTimeZone: jest.fn(),
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
