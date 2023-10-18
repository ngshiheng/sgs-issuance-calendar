import { MASApiService } from "../src/api";

// Create a mock for the URLFetchApp object
const mockURLFetchApp = {
    fetch: jest.fn(() => ({
        getContentText: jest.fn(() => JSON.stringify({ mockData: "test" })),
    })),
};

// Create a mock for the Logger object
const mockLogger = {
    log: jest.fn(),
};

// Mock the global objects
(global as any)["UrlFetchApp"] = mockURLFetchApp;
(global as any)["Logger"] = mockLogger;

describe("MASApiService", () => {
    let masApiService: MASApiService;

    beforeEach(() => {
        masApiService = new MASApiService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should construct and encode the correct URL", () => {
        const endpoint = "/bondsandbills/m/issuancecalendar";
        const params = {
            rows: 200,
            filters: 'issue_type:("B" OR "I" OR "G") AND ann_date:[2023-01-01 TO 2023-12-31]',
            sort: "ann_date asc",
        };

        // @ts-ignore
        const url = masApiService.buildUrl(endpoint, params);
        const expectedUrl = encodeURI(
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/issuancecalendar?rows=200&filters=issue_type:("B" OR "I" OR "G") AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc',
        );
        expect(url).toBe(expectedUrl);
    });

    it("should construct the correct SGS Bonds Issuance Calendar endpoint", () => {
        masApiService.getSGSBondsIssuanceCalendar("2023-01-01", "2023-12-31");

        const url =
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/issuancecalendar?rows=200&filters=issue_type:("B" OR "I" OR "G") AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc';
        const expectedUrl = encodeURI(url);

        expect(mockURLFetchApp.fetch).toHaveBeenCalled();
        expect(mockURLFetchApp.fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });

    it("should construct the correct T-Bills Issuance Calendar endpoint", () => {
        masApiService.getTBillsIssuanceCalendar("2023-01-01", "2023-12-31", 0.5);

        const url =
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/issuancecalendar?rows=200&filters=issue_type:"T" AND auction_tenor:"0.5" AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc';
        const expectedUrl = encodeURI(url);

        expect(mockURLFetchApp.fetch).toHaveBeenCalled();
        expect(mockURLFetchApp.fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });

    it("should construct the correct Savings Bond Issuance Calendar endpoint", () => {
        masApiService.getSavingsBondIssuanceCalendar("2023-01-01", "2023-12-31");

        const url =
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/savingbondsissuancecalendar?rows=200&filters=issue_type:"S" AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc';
        const expectedUrl = encodeURI(url);

        expect(mockURLFetchApp.fetch).toHaveBeenCalled();
        expect(mockURLFetchApp.fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });
});
