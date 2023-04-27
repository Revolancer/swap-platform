import { styled } from "stitches.config";
import { Form as FormikForm } from "formik";

export const Form = styled(FormikForm, {
  display: "flex",
  gap: "$4",
  flexDirection: "column",
  width: "100%",
});
