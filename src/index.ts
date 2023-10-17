import { MASApiService } from "./api";

export function main() {
    const sdk = new MASApiService();
    const startDate = "2023-01-01";
    const endDate = "2023-12-31";

    const SGSResult = sdk.getSGSBondsIssuanceCalendar(startDate, endDate);
    Logger.log(SGSResult);

    const TBillResult = sdk.getTBillsIssuanceCalendar(startDate, endDate, 0.5);
    Logger.log(TBillResult);
}
