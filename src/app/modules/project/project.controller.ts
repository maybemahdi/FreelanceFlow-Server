import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { projectFilterableFields } from "./project.constant";
import { ProjectService } from "./project.service";
import httpStatus from "http-status";

const createProject = catchAsync(async (req, res) => {
  const result = await ProjectService.createProject(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const result = await ProjectService.updateProject(
    req.params.id,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const updateProjectStatus = catchAsync(async (req, res) => {
  const result = await ProjectService.updateProjectStatus(
    req.params.id,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project status updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const result = await ProjectService.deleteProject(req.params.id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully",
    data: result,
  });
});

const getAllProjectByClient = catchAsync(async (req, res) => {
  const result = await ProjectService.getAllProjectByClient(
    req.params.id,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

const getAllProjectByFreelancer = catchAsync(async (req, res) => {
  const filters = pick(req.query, projectFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ProjectService.getAllProjectByFreelancer(
    req.user,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProjectByFreelancer = catchAsync(async (req, res) => {
  const result = await ProjectService.getSingleProjectByFreelancer(
    req.params.id,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getAllProjectByClient,
  getAllProjectByFreelancer,
  getSingleProjectByFreelancer,
};
