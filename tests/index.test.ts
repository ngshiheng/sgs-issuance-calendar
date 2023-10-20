import { createMonthlyTrigger } from "../src/index";

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

// Mock the global objects
(global as any)["ScriptApp"] = mockScriptApp;
(global as any)["Logger"] = mockLogger;

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
