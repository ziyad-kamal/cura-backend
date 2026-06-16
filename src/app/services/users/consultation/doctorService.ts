import { UserRoles } from "../../../../enums/UserRoles.js";
import User from "../../../models/User.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";

export const findAllDoctors = async () => {
    const doctors = await User.find({ role: UserRoles.DOCTOR }).lean();
    const doctorsWithFiles = await Promise.all(
        doctors.map(async (doctor) => {
            const resolvedImage = doctor.image ? (await resolveFiles([{ s3Key: doctor.image }], "public"))[0] : null;

            return {
                ...doctor,
                image: resolvedImage,
            };
        }),
    );

    for (const doc of doctorsWithFiles) {
        if (doc.doctorInfo && (!doc.doctorInfo.experienceYears || doc.doctorInfo.experienceYears === 0)) {
            const age = doc.userInfo?.age;
            if (age && age > 25) {
                doc.doctorInfo.experienceYears = age - 25;
            }
        }
    }
    
    return doctorsWithFiles;
};

export const findDoctorById = async (id: string) => {
    const doctor = await User.findOne({ _id: id, role: UserRoles.DOCTOR });
    if (
        doctor &&
        doctor.doctorInfo &&
        (!doctor.doctorInfo.experienceYears || doctor.doctorInfo.experienceYears === 0)
    ) {
        const age = doctor.userInfo?.age;
        if (age && age > 25) {
            doctor.doctorInfo.experienceYears = age - 25;
        }
    }
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
                workingDays: data.workingDays || [],
                workingHoursStart: data.workingHoursStart || "09:00",
                workingHoursEnd: data.workingHoursEnd || "17:00",
                specialization: data.specialization || "",
                experienceYears: data.experienceYears || 0,
                ratingAverage: 0,
                totalReviews: 0,
            },
            "userInfo.bio": data.bio,
            "userInfo.job": "Doctor",
        },
        { new: true, runValidators: true },
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
                "doctorInfo.workingDays": data.workingDays,
                "doctorInfo.workingHoursStart": data.workingHoursStart,
                "doctorInfo.workingHoursEnd": data.workingHoursEnd,
                "doctorInfo.specialization": data.specialization,
                "doctorInfo.experienceYears": data.experienceYears,
                "userInfo.bio": data.bio,
            },
        },
        { new: true, runValidators: true },
    );
};

export const removeDoctorRole = async (userId: string) => {
    // العودة لدور المستخدم العادي وإزالة بيانات الطبيب
    return await User.findByIdAndUpdate(userId, {
        $set: { role: UserRoles.USER },
        $unset: { doctorInfo: 1 },
        "userInfo.job": "Unemployed",
    });
};
