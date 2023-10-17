import {
  changePasswordSchema,
  emailSchema,
  enable2faSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verify2FSchema,
} from "./validation";
import { Request, Response } from "express";
import { errorResponse } from "../../utils";
import {
  changeEmailLinkService,
  changeEmailService,
  changePasswordService,
  checkEmailService,
  enable2faService,
  forgotPasswordService,
  loginUserService,
  resendVerificationService,
  restPasswordService,
  revalidateLoginService,
  send2faCodeService,
  signUpService,
  verify2faCodeService,
  verifyUserservice,
} from "../../services/UserService/index";

/**
 * @param req
 * @param res
 * @returns
 */
export const signUp = async (req: Request, res: Response) => {
  const result = registerSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  const user = await signUpService(req.body, res);
  if (!user) {
    return errorResponse("An error occurred", 500, res);
  }
};

/**
 * @param req
 * @param res
 */
export const loginUser = async (req: Request, res: Response) => {
  const result = loginSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  const { email, password } = req.body;

  const user = await loginUserService(email, password, res);

  if (!user) {
    return errorResponse("An error occurred", 500, res);
  }
};
/**
 * @param req
 * @param res
 * @returns
 */
export const verifyUser = async (req: Request, res: Response) => {
  const { token } = req.params;
  return await verifyUserservice(res, token);
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await resendVerificationService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }
  return await checkEmailService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const changeEmailLink = async (req: Request, res: Response) => {
  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  const { email } = req.body;
  return await changeEmailLinkService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const changeEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return errorResponse("Provide token", 401, res);
  }

  return await changeEmailService(token, res);
};

/**
 * @param req
 * @param res
 * @returns
 */
export const changePassword = async (req: Request, res: Response) => {
  const result = changePasswordSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  return await changePasswordService(req.body, res, req.user);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = emailSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  return await forgotPasswordService(email, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const restPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const result = resetPasswordSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  return await restPasswordService(token, newPassword, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const revalidateLogin = async (req: Request, res: Response) => {
  const { token } = req.params;

  return await revalidateLoginService(token, res);
};
/**
 * @param req
 * @param res
 * @returns
 */
export const enable2fa = async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = enable2faSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  return await enable2faService(email, res);
};
/**
 *
 * @param req
 * @param res
 * @returns
 */
export const send2faCode = async (req: Request, res: Response) => {
  return await send2faCodeService(req.user, res);
};

export const verify2faCode = async (req: Request, res: Response) => {
  const result = verify2FSchema.validate(req.body);

  if (result.error) {
    return errorResponse(result.error.details, 400, res);
  }

  const { code } = req.body;

  return await verify2faCodeService(code, res);
};
