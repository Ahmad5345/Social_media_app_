import ProfileModel from '../models/PeopleProfileModel.js';

export async function setProfile(userId, itemProfile) {
  try {
    const {
      name,
      year,
      dev,
      des,
      pm,
      core,
      mentor,
      major,
      minor,
      birthday,
      home,
      quote,
      tradition,
      fun_fact,
      picture_url,
      favorite_1,
      favorite_2,
      favorite_3
    } = itemProfile;

    const profileFields = {
      name,
      year,
      dev,
      des,
      pm,
      core,
      mentor,
      major,
      minor,
      birthday,
      home,
      quote,
      tradition,
      fun_fact,
      picture_url,
      favorite_1,
      favorite_2,
      favorite_3
    };

    const newProfile = new ProfileModel({
      ...profileFields,
      user: userId
    });

    const savedProfile = await newProfile.save();
    return savedProfile;
  } catch (error) {
    throw new Error(`Error setProfile function: ${error.message}`);
  }
}

export async function updateProfileVisibility(userId, visibility) {
  try {
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { user: userId },
      { is_public: visibility },
      { new: true }
    );

    return updatedProfile;
  } catch (error) {
    throw new Error(`Error updateProfileVisibility function: ${error.message}`);
  }
}

export async function searchProfiles(req, res) {
  try {
    const search = req.query.search?.trim();
    const major = req.query.major?.trim();
    const year = req.query.year?.trim();
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const query = { user: { $exists: true } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { major: { $regex: search, $options: 'i' } }
      ];
    }

    if (major) {
      query.major = major;
    }

    if (year) {
      query.year = parseInt(year, 10);
    }

    const profiles = await ProfileModel.find(query)
      .populate('user', 'name email')
      .sort({ name: 1, createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await ProfileModel.countDocuments(query);

    res.json({
      profiles,
      total,
      hasMore: profiles.length === limit
    });
  } catch (error) {
    res.status(500).json({ error: `searchProfiles: ${error.message}` });
  }
}

export async function getProfile(userId) {
  try {
    const result = await ProfileModel.findOne({ user: userId });

    if (!result) {
      throw new Error('Profile not found');
    }

    return result;
  } catch (error) {
    throw new Error(`Error getProfile function: ${error.message}`);
  }
}
