import mongoose from "mongoose";

const formSchema = mongoose.Schema({
  name: String,
  date: String,
  signature: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
const FormData = mongoose.model("FormData", formSchema);
export default FormData;
