import { managementHandlers } from "./handlers/management";
import { resumeHandlers } from "./handlers/resume";
import { sessionHandlers } from "./handlers/session";

export const interviewRouter = {
  ...resumeHandlers,
  ...sessionHandlers,
  ...managementHandlers,
};
