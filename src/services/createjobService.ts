import apiService from "./apiService";
import type {
  CreateJobRequest,
  CreateJobResponse,
  GetJobDetailResponse,
  UtilityOptionTypeResponse,
  SkillSearchResultItem,
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

// get {{employer-bff}}/utility/option-type     work option & work type master data
export const apiGetUtilityOptionType = () => {
  return apiService.fetchData<UtilityOptionTypeResponse>({
    url: `/utility/option-type`,
    method: "get",
  });
};

// get {{employer-bff}}/utility/skills/search/:searchName     search skills
export const apiSearchSkills = (searchName: string) => {
  return apiService.fetchData<SkillSearchResultItem[]>({
    url: `/utility/skills/search/${encodeURIComponent(searchName)}`,
    method: "get",
  });
};
