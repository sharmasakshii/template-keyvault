// Define the ProjectState interface
export interface ProjectState {
    isError: any; // A variable to hold error information, can be of any type
    isSuccess: boolean; // A boolean flag indicating if the operation was successful
    isLoading: boolean; // A boolean flag indicating if a loading operation is in progress
    message: any, // A string message to describe the state
    projectList: any, // A variable to store a list of projects, can be of any type
    removeProject: any, // A variable to hold information about removed projects, can be of any type
    searchProjectList: any , // A variable to store a list of searched projects, can be of any type or null
    projectDetails: any, // A variable to store details of a specific project, can be of any type
    projectListLoading: boolean,
    isLoadingProjectDetails :boolean
    saveProject: Project[] | null,
    isLoadingSaveProject:boolean
    saveProjectRating:any
    searchedUsers: User[] | null,
    isLoadingEmailSearch: boolean
}

export interface User {
    id: number;
    name: string;
    email: string;
    companies: Company[];
}

export interface Company {
    name: string;
    db_alias: string;
    UserCompany: UserCompany;
}

export interface UserCompany {
    company_id: number;
    user_id: number;
    createdAt: string;
    updatedAt: string;
}


export interface Project {
    id: number;
    project_unique_id: string;
    manager_id: number;
    project_name: string;
    desc: string;
    start_date: string | Date
    status: number; 
    type: string; 
    end_date: string | Date;
    lane_id: number;
    recommendation_id: number;
    updatedAt: string | Date; 
    createdAt: string | Date; 
}