import { MASApiService } from "../src/api";

describe("MASApiService", () => {
    it("should build a valid URL for SGS Bonds Issuance Calendar", () => {
        const masApiService = new MASApiService();

        // @ts-ignore
        const received = masApiService.buildUrl("/bondsandbills/m/issuancecalendar", {
            rows: 200,
            filters: `issue_type:("B" OR "I" OR "G") AND ann_date:[2023-01-01 TO 2023-12-31]`,
            sort: "ann_date asc",
        });

        const expected = encodeURI(
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/issuancecalendar?rows=200&filters=issue_type:("B" OR "I" OR "G") AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc',
        );

        expect(received).toBe(expected);
    });

    it("should build a valid URL for 6-Month T-bills Issuance Calendar", () => {
        const masApiService = new MASApiService();

        // @ts-ignore
        const received = masApiService.buildUrl("/bondsandbills/m/issuancecalendar", {
            rows: 200,
            filters: `issue_type:"T" AND auction_tenor:"0.5" AND ann_date:[2023-01-01 TO 2023-12-31]`,
            sort: "ann_date asc",
        });

        const expected = encodeURI(
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/issuancecalendar?rows=200&filters=issue_type:"T" AND auction_tenor:"0.5" AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc',
        );

        expect(received).toBe(expected);
    });

    it("should build a valid URL for 1-Year T-bills Issuance Calendar", () => {
        const masApiService = new MASApiService();

        // @ts-ignore
        const received = masApiService.buildUrl("/bondsandbills/m/issuancecalendar", {
            rows: 200,
            filters: `issue_type:"T" AND auction_tenor:"1" AND ann_date:[2023-01-01 TO 2023-12-31]`,
            sort: "ann_date asc",
        });

        const expected = encodeURI(
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/issuancecalendar?rows=200&filters=issue_type:"T" AND auction_tenor:"1" AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc',
        );

        expect(received).toBe(expected);
    });
});
