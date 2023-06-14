import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 99 },
  username: { type: String, required: true, minLength: 5, maxLength: 99 },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 8, maxLength: 99 },
});

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`;
});

UserSchema.virtual('json').get(function () {
  return this.toJSON();
});

export default mongoose.model('User', UserSchema);
