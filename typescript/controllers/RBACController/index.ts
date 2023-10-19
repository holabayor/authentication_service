import { success } from "../../utils/index";
import roleAndPermissionService from "../../services/RoleService/index";
import { Response, Request } from "express";

/**
 *
 * @param req
 * @param res
 * @param next
 */
export const seedRole = async (
  req: Request,
  res: Response,
) => {
  try {
    await roleAndPermissionService.seedRole();
    success("seed successfully", null, 201, res);
  } catch (error) {
    res.send(error.message);
  }
};

export const seedPermission = async (req: Request, res: Response) => {
  try {
    await roleAndPermissionService.seedPermission();
    success("seed successfully", null, 201, res);
  } catch (error) {
    res.send(error.message);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
export const fetchRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleAndPermissionService.fetchRoles();
    return success("Fetched successfully", roles, 200, res);
  } catch (error) {
    res.send(error.message);
  }
};
/**
 *
 * @param req
 * @param res
 * @param next
 */
export const fetchPermission = async (req: Request, res: Response) => {
  try {
    const permission = await roleAndPermissionService.fetchPermission();
    return success("Fetched successfully", permission, 200, res);
  } catch (error) {
    res.send(error.message);
  }
};
/**
 *
 * @param req
 * @param res
 */
export const seedRolePermissions = async (req: Request, res: Response) => {
  try {
    const permission = await roleAndPermissionService.seedRolePermissions();
    success("seed successfully", permission, 201, res);
  } catch (error) {
    res.send(error.message);
  }
};
/**
 * 
 * @param req 
 * @param res 
 */
export const fetchRolePermissions = async (req: Request, res: Response) => {
  try {
    const permission = await roleAndPermissionService.fetchRolePermissions();
    success("Fetched successfully", permission, 200, res);
  } catch (error) {
    res.send(error.message);
  }
};