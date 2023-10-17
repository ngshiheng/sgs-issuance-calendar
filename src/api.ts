export class MASApiService {
    readonly baseUrl: string = "https://eservices.mas.gov.sg/statistics/api/v1";

    private fetch(endpoint: string, params: Record<string, string | number>): any {
        const url = this.buildUrl(endpoint, params);
        Logger.log(`Fetching from ${url}`);

        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: "get",
            muteHttpExceptions: true, // Do not throw exceptions for non-200 response codes
        };

        const response = UrlFetchApp.fetch(url, options);
        return this.parseResponse(response);
    }

    private buildUrl(endpoint: string, params: Record<string, string | number>): string {
        const paramString = Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join("&");

        return encodeURI(`${this.baseUrl}/${endpoint}?${paramString}`);
    }

    private parseResponse(response: GoogleAppsScript.URL_Fetch.HTTPResponse): any {
        const responseBody = response.getContentText();
        return JSON.parse(responseBody);
    }

    getSGSBondsIssuanceCalendar(startDate: string, endDate: string, rows: number = 200, sort = "ann_date asc"): any {
        const endpoint = "/bondsandbills/m/issuancecalendar";
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
        const endpoint = "/bondsandbills/m/issuancecalendar";
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
        const endpoint = "/bondsandbills/m/cmtbissuancecalendar";
        const params = {
            rows,
            filters: `ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }
}
