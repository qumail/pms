import { CREATE_ACL, DELETE_USER, GET_USER_PROFILE, GET_USER_PROFILE_BY_ID, UPDATE_USER_PROFILE } from "../../configs/constants.config.js";
import { ACL } from "../../database/accessControlLimit/acl.model.js";
import { UserModel } from "../../database/user/user.model.js";
import { checkPermissions } from "../authentication/authentication.helper.js";
import { PatientModel } from "../../database/patientRecord/patient.model.js";


export const getUserProfile = async (req, res, next) => {
    try {
        const hasPermission = await checkPermissions(req.user.role,GET_USER_PROFILE, 'read');
        if (!hasPermission) {
            return res.send({ code: "401", message: 'Access denied: insufficient permissions' });
        }
        const userProfile = await UserModel.findOne({ _id: req.user.id}).lean();
        if(!userProfile) {
            return res.send({
                code: '202',
                success: true,
                message: 'User profile not found',
                data: {}
            });
        }
        return res.send({
            code: '200',
            success: true,
            message: 'User Profile Fetched',
            data: userProfile
        });
        
    } catch (error) {
        return next(error)
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const { body, query: { id } } = req;
        
        if(Object.keys(body).length === 0) {
            return res.send({
                code: '201',
                success: true,
                message: 'Payload is required'
            })
        }
        const hasPermission = await checkPermissions(req.user.role, UPDATE_USER_PROFILE, 'write');
        if (!hasPermission) {
            return res.send({ code: "401", message: 'Access denied: insufficient permissions' });
        }
        await UserModel.updateOne({ _id: id }, body);
        return res.send({
            code: '200',
            success: true,
            message: 'Profile has been updated'
        })
        
    } catch (error) {
        return next(error);   
    }
};

export const getUserProfileById = async (req, res, next) => {
    try {
        const {
            params: { userId },
        } = req;
        const hasPermission = await checkPermissions(req.user.role, GET_USER_PROFILE_BY_ID,'read');
        if (!hasPermission) {
            return res.send({ code: "401", message: 'Access denied: insufficient permissions' });
        }
        
        if(req.user.role === 'doctor') {
            const mappedWithPatient = await PatientModel.findOne({ patient: userId, doctor: req.user.id }).select('_id').lean();
            if(!mappedWithPatient) {
                return res.send({ code: "201", message: 'Patient is not mapped with you' });
            }
        }
        const userProfile = await UserModel.findOne({ _id: userId }).lean();
        if(!userProfile) {
            return res.send({
                code: '202',
                success: true,
                message: 'User profile not found',
                data: {}
            });
        }
        return res.send({
            code: '200',
            success: true,
            message: 'User Profile Fetched',
            data: userProfile
        });
        
    } catch (error) {
        return next(error)
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const {
            params: { userId },
        } = req;
        const hasPermission = await checkPermissions(req.user.role, DELETE_USER, 'delete');
        if (!hasPermission) {
            return res.send({ code: "401", message: 'Access denied: insufficient permissions' });
        }
        const userProfile = await UserModel.findOneAndDelete({ _id: userId });
        if(!userProfile) {
            return res.send({
                code: '202',
                success: true,
                message: 'User profile not found',
                data: {}
            });
        }
        return res.send({
            code: '200',
            success: true,
            message: 'Patient Record Deleted',
            data: userProfile
        });
        
    } catch (error) {
        return next(error)
    }
};

export const createACL = async (req, res, next) => {
    try {
        const { body: { role, resources, permissions } } = req;

        const hasPermission = await checkPermissions(req.user.role, CREATE_ACL, 'delete');
        if (!hasPermission) {
            return res.send({ code: "401", message: 'Access denied: insufficient permissions' });
        }

        if(!role || !resources || !permissions) {
            return res.send({
                code: '201',
                success: true,
                message: 'Role, Resources and Permissions are required'
            })
        }
        await ACL.create({ role, resources, permissions });
        return res.send({
            code: '200',
            success: true,
            message: `ACL has been created for ${role}`
        })
        
    } catch (error) {
        return next(error)
    }
}
