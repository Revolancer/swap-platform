import { useCallback, useEffect, useState } from "react";
import { Flex } from "../layout/flex";
import { P } from "../text/text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { Tag } from "@/lib/types";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { TagElement } from "../tags";
import { TagField } from "../forms/taginput";
import { Form } from "../forms/form";
import { Formik } from "formik";
import { Yup } from "@/lib/yup";
import { Button } from "../navigation/button";

export const SkillSegment = ({
  uid = "",
  own = false,
}: {
  uid: string;
  own: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const loadTagsForUser = useCallback(async () => {
    const response = await axiosPublic.get(`user/skills/${uid}`);
    setTags(response.data?.skills ?? []);
  }, [uid]);

  useEffect(() => {
    if (uid != "") {
      loadTagsForUser();
    }
  }, [uid, loadTagsForUser]);

  const StaticTags = () => {
    const staticTags = [];
    for (const tag of tags) {
      staticTags.push(<TagElement tag={tag} />);
    }
    return <Flex wrap>{staticTags}</Flex>;
  };

  const SkillEditSchema = Yup.object().shape({
    skills: Yup.array()
      .of(Yup.object().shape({ id: Yup.string(), text: Yup.string() }))
      .required(
        "Please select some skills and tools to let us know what you're good at"
      )
      .min(3, "Please select at least three skills or tools")
      .max(
        20,
        "Whoa there! That's a lot of skills! We want to know what you're best at, so please only provide 20 tags."
      ),
  });

  const EditTags = () => {
    return (
      <Formik
        initialValues={{
          skills: tags,
        }}
        validationSchema={SkillEditSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .post("user/skills", values)
            .then(async (response) => {
              if (response.data?.success == "false") {
                actions.setFieldError("skills", "Oops, something went wrong");
              } else {
                await loadTagsForUser();
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == "ERR_NETWORK") {
                actions.setFieldError("skills", "Oops, something went wrong");
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
              <TagField name="skills" />
              <Flex css={{ flexDirection: "row-reverse" }}>
                <Button role="secondary" onClick={props.submitForm}>
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
      <Flex
        style={{
          justifyContent: own ? "space-between" : "flex-start",
          width: "100%",
        }}
      >
        <P css={{ color: "$neutral600" }}>Skills</P>
        <FontAwesomeIcon
          onClick={toggleEdit}
          icon={faPencil}
          style={{ cursor: "pointer" }}
        />
      </Flex>
      {!editMode && StaticTags()}
      {editMode && EditTags()}
    </>
  );
};
