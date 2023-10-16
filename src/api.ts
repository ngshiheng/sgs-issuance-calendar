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
        return UrlFetchApp.fetch(fullUrl, options);
    }

    getSGSBondsIssuanceCalendar(startDate: string, endDate: string, maxRows: number): any {
        const endpoint = `${this.baseUrl}/bondsandbills/m/issuancecalendar`;
        const params = {
            rows: maxRows,
            filters: `issue_type:("B" OR "I" OR "G") AND ann_date:[${startDate} TO ${endDate}]`,
            sort: "ann_date asc",
        };

        const response = this.fetch(endpoint, params);
        const responseBody = response.getContentText();

        try {
            return JSON.parse(responseBody);
        } catch (error) {
            throw new Error("Error parsing response: " + error);
        }
    }
}
