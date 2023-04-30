import axios from "axios";
import { axiosPrivate } from "../axios";

export const uploadFile = async (file: File) => {
  const options = { headers: { "Content-Type": file.type } };
  const urls = await axiosPrivate
    .get(`upload/url?filename=${file.name}&size=${file.size}`)
    .then((response) => response.data);

  if (!urls.signedUrl) {
    throw new Error("Error uploading file");
  } else {
    await axios.put(urls.signedUrl, file, options);
    return urls.publicUrl;
  }
};

export const uploadForEditorJs = async (
  file: File
): Promise<{ success: number; file: { url: string } }> => {
  try {
    const url = await uploadFile(file);
    return { success: 1, file: { url: url } };
  } catch (err) {
    return { success: 0, file: { url: "" } };
  }
};
