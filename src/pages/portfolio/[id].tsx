import { MainContentWithSideBar, SideBar } from "@/components/layout/columns";
import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import dynamic from "next/dynamic";
import { Formik } from "formik";
import { Yup } from "@/lib/yup";
import { TagField } from "@/components/forms/taginput";
import { Form } from "@/components/forms/form";
import { Button } from "@/components/navigation/button";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { InputInner, InputOuter } from "@/components/forms/input";
import { Feedback } from "@/components/forms/feedback";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PostData } from "@/lib/types";
import { H1 } from "@/components/text/headings";
import { Flex } from "@/components/layout/flex";

const ArticleSchema = Yup.object().shape({
  data: Yup.object().optional(),
  title: Yup.string().required().ensure().min(1),
  tags: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), text: Yup.string() }))
    .required("Please tag this post with some associated skills or tools")
    .min(
      1,
      "Please select at least one skill or tool associated with this project"
    )
    .max(6, "Please provide up to 6 skills or tools associated with this post"),
});

export default function PortfolioEditorPage() {
  const router = useRouter();
  const [isNew, setNew] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadedData, setLoadedData] = useState<PostData | undefined>(undefined);
  const { id } = router.query;

  const PortfolioEditorJs = dynamic(
    import("@/components/portfolio/portfolio-editor-js"),
    {
      ssr: false,
    }
  );

  useEffect(() => {
    const loadPost = async () => {
      if (id != null && id != "new") {
        const response = await axiosPublic.get(`portfolio/${id}`);
        if ((response?.data ?? null) != null) {
          setLoadedData(response.data);
          setHasLoaded(true);
        }
      } else if (id == "new") {
        setNew(true);
        setHasLoaded(true);
      }
    };
    loadPost();
  }, [id]);

  return (
    <>
      <Title>{`${isNew ? "New" : "Edit"} Portfolio Post`}</Title>
      <PrimaryLayout>
        {!hasLoaded && <H1>Loading...</H1>}
        {hasLoaded && (
          <Formik
            initialValues={{
              data: JSON.parse(loadedData?.data ?? "{}"),
              tags: loadedData?.tags ?? [],
              title: loadedData?.title ?? "",
            }}
            validationSchema={ArticleSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              if (isNew) {
                await axiosPrivate
                  .put("portfolio", values)
                  .then(async (response) => {
                    if (response.data?.success == "false") {
                      actions.setFieldError(
                        "title",
                        "Oops, something went wrong"
                      );
                    } else {
                      window.location.href = `/p/${response?.data ?? ""}`;
                    }
                  })
                  .catch((reason) => {
                    //TODO - error handling
                    if (reason.code == "ERR_NETWORK") {
                      actions.setFieldError(
                        "title",
                        "Oops, something went wrong"
                      );
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
              } else {
                await axiosPrivate
                  .post(`portfolio/${id}`, values)
                  .then(async (response) => {
                    if (response.data?.success == "false") {
                      actions.setFieldError(
                        "title",
                        "Oops, something went wrong"
                      );
                    } else {
                      window.location.href = `/p/${id}`;
                    }
                  })
                  .catch((reason) => {
                    //TODO - error handling
                    if (reason.code == "ERR_NETWORK") {
                      actions.setFieldError(
                        "title",
                        "Oops, something went wrong"
                      );
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
              }
              actions.setSubmitting(false);
            }}
          >
            {(props) => {
              return (
                <>
                  <MainContentWithSideBar>
                    <Form onSubmit={props.handleSubmit} css={{ gap: "$3" }}>
                      <InputOuter
                        error={props.touched.title && !!props.errors.title}
                      >
                        <InputInner
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Title"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.title}
                        />
                      </InputOuter>
                      {props.touched.title && props.errors.title && (
                        <Feedback state="error">{props.errors.title}</Feedback>
                      )}
                      <TagField name="tags" />
                      <PortfolioEditorJs name="data" data={props.values.data} />
                    </Form>
                  </MainContentWithSideBar>
                  <SideBar>
                    <Flex>
                      <Button onClick={props.submitForm}>Save</Button>
                      <Button
                        role="secondary"
                        href={
                          isNew ? "/u/profile" : `/p/${loadedData?.id ?? ""}`
                        }
                      >
                        Cancel
                      </Button>
                    </Flex>
                  </SideBar>
                </>
              );
            }}
          </Formik>
        )}
      </PrimaryLayout>
    </>
  );
}
