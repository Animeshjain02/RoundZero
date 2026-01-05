import { managementContract } from "./management";
import { resumeContract } from "./resume";
import { sessionContract } from "./session";

export const contract = {
  ...resumeContract,
  ...sessionContract,
  ...managementContract,
};
