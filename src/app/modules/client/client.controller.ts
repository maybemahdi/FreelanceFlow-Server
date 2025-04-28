import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { clientFilterableFields } from "./client.constant";
import { ClientService } from "./client.service";
import httpStatus from "http-status";

const createClient = catchAsync(async (req, res) => {
  const result = await ClientService.createClient(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Client created successfully",
    data: result,
  });
});

const updateClient = catchAsync(async (req, res) => {
  const result = await ClientService.updateClient(
    req.params.id,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client updated successfully",
    data: result,
  });
});

const getMyClients = catchAsync(async (req, res) => {
  const filters = pick(req.query, clientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await ClientService.getMyClients(req.user, filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Clients fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleClientForFreelancer = catchAsync(async (req, res) => {
  const result = await ClientService.getSingleClientForFreelancer(
    req.params.id,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client fetched successfully",
    data: result,
  });
});

const deleteClientForFreelancer = catchAsync(async (req, res) => {
  const result = await ClientService.deleteClientForFreelancer(
    req.params.id,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Client deleted successfully",
    data: result,
  });
});

export const ClientController = {
  createClient,
  updateClient,
  getMyClients,
  getSingleClientForFreelancer,
  deleteClientForFreelancer,
};
