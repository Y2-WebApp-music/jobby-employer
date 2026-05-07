import apiService from "./apiService";
import type { CreateJobRequest, CreateJobResponse, GetJobDetailResponse } from "@/types/createJobTypes";

export type {
  AddressRequest,
  SkillRequest,
  AdditionQuestionOptionRequest,
  AdditionQuestionRequest,
  AdditionFileRequest,
  CreateJobRequest,
  CreateJobResponse,
  MasterTextRef,
  JobCategoryItem,
  JobSkillItem,
  JobWorkOptionItem,
  JobWorkTypeItem,
  GetJobDetailResponse,
} from "@/types/createJobTypes";

// post {{employer-bff}}/job     create job
export const apiCreateJob = (data: CreateJobRequest) => {
  return apiService.fetchData<CreateJobResponse>({
    url: `/job`,
    method: "post",
    data,
  });
};

// get {{employer-bff}}/job/:job_id     get job detail
export const apiGetJobById = (jobId: string) => {
  return apiService.fetchData<GetJobDetailResponse>({
    url: `/job/${jobId}`,
    method: "get",
  });
};

// patch {{employer-bff}}/job/:job_id     update job
export const apiPatchJobById = (jobId: string, data: CreateJobRequest) => {
  return apiService.fetchData<CreateJobResponse>({
    url: `/job/${jobId}`,
    method: "patch",
    data,
  });
};
