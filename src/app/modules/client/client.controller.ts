import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ClientService } from "./client.service";
import httpStatus from "http-status";

const createClient = catchAsync(async (req, res) => {
  const result = await ClientService.createClient(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Client created successfully",
    data: result,
  });
});

export const ClientController = {
  createClient,
};
