export interface FacilityState {
    isError: any;
    isSuccess: boolean;
    isLoading: boolean;
    message: string,
    facilityTableDetails: any,
    facilityGraphDetails: any,
    facilityGraphDetailLoading: boolean,
    facilityTableDetailLoading: boolean,
    facilityReductionGraphDto: any,
    facilityReductionGraphLoading: boolean,
}