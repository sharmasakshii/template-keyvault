export interface CommonState {
    isSuccess: boolean;
    isLoading: boolean;
    isLoadingProjectCount: boolean;
    message: string | null;
    isLoadingFilterDates: boolean;
    emissionDates: any;
    regions: any;
    isError: boolean;
    error: any;
    projectCountData: { data: ProjectCountDataInterface } | null;
    emissionIntensityDetails: any;
    emissionIntensityDetailsIsLoading: boolean;
    urlKey: any;
    cmsContent: any;
    isLoadingCmsContent: boolean;
    pageTitle: any;
    notificationDetail: any,
    isLoadingNotification: boolean,
    isSidebarOpen: boolean,
    timePeriodList: any,
    isLoadingDivisions: boolean;
    divisions: any
    questionsDto: any
    isLoadingQuestions: boolean,
    timePeriodLoading: boolean,
    questionListDto: any
}
export interface ProjectCountDataInterface {
    Inactive: number,
    active: number,
    Total: number
}