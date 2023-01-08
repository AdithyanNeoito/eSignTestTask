import FormData from "../models/form.js";

export const createForm = async (req, res) => {
  const formData = req.body;
  console.log("body", formData);
  const newFormData = new FormData(formData);
  try {
    await newFormData.save();
    res.status(201).json(newFormData);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
