export class MASApiService {
    readonly baseUrl: string = "https://eservices.mas.gov.sg/statistics/api/v1";

    private fetch(url: string, params: Record<string, string | number>): GoogleAppsScript.URL_Fetch.HTTPResponse {
        const paramString = Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join("&");

        const fullUrl = encodeURI(`${url}?${paramString}`);

        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: "get",
            muteHttpExceptions: true, // Do not throw exceptions for non-200 response codes
        };

        Logger.log(`Fetching: ${fullUrl}`);

        const response = UrlFetchApp.fetch(fullUrl, options);
        const responseBody = response.getContentText();
        return JSON.parse(responseBody);
    }

    getSGSBondsIssuanceCalendar(startDate: string, endDate: string, rows: number = 200, sort = "ann_date asc"): any {
        const endpoint = `${this.baseUrl}/bondsandbills/m/issuancecalendar`;
        const params = {
            rows: 200,
            filters: `issue_type:("B" OR "I" OR "G") AND ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }

    getTBillsIssuanceCalendar(
        startDate: string,
        endDate: string,
        auction_tenor: number,
        rows: number = 200,
        sort = "ann_date asc",
    ): any {
        const endpoint = `${this.baseUrl}/bondsandbills/m/issuancecalendar`;
        const params = {
            rows,
            filters: `issue_type:"T" AND auction_tenor:"${auction_tenor}" AND ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }

    getCMTBsIssuanceCalendar(
        startDate: string,
        endDate: string,
        rows: number = 200,
        sort = "ann_date asc AND auction_tenor asc AND maturity_date asc",
    ): any {
        const endpoint = `${this.baseUrl}/bondsandbills/m/cmtbissuancecalendar`;
        const params = {
            rows,
            filters: `ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }
}
