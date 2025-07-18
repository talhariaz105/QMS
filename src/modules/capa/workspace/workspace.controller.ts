
import { workspaceService } from "./index";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppiError from "../../errors/ApiError"


export const createCapaworkspaceController = catchAsync(async (req: Request, res: Response) => {
  const workspace = await workspaceService.createCapaworkspace({...req.body, user: req.user});
   
  return res.status(httpStatus.CREATED).send({
    success: true,
    data: workspace,
  });
});


export const getAllCapaworkspacesController = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 ,search} = req.query;
  const workspaces = await workspaceService.getAllCapaworkspaces({
    moduleId: req.params["moduleId"] as string,
    user: req.user,
    Page: Number(page),
    Limit: Number(limit),
    search: search as string
  });
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspaces,
  });
});

export const getCapaworkspaceByIdController = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const workspace = await workspaceService.getCapaworkspaceById(req.params["workspaceId"] as string);
  if (!workspace) {
    return next(new AppiError("Workspace not found", httpStatus.NOT_FOUND));
  }
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspace,
  });
});


export const updateCapaworkspaceController = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const workspace = await workspaceService.updateCapaworkspace(req.params["workspaceId"] as string, req.body);
  if (!workspace) {
    return next(new AppiError("Workspace not found", httpStatus.NOT_FOUND));
  }
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspace,
  });
});

export const deleteCapaworkspaceController = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const workspace = await workspaceService.deleteCapaworkspace(req.params["workspaceId"] as string);
  if (!workspace) {
    return next(new AppiError("Workspace not found", httpStatus.NOT_FOUND));
  }
  
  return res.status(httpStatus.OK).send({
    success: true,
    message: "Workspace deleted successfully",
  });
});