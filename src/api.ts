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
        const responseBody = response.getContentText();
        return JSON.parse(responseBody);
    }

    private buildUrl(endpoint: string, params: Record<string, string | number>): string {
        const paramString = Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join("&");

        return encodeURI(`${this.baseUrl}${endpoint}?${paramString}`);
    }

    getSGSBondsIssuanceCalendar(startDate: string, endDate: string, rows: number = 200, sort = "ann_date asc"): any {
        const endpoint = "/bondsandbills/m/issuancecalendar";
        const params = {
            rows,
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

    getSavingsBondIssuanceCalendar(startDate: string, endDate: string, rows: number = 200, sort = "ann_date asc"): any {
        const endpoint = "/bondsandbills/m/savingbondsissuancecalendar";
        const params = {
            rows,
            filters: `issue_type:"S" AND ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }

    // TODO: Add get methods for MAS Bills and MAS FRN
}
