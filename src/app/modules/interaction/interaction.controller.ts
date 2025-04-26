import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
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
  getSingleInteraction,
};
