import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { dateHelpers } from "../../../helpers/dateHelpers";
import { ICreateReminder, IUpdateReminder } from "./reminder.interface";

// Create Reminder
const createReminder = async (
  payload: ICreateReminder,
  decodedUser: JwtPayload,
) => {
  // Validate at least one association exists
  if (!payload.clientId && !payload.projectId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Reminder must be associated with a client or project",
    );
  }

  // Validate client ownership if provided
  if (payload.clientId) {
    const isClientValid = await prisma.client.findUnique({
      where: {
        id: payload.clientId,
        ownerId: decodedUser.id,
      },
    });
    if (!isClientValid) {
      throw new AppError(httpStatus.NOT_FOUND, "Client not found");
    }
  }

  // Validate project ownership if provided
  if (payload.projectId) {
    const isProjectValid = await prisma.project.findUnique({
      where: {
        id: payload.projectId,
        ownerId: decodedUser.id,
        clientId: payload.clientId,
      },
    });
    if (!isProjectValid) {
      throw new AppError(httpStatus.NOT_FOUND, "Project not found");
    }

    // Ensure project belongs to client if both are provided
    if (payload.clientId && isProjectValid.clientId !== payload.clientId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Project doesn't belong to the specified client",
      );
    }
  }

  const result = await prisma.reminder.create({
    data: {
      ...payload,
      date: dateHelpers.convertToISO(payload.date),
      ownerId: decodedUser.id,
    },
  });

  return result;
};

// Update Reminder
const updateReminder = async (
  id: string,
  payload: IUpdateReminder,
  decodedUser: JwtPayload,
) => {
  // Check if reminder exists and belongs to user
  const existingReminder = await prisma.reminder.findUnique({
    where: {
      id,
      ownerId: decodedUser.id,
    },
  });
  if (!existingReminder) {
    throw new AppError(httpStatus.NOT_FOUND, "Reminder not found");
  }

  // Validate client if being updated
  if (payload.clientId) {
    const isClientValid = await prisma.client.findUnique({
      where: {
        id: payload.clientId,
        ownerId: decodedUser.id,
      },
    });
    if (!isClientValid) {
      throw new AppError(httpStatus.NOT_FOUND, "Client not found");
    }
  }

  // Validate project if being updated
  if (payload.projectId) {
    const isProjectValid = await prisma.project.findUnique({
      where: {
        id: payload.projectId,
        ownerId: decodedUser.id,
      },
    });
    if (!isProjectValid) {
      throw new AppError(httpStatus.NOT_FOUND, "Project not found");
    }

    // Ensure project belongs to client if both are being updated
    if (payload.clientId && isProjectValid.clientId !== payload.clientId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Project doesn't belong to the specified client",
      );
    }
  }

  const updateData = { ...payload };
  if (payload.date) {
    updateData.date = dateHelpers.convertToISO(payload.date);
  }

  const result = await prisma.reminder.update({
    where: { id },
    data: updateData,
  });

  return result;
};

// Delete Reminder (soft delete)
const deleteReminder = async (id: string, decodedUser: JwtPayload) => {
  const existingReminder = await prisma.reminder.findUnique({
    where: {
      id,
      ownerId: decodedUser.id,
    },
  });
  if (!existingReminder) {
    throw new AppError(httpStatus.NOT_FOUND, "Reminder not found");
  }

  const result = await prisma.reminder.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

// Get upcoming reminders (for dashboard)
const getUpcomingReminders = async (decodedUser: JwtPayload) => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const reminders = await prisma.reminder.findMany({
    where: {
      ownerId: decodedUser.id,
      isDeleted: false,
      date: {
        gte: now,
        lte: nextWeek,
      },
    },
    orderBy: {
      date: "asc",
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return reminders;
};

// Get all reminders for a client
const getClientReminders = async (
  clientId: string,
  decodedUser: JwtPayload,
) => {
  const isClientValid = await prisma.client.findUnique({
    where: {
      id: clientId,
      ownerId: decodedUser.id,
    },
  });
  if (!isClientValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const reminders = await prisma.reminder.findMany({
    where: {
      clientId,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return reminders;
};

// Get all reminders for a project
const getProjectReminders = async (
  projectId: string,
  decodedUser: JwtPayload,
) => {
  const isProjectValid = await prisma.project.findUnique({
    where: {
      id: projectId,
      ownerId: decodedUser.id,
    },
  });
  if (!isProjectValid) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const reminders = await prisma.reminder.findMany({
    where: {
      projectId,
      ownerId: decodedUser.id,
      isDeleted: false,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return reminders;
};

// Get single reminder
const getSingleReminder = async (id: string, decodedUser: JwtPayload) => {
  const reminder = await prisma.reminder.findUnique({
    where: {
      id,
      ownerId: decodedUser.id,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  if (!reminder) {
    throw new AppError(httpStatus.NOT_FOUND, "Reminder not found");
  }

  return reminder;
};

export const ReminderService = {
  createReminder,
  updateReminder,
  deleteReminder,
  getUpcomingReminders,
  getClientReminders,
  getProjectReminders,
  getSingleReminder,
};
