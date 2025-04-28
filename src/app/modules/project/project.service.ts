import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { ICreateProject, IProjectFilterRequest } from "./project.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Prisma, ProjectStatus } from "@prisma/client";
import isUserExistsById from "../../utils/isUserExistById";
import { dateHelpers } from "../../../helpers/dateHelpers";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { projectSearchAbleFields } from "./project.constant";

const createProject = async (
  payload: ICreateProject,
  decodedUser: JwtPayload,
) => {
  const isClientExistsForTheFreelancer = await prisma.client.findUnique({
    where: {
      id: payload.clientId,
      ownerId: decodedUser.id,
    },
  });
  if (!isClientExistsForTheFreelancer) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }
  const result = await prisma.project.create({
    data: {
      ...payload,
      deadline: dateHelpers.convertToISO(payload.deadline),
      ownerId: decodedUser.id,
    },
  });
  return result;
};

const updateProject = async (
  id: string,
  payload: Partial<ICreateProject>,
  decodedUser: JwtPayload,
) => {
  const isProjectExistsForTheFreelancer = await prisma.project.findUnique({
    where: {
      id: id,
      ownerId: decodedUser.id,
    },
  });
  if (!isProjectExistsForTheFreelancer) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (payload.deadline) {
    payload.deadline = dateHelpers.convertToISO(payload.deadline);
  }

  if (payload.clientId) {
    const isClientExistsForTheFreelancer = await prisma.client.findUnique({
      where: {
        id: payload.clientId,
        ownerId: decodedUser.id,
      },
    });
    if (!isClientExistsForTheFreelancer) {
      throw new AppError(httpStatus.NOT_FOUND, "Client not found");
    }
  }

  const result = await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

const updateProjectStatus = async (
  id: string,
  payload: { status: ProjectStatus },
  decodedUser: JwtPayload,
) => {
  const isProjectExistsForTheFreelancer = await prisma.project.findUnique({
    where: {
      id: id,
      ownerId: decodedUser.id,
    },
  });
  if (!isProjectExistsForTheFreelancer) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (!Object.values(ProjectStatus).includes(payload.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid project status");
  }

  const result = await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const deleteProject = async (id: string, decodedUser: JwtPayload) => {
  const isProjectExistsForTheFreelancer = await prisma.project.findUnique({
    where: {
      id: id,
      ownerId: decodedUser.id,
    },
  });
  if (!isProjectExistsForTheFreelancer) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const result = await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const getAllProjectByClient = async (
  clientId: string,
  decodedUser: JwtPayload,
) => {
  const isClientExistsForTheFreelancer = await prisma.client.findUnique({
    where: {
      id: clientId,
      ownerId: decodedUser.id,
    },
  });
  if (!isClientExistsForTheFreelancer) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const projects = await prisma.project.findMany({
    where: {
      clientId: clientId,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
  });

  return projects;
};

const getAllProjectByFreelancer = async (
  decodedUser: JwtPayload,
  params: IProjectFilterRequest,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ProjectWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: projectSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    ownerId: decodedUser.id,
    isDeleted: false,
  });

  const whereConditions: Prisma.ProjectWhereInput = { AND: andConditions };

  const isFreelancerExists = await isUserExistsById(decodedUser.id);
  if (!isFreelancerExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Freelancer who requested not found",
    );
  }
  const projects = await prisma.project.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.project.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: projects,
  };
};

const getSingleProjectByFreelancer = async (
  id: string,
  decodedUser: JwtPayload,
) => {
  const isProjectExistsForTheFreelancer = await prisma.project.findUnique({
    where: {
      id: id,
      ownerId: decodedUser.id,
    },
  });
  if (!isProjectExistsForTheFreelancer) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  return isProjectExistsForTheFreelancer;
};

export const ProjectService = {
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getAllProjectByClient,
  getAllProjectByFreelancer,
  getSingleProjectByFreelancer,
};
