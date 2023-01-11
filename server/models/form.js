import mongoose from "mongoose";

const formSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  signature: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
const FormData = mongoose.model("FormData", formSchema);
export default FormData;
