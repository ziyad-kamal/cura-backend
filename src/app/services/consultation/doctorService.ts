import User from "../../models/User.js";
import { UserRoles } from "../../../enums/UserRoles.js";

export const findAllDoctors = async () => {

    return await User.find({ role: UserRoles.DOCTOR });
};

export const findDoctorById = async (id: string) => {
    const doctor = await User.findOne({ _id: id, role: UserRoles.DOCTOR });
    return doctor;
};

export const registerAsDoctor = async (userId: string, data: any) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            role: UserRoles.DOCTOR,
            doctorInfo: {
                shortConsultPrice: data.shortConsultPrice,
                normalConsultPrice: data.normalConsultPrice,
                LongConsultPrice: data.LongConsultPrice,
                isCertified: false,
                frontIdImage: data.frontIdImage,
                backIdImage: data.backIdImage,
                certImage: data.certImage,
            },
            "userInfo.bio": data.bio,
            "userInfo.job": "Doctor"
        },
        { new: true, runValidators: true }
    );
};

export const updateDoctorData = async (userId: string, data: any) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                "doctorInfo.shortConsultPrice": data.shortConsultPrice,
                "doctorInfo.normalConsultPrice": data.normalConsultPrice,
                "doctorInfo.LongConsultPrice": data.LongConsultPrice,
                "userInfo.bio": data.bio
            }
        },
        { new: true, runValidators: true }
    );
};

export const removeDoctorRole = async (userId: string) => {
    // العودة لدور المستخدم العادي وإزالة بيانات الطبيب
    return await User.findByIdAndUpdate(userId, { 
        $set: { role: UserRoles.USER }, 
        $unset: { doctorInfo: 1 },
        "userInfo.job": "Unemployed" 
    });
};