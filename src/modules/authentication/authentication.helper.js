import jwt from "jsonwebtoken";
import { ACL } from "../../database/accessControlLimit/acl.model.js";

export const generateToken = async (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const checkPermissions = async (role, resource, permission) => {
  const aclEntry = await ACL.findOne({
    role,
    "resources.name": resource,
    "resources.permission": permission,
  });

  if (aclEntry) {
    return true;
  }

  return false;
};

