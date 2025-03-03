import { roleTypes } from "../../utils/common/common.enum.js";

export const endPoint = {
    updateProfile: [roleTypes.user],
    profile:[roleTypes.user],
    dashboard:[roleTypes.admin]
}