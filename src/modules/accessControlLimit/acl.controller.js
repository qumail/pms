import { CREATE_ACL } from "../../configs/constants.config.js";
import { ACL } from "../../database/accessControlLimit/acl.model.js";
import { checkPermissions } from "../authentication/authentication.helper.js";


export const createACL = async (req, res, next) => {
    try {
        const { body: { role, resources } } = req;

        const hasPermission = await checkPermissions(req.user.role, CREATE_ACL, 'write');
        if (!hasPermission) {
            return res.send({ code: "401", message: 'Access denied: insufficient permissions' });
        }

        if(!role || !resources) {
            return res.send({
                code: '201',
                success: true,
                message: 'Role and Resources are required'
            })
        }
        await ACL.create({ role, resources, createdBy: req?.user?.id });
        return res.send({
            code: '200',
            success: true,
            message: `ACL has been created for ${role}`
        })
        
    } catch (error) {
        return next(error)
    }
};

export const updateACL = async (req, res, next) => {
    try {
        const { body: { resources }, params: { role }} = req;

        if(!resources || !role) return res.send({ code: '201', message: 'Missing Parameters'});
        const aclUpdated = await ACL.findOneAndUpdate({ role }, { $addToSet: { resources: { $each: resources } } },  { new: true });
        return res.send({
            code: '200',
            success: true,
            message: `Resources has added to ${aclUpdated.resources}`
        })
        
    } catch (error) {
        return next(error)
    }
}