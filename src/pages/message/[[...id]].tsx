import { PrimaryLayout } from "@/components/layout/layouts";
import { Title } from "@/components/head/title";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Message, MessageThreadSummary, UserProfileData } from "@/lib/types";
import { version as uuidVersion } from "uuid";
import { axiosPrivate } from "@/lib/axios";
import { MainContentWithSideBar, SideBar } from "@/components/layout/columns";
import { CurrentThreadAuthor } from "@/components/messaging/current-thread-author";
import { Divider, LabelledDivider } from "@/components/layout/divider";
import { Flex } from "@/components/layout/flex";
import { Div } from "@/components/layout/utils";
import { Formik } from "formik";
import { Yup } from "@/lib/yup";
import { Form } from "@/components/forms/form";
import { InputOuter, TextAreaInner } from "@/components/forms/input";
import { Feedback } from "@/components/forms/feedback";
import { Button } from "@/components/navigation/button";

const MessageSchema = Yup.object().shape({
  body: Yup.string().optional().ensure(),
});

export default function MessageCenter() {
  const router = useRouter();
  const { id } = router.query;
  const [threads, setThreads] = useState<MessageThreadSummary[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeThreadProfile, setActiveThreadProfile] =
    useState<UserProfileData>();
  const [activeThread, setActiveThread] = useState("");

  const loadThreads = useCallback(() => {
    axiosPrivate
      .get("messages", {
        id: `mesage-threads`,
        cache: {
          ttl: 60 * 1000,
        },
      })
      .then((res) => res.data)
      .then((data) => setThreads(data))
      .catch((err) => setThreads([]));
  }, []);

  const loadActiveThread = useCallback(() => {
    if (activeThread == "") return;
    axiosPrivate
      .get(`messages/${activeThread}`, {
        id: `mesage-threads-${activeThread}`,
        cache: {
          ttl: 10 * 1000,
        },
      })
      .then((res) => res.data)
      .then((data) => setMessages(data))
      .catch((err) => setMessages([]));
  }, [activeThread]);

  const loadProfileForActiveThread = useCallback(() => {
    if (activeThread == "") return;
    axiosPrivate
      .get(`user/profile/by_id/${activeThread}`)
      .then((res) => res.data)
      .then((data) => setActiveThreadProfile(data))
      .catch((err) => setActiveThreadProfile(undefined));
  }, [activeThread]);

  useEffect(() => {
    if (typeof id !== "undefined") {
      try {
        //If url param is a valid uuid, we can try to open a thread with that user
        uuidVersion(id[0] ?? "");
        setActiveThread(id[0]);
      } catch (err) {}
    }
    loadThreads();
    loadActiveThread();
    loadProfileForActiveThread();
    const refreshThreads = setInterval(loadThreads, 2 * 60 * 1000);
    const refreshActiveThread = setInterval(loadActiveThread, 20 * 1000);
    return () => {
      clearInterval(refreshThreads);
      clearInterval(refreshActiveThread);
    };
  }, [id, loadThreads, loadActiveThread, loadProfileForActiveThread]);

  const MessageInput = () => {
    return (
      <Formik
        initialValues={{
          body: "",
        }}
        validationSchema={MessageSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put(`message/${activeThread}`, values)
            .then(async (response) => {
              if (response.data?.success == "false") {
                actions.setFieldError("about", "Oops, something went wrong");
              } else {
                actions.resetForm();
                await axiosPrivate.storage.remove(
                  `message-threads-${activeThread}`
                );
                loadActiveThread();
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == "ERR_NETWORK") {
                actions.setFieldError("about", "Oops, something went wrong");
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
              <InputOuter error={props.touched.body && !!props.errors.body}>
                <TextAreaInner
                  name="body"
                  id="message-body"
                  placeholder="Write a message"
                  aria-label="about"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.body}
                />
              </InputOuter>
              {props.touched.body && props.errors.body && (
                <Feedback state="error">{props.errors.body}</Feedback>
              )}
              <Flex>
                <Button role="secondary" onClick={props.submitForm}>
                  Send
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
      <Title>Messages</Title>
      <PrimaryLayout>
        <SideBar>
          <Flex column css={{ maxHeight: "85dvh" }}>
            Threads Here
          </Flex>
        </SideBar>
        <MainContentWithSideBar>
          {activeThreadProfile && (
            <Flex column css={{ maxHeight: "85dvh" }}>
              <CurrentThreadAuthor data={activeThreadProfile} />
              <Divider />
              <Div css={{ flexGrow: "1", overflowY: "auto" }}>
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
                <LabelledDivider label="Friday, February 3rd" />
              </Div>
              <Div>
                <MessageInput />
              </Div>
            </Flex>
          )}
        </MainContentWithSideBar>
      </PrimaryLayout>
    </>
  );
}
