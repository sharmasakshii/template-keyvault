export interface DecarbInterface {
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    decarbLaneList: DecarbLane[] | null;
    decarbLaneListLoading: boolean;
    decarbProblemLanesData: SummaryResponse | null;
    decarbProblemLanesLoading: boolean;
    message: any;
    optimusLanesData: any;
    optimusLanesLoading: boolean;
    optimusCordinatesData:any;
    optimusCordinatesLoading:boolean
}
export interface DecarbLane {
    name: string;
    region_id: number;
    division_id: number;
    intensity: number;
    type: string;
    priority: number;
    color: string;
    lane_count: number;
    carrier_count: number;
    problem_lanes: number;
}

export interface DecarbSummary {
    name: string;
    intensity: number;
    emission: number;
    type: string;
    priority: number;
    color: string;
}

export interface Pagination {
    page: number;
    page_size: number;
    total_count: number;
}

export interface SummaryResponse {
    data: {
        getDecarbSummary: DecarbSummary[];
        pagination: Pagination;
    },
    message: string,
    status : boolean;
}
