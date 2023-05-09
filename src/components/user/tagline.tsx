import { useCallback, useEffect, useState } from "react";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { Form } from "../forms/form";
import { Flex } from "../layout/flex";
import { Button } from "../navigation/button";
import { Formik } from "formik";
import { Yup } from "@/lib/yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { InputInner, InputOuter } from "../forms/input";
import { Feedback } from "../forms/feedback";
import { H2 } from "../text/headings";

const UpdateTaglineSchema = Yup.object().shape({
  tagline: Yup.string().optional().ensure(),
});

export const Tagline = ({
  uid = "",
  own = false,
}: {
  uid: string;
  own?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [tagline, setTagline] = useState("");

  const toggleEdit = () => {
    setEditMode(!editMode);
    loadTagline();
  };

  const loadTagline = useCallback(() => {
    axiosPublic
      .get(`user/tagline/${uid}`, { id: `user-tagline-${uid}` })
      .then((response) => setTagline(response.data?.tagline ?? ""))
      .catch(() => setTagline(""));
  }, [uid]);

  useEffect(() => {
    if (uid != "") {
      loadTagline();
    }
  }, [uid, loadTagline]);

  const placeholder = () => {
    return own && tagline == "";
  };

  const StaticTagline = () => {
    return (
      <H2 css={{ color: `${placeholder() ? "$neutral600" : "$neutral800"}` }}>
        {placeholder() ? "Add a tagline" : tagline}{" "}
        {own && (
          <FontAwesomeIcon
            onClick={toggleEdit}
            icon={faPencil}
            style={{ cursor: "pointer" }}
          />
        )}
      </H2>
    );
  };

  const EditTagline = () => {
    return (
      <Formik
        initialValues={{
          tagline: tagline,
        }}
        validationSchema={UpdateTaglineSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .post("user/tagline", values)
            .then(async (response) => {
              if (response.data?.success == "false") {
                actions.setFieldError("tagline", "Oops, something went wrong");
              } else {
                await axiosPublic.storage.remove(`user-tagline-${uid}`);
                toggleEdit();
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == "ERR_NETWORK") {
                actions.setFieldError("tagline", "Oops, something went wrong");
              } else {
                const statuscode = Number(reason?.response?.status);
                switch (statuscode) {
                  default:
                    //TODO: Other failure reasons (not validated, etc)
                    console.log(reason);
                    break;
                }
              }
            });
          actions.setSubmitting(false);
        }}
      >
        {(props) => {
          return (
            <Form onSubmit={props.handleSubmit} css={{ gap: "$3" }}>
              <InputOuter
                error={props.touched.tagline && !!props.errors.tagline}
              >
                <InputInner
                  type="text"
                  name="tagline"
                  id="tagline"
                  placeholder="Enter a tagline"
                  aria-label="Tagline"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.tagline}
                />
              </InputOuter>
              {props.touched.tagline && props.errors.tagline && (
                <Feedback state="error">{props.errors.tagline}</Feedback>
              )}
              <Flex css={{ flexDirection: "row-reverse" }}>
                <Button
                  href="#"
                  role="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleEdit();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  href=""
                  role="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    props.submitForm();
                  }}
                >
                  Save
                </Button>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    );
  };

  return (
    <>
      {(!own || !editMode) && StaticTagline()}
      {own && editMode && EditTagline()}
    </>
  );
};
