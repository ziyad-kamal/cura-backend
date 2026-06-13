import mongoose from "mongoose";
import DoctorReview from "../../models/DoctorReview.js";
import User from "../../models/User.js";
import Consultation from "../../models/Consultation.js";

export const createDoctorReview = async (userId: string, data: {
    doctorId: string;
    rating: number;
    comment?: string;
    consultationId?: string;
}) => {
    const { doctorId, rating, comment, consultationId } = data;

    // Check if user has an existing consultation with this doctor
    const consultation = await Consultation.findOne({
        user: new mongoose.Types.ObjectId(userId),
        doctor: new mongoose.Types.ObjectId(doctorId),
    });
    if (!consultation) {
        throw new Error("You must have a consultation with this doctor to leave a review.");
    }

    // Attempt to find if user already reviewed this doctor (since we have a unique index on userId + doctorId)
    const existingReview = await DoctorReview.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        doctorId: new mongoose.Types.ObjectId(doctorId)
    });
    if (existingReview) {
        throw new Error("You have already reviewed this doctor.");
    }

    const review = await DoctorReview.create({
        userId: new mongoose.Types.ObjectId(userId),
        doctorId: new mongoose.Types.ObjectId(doctorId),
        consultationId: consultationId ? new mongoose.Types.ObjectId(consultationId) : consultation._id,
        rating,
        comment,
    });

    // Update doctor's average rating & total reviews
    await updateDoctorRatingAverage(doctorId);

    return review;
};

export const getDoctorReviews = async (doctorId: string) => {
    return await DoctorReview.find({ doctorId: new mongoose.Types.ObjectId(doctorId) })
        .populate("userId", "name.first name.last image")
        .sort({ createdAt: -1 });
};

export const getDoctorRatingStats = async (doctorId: string) => {
    const stats = await DoctorReview.aggregate([
        { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 },
            },
        },
    ]);

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalReviews = 0;
    let sumRatings = 0;

    stats.forEach((stat) => {
        const rating = stat._id as 1 | 2 | 3 | 4 | 5;
        if (ratingCounts[rating] !== undefined) {
            ratingCounts[rating] = stat.count;
            totalReviews += stat.count;
            sumRatings += rating * stat.count;
        }
    });

    const average = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 0;

    return {
        ratingAverage: average,
        totalReviews,
        ratingCounts,
    };
};

export const updateDoctorRatingAverage = async (doctorId: string) => {
    const stats = await getDoctorRatingStats(doctorId);

    await User.findByIdAndUpdate(doctorId, {
        $set: {
            "doctorInfo.ratingAverage": stats.ratingAverage,
            "doctorInfo.totalReviews": stats.totalReviews,
        },
    });
};
