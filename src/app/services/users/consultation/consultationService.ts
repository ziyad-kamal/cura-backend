import mongoose from "mongoose";
import { UserRoles } from "../../../../enums/UserRoles.js";
import Chatroom from "../../../models/Chatroom.js";
import Consultation from "../../../models/Consultation.js";
import User from "../../../models/User.js";

export const createConsultation = async (
    userId: string,
    data: {
        doctorId: string;
        planType: string; // 'weekly' | 'monthly' | 'six_months'
        paymentIntentId?: string;
        scheduledDay: string;
        startTime: string;
        endTime: string;
    },
) => {
    const { doctorId, planType, paymentIntentId, scheduledDay, startTime, endTime } = data;

    // 1. Get Doctor Info
    const doctor = await User.findOne({ _id: doctorId, role: UserRoles.DOCTOR });
    if (!doctor) {
        throw new Error("Doctor not found");
    }

    // 2. Validate schedule if doctor has schedule defined
    if (doctor.doctorInfo?.workingDays && doctor.doctorInfo.workingDays.length > 0) {
        const selectedDays = scheduledDay.split(",").map((d) => d.trim());
        for (const day of selectedDays) {
            const isWorkingDay = doctor.doctorInfo.workingDays.includes(day);
            if (!isWorkingDay) {
                throw new Error(`Doctor does not work on ${day}`);
            }
        }
    }

    if (doctor.doctorInfo?.workingHoursStart && doctor.doctorInfo?.workingHoursEnd) {
        // Simple string comparison for time: e.g. "10:00" >= "09:00"
        const start = doctor.doctorInfo.workingHoursStart;
        const end = doctor.doctorInfo.workingHoursEnd;
        if (startTime < start || endTime > end || startTime >= endTime) {
            throw new Error(
                `Selected hours (${startTime} - ${endTime}) are outside doctor's working hours (${start} - ${end})`,
            );
        }
    }

    // Determine price based on plan type
    let price: number;

    switch (planType) {
        case "weekly":
            price = doctor.doctorInfo?.shortConsultPrice || 0;
            break;

        case "monthly":
            price = doctor.doctorInfo?.normalConsultPrice || 0;
            break;

        case "six_months":
            price = doctor.doctorInfo?.LongConsultPrice || 0;
            break;

        default:
            throw new Error("Invalid plan type");
    }

    // Determine chatroom active period
    let durationDays = 30; // default
    if (planType === "weekly") {
        durationDays = 7;
    } else if (planType === "monthly") {
        durationDays = 30;
    } else if (planType === "six_months") {
        durationDays = 180;
    }

    const activeUntil = new Date();
    activeUntil.setDate(activeUntil.getDate() + durationDays);

    // Create consultation and chatroom inside a session (transaction) if possible
    // For standard mongoose compatibility without replica sets, we'll write sequentially
    const consultationId = new mongoose.Types.ObjectId();
    const chatroomId = new mongoose.Types.ObjectId();

    const chatroom = await Chatroom.create({
        _id: chatroomId,
        sender: new mongoose.Types.ObjectId(userId),
        receiver: new mongoose.Types.ObjectId(doctorId),
        consultation: consultationId,
        activeUntil,
        isActive: true,
        isRead: false,
        lastMessageAt: new Date(),
        createdAt: new Date(),
    });

    // Create Consultation referencing chatroom
    const consultation = await Consultation.create({
        _id: consultationId,
        price,
        type: planType,
        status: "in progress",
        user: new mongoose.Types.ObjectId(userId),
        doctor: new mongoose.Types.ObjectId(doctorId),
        chatroom: chatroomId,
        scheduledDay,
        startTime,
        endTime,
        paymentIntentId,
        createdAt: new Date(),
    });

    return { consultation, chatroom };
};

export const getSeekerConsultations = async (userId: string) => {
    return await Consultation.find({ user: userId })
        .populate("doctor", "name.first name.last doctorInfo specialization image")
        .sort({ createdAt: -1 });
};

export const getDoctorConsultations = async (doctorId: string) => {
    return await Consultation.find({ doctor: doctorId })
        .populate("user", "name.first name.last userInfo image")
        .sort({ createdAt: -1 });
};
