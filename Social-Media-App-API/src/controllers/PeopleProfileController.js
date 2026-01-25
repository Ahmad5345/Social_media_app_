import ProfileModel from '../models/PeopleProfileModel.js';

export async function setProfile(userId, itemProfile) {
  try {
    const NewProfile = new ProfileModel({ ...itemProfile, user: userId });
    const SavedProfile = await NewProfile.save();
    return SavedProfile;
  } catch (error) {
    throw new Error(`Error SetProfile function: ${error.message}`);
  }
}

export async function getProfile(ID) {
  try {
    const result = await ProfileModel.findOne({ user: ID });
    if (!result) {
      throw new Error('Error GetProfile function: Profile not found');
    }
    return result;
  } catch (error) {
    throw new Error(`Error GetProfile function: ${error.message}`);
  }
}
