import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { interactionFilterableFields } from "./interaction.constant";
import { InteractionService } from "./interaction.service";
import httpStatus from "http-status";

const createInteraction = catchAsync(async (req, res) => {
  const result = await InteractionService.createInteraction(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Interaction created successfully",
    data: result,
  });
});

const updateInteraction = catchAsync(async (req, res) => {
  const result = await InteractionService.updateInteraction(
    req.params.id,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Interaction updated successfully",
    data: result,
  });
});

const deleteInteraction = catchAsync(async (req, res) => {
  const result = await InteractionService.deleteInteraction(
    req.params.id,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Interaction deleted successfully",
    data: result,
  });
});

const getProjectInteractions = catchAsync(async (req, res) => {
  const result = await InteractionService.getProjectInteractions(
    req.params.projectId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project interactions retrieved successfully",
    data: result,
  });
});

const getClientInteractions = catchAsync(async (req, res) => {
  const result = await InteractionService.getClientInteractions(
    req.params.clientId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client interactions retrieved successfully",
    data: result,
  });
});

const getAllInteraction = catchAsync(async (req, res) => {
  const filters = pick(req.query, interactionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await InteractionService.getAllInteraction(
    req.user,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Interactions retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleInteraction = catchAsync(async (req, res) => {
  const result = await InteractionService.getSingleInteraction(
    req.params.id,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Interaction retrieved successfully",
    data: result,
  });
});

export const InteractionController = {
  createInteraction,
  updateInteraction,
  deleteInteraction,
  getProjectInteractions,
  getClientInteractions,
  getAllInteraction,
  getSingleInteraction,
};
