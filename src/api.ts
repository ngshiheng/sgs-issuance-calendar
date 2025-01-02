export interface BondRecord {
    issue_code: string;
    issue_no: string;
    isin_code: string;
    issue_type: string;
    raw_tenor: number;
    auction_tenor: string;
    tenor_unit: string;
    curr: string;
    new_reopen: string;
    ann_date: string;
    auction_date: string;
    last_day_to_apply: string;
    tender_date: string;
    issue_date: string;
    flag: string;
    maturity_date: string;
    is_benchmark: string;
    sgs_type: string;
}

interface MASApiResponse {
    success: boolean;
    result: {
        total: number;
        records: BondRecord[];
    };
}

export class MASApiService {
    readonly baseUrl: string = "https://eservices.mas.gov.sg/statistics/api/v1";

    private fetch(endpoint: string, params: Record<string, string | number>): MASApiResponse {
        const url = this.buildUrl(endpoint, params);
        Logger.log(`Fetching data from "${url}"`);

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

    getSGSBondsIssuanceCalendar(startDate: string, endDate: string, rows: number = 200, sort = "ann_date asc"): MASApiResponse {
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
        auctionTenor: number,
        rows: number = 200,
        sort = "ann_date asc",
    ): MASApiResponse {
        const endpoint = "/bondsandbills/m/issuancecalendar";
        const params = {
            rows,
            filters: `issue_type:"T" AND auction_tenor:"${auctionTenor}" AND ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }

    getSavingsBondIssuanceCalendar(
        startDate: string,
        endDate: string,
        rows: number = 200,
        sort = "ann_date asc",
    ): MASApiResponse {
        const endpoint = "/bondsandbills/m/savingbondsissuancecalendar";
        const params = {
            rows,
            filters: `issue_type:"S" AND ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }

    getCMTBsIssuanceCalendar(): MASApiResponse {
        throw new Error("Method not implemented.");
    }

    getMASBillsIssuanceCalendar(
        startDate: string,
        endDate: string,
        rows: number = 200,
        sort = "ann_date asc AND auction_tenor asc AND maturity_date asc",
    ): MASApiResponse {
        const endpoint = "/bondsandbills/m/mbillissuancecalendar";
        const params = {
            rows,
            filters: `ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }

    getMASFRNIssuanceCalendar(startDate: string, endDate: string, rows: number = 200, sort = "ann_date asc"): MASApiResponse {
        const endpoint = "/bondsandbills/m/mfrnissuecalendar";
        const params = {
            rows,
            filters: `ann_date:[${startDate} TO ${endDate}]`,
            sort,
        };

        return this.fetch(endpoint, params);
    }
}
