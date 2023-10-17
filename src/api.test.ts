import { MASApiService } from "./api";

describe("MASApiService", () => {
    it("should build a valid URL for SGS Bonds Issuance Calendar", () => {
        const masApiService = new MASApiService();

        // @ts-ignore
        const result = masApiService.buildUrl("/bondsandbills/m/issuancecalendar", {
            rows: 200,
            filters: `issue_type:("B" OR "I" OR "G") AND ann_date:[2023-01-01 TO 2023-12-31]`,
            sort: "ann_date asc",
        });

        const expectedUrl = encodeURI(
            'https://eservices.mas.gov.sg/statistics/api/v1/bondsandbills/m/issuancecalendar?rows=200&filters=issue_type:("B" OR "I" OR "G") AND ann_date:[2023-01-01 TO 2023-12-31]&sort=ann_date asc',
        );

        expect(result).toBe(expectedUrl);
    });
});
