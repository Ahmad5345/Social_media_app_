import mongoose, { Schema } from 'mongoose';

const PeopleProfile = new Schema(
  {
    // eslint-disable-next-line object-curly-newline
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    dev: { type: Boolean, default: false },
    des: { type: Boolean, default: false },
    pm: { type: Boolean, default: false },
    core: { type: Boolean, default: false },
    mentor: { type: Boolean, default: false },
    major: { type: String, default: 'Undeclared' },
    minor: { type: String, default: 'Undeclared' },
    birthday: { type: Date, default: null },
    home: { type: String, default: null },
    quote: { type: String, default: null },
    favorite_1: { type: String, default: null },
    favorite_2: { type: String, default: null },
    favorite_3: { type: String, default: null },
    is_public: { type: Boolean, default: true },
    tradition: { type: String, default: null },
    fun_fact: { type: String, default: null },
    picture_url: { type: String, default: null },
  },
);

const ProfileModel = mongoose.model('People_profile', PeopleProfile);

export default ProfileModel;
