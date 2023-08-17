import { MainContentWithSideBar, SideBar } from '@/components/layout/columns';
import { PrimaryLayout } from '@/components/layout/layouts';
import { Title } from '@/components/head/title';
import dynamic from 'next/dynamic';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { TagField } from '@/components/forms/taginput';
import { Form } from '@/components/forms/form';
import { Button } from '@revolancer/ui/buttons';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { InputInner, InputOuter } from '@/components/forms/input';
import { Feedback } from '@/components/forms/feedback';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PostData } from '@/lib/types';
import { H1, H5 } from '@/components/text/headings';
import { Flex } from '@/components/layout/flex';
import store from '@/redux/store';
import FourOhFour from '../404';
import { DateTime } from 'luxon';
import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
import { Crumb } from '@/components/navigation/crumbs/crumb';
import { P } from '@/components/text/text';
import { NeedExplainer } from '@/components/collapsible/need-explainer';
import { NeedLoopModal } from '@/components/modals/need-loop-modal';
import { NeedOrClientModal } from '@/components/modals/need-or-client-modal';
import { Block } from 'editorjs-blocks-react-renderer';

const discardEmptyBlocks = (blocks: Block[]) => {
  return blocks.filter((block) => {
    let filterCondition = true;
    switch (block.type) {
      case 'list':
        filterCondition = block.data.items.length > 0;
        break;
      case 'header':
      case 'paragraph':
        filterCondition = block.data.text.length > 0;
        break;
      case 'image':
        filterCondition = block.data.file.url.length > 0;
        break;
      default:
        break;
    }
    return filterCondition;
  });
};

const NeedSchema = Yup.object().shape({
  data: Yup.object().optional(),
  title: Yup.string().required().ensure().min(1),
  tags: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), text: Yup.string() }))
    .required('Please tag this project with some associated skills or tools')
    .min(
      1,
      'Please select at least one skill or tool associated with this project',
    )
    .max(
      6,
      'Please provide up to 6 skills or tools associated with this project',
    ),
  unpublish_at: Yup.string()
    .required('Please provide a date you need this by')
    .matches(
      /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/,
      'Please enter the date to delist this need in the format yyyy-mm-dd, for example 2024-05-20',
    )
    .test(
      'one_week_future',
      'Please give people at least a week to respond to this need',
      (value) => {
        return DateTime.fromISO(value ?? '') > DateTime.now().plus({ week: 1 });
      },
    ),
});

export default function NeedEditorPage() {
  const router = useRouter();
  const [isNew, setNew] = useState(false);
  const [hasPostedNeed, setHasPostedNeed] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadedData, setLoadedData] = useState<PostData | undefined>(undefined);
  const [isNotFound, setNotFound] = useState(false);
  const [nextUrl, setNextUrl] = useState('/u/profile');
  const [success, setSuccess] = useState(false);
  const { id } = router.query;

  const NeedEditorJs = dynamic(
    import('@/components/user-posts/need-editor-js'),
    {
      ssr: false,
    },
  );

  useEffect(() => {
    const loadPost = async () => {
      if (id != null && id != 'new') {
        setNotFound(true);
        /* Editing not currently allowed
        await axiosPublic
          .get(`need/${id}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? "") == "") {
                setNotFound(true);
              }
              const self = store?.getState()?.userData?.user?.id ?? "";
              if (response.data?.user?.id !== self) {
                setNotFound(true);
              }
              setLoadedData(response.data);
              setHasLoaded(true);
            }
          })
          .catch((err) => {
            setNotFound(true);
          });*/
      } else if (id == 'new') {
        await axiosPrivate
          .get(`need/own/all/count`)
          .then((response) => setHasPostedNeed(response.data > 2))
          .catch(() => setHasPostedNeed(false));
        setNew(true);
        setHasLoaded(true);
      }
    };
    loadPost();
  }, [id]);
  if (isNotFound) {
    return <FourOhFour />;
  }

  return (
    <>
      {!hasPostedNeed && isNew && <NeedOrClientModal />}
      {success && isNew && <NeedLoopModal nextUrl={nextUrl} />}
      <Title>{`${isNew ? 'New' : 'Edit'} Need`}</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/">Discovery</Crumb>
          {hasLoaded && (
            <Crumb href={`/need/${id}`} active>
              {`${isNew ? 'New' : 'Edit'} Need`}
            </Crumb>
          )}
        </CrumbBar>
        {!hasLoaded && <H1>Loading...</H1>}
        {hasLoaded && (
          <Formik
            initialValues={{
              data: JSON.parse(
                loadedData?.data ??
                  '{"time": 1682956618189,"blocks": [],"version": "2.26.5"}',
              ),
              tags: loadedData?.tags ?? [],
              title: loadedData?.title ?? '',
              unpublish_at: DateTime.now().plus({ week: 2 }).toISODate(),
            }}
            validationSchema={NeedSchema}
            onSubmit={async (values, actions) => {
              console.log(values);
              actions.setSubmitting(true);
              if (isNew) {
                if (discardEmptyBlocks(values.data.blocks).length == 0) {
                  actions.setFieldError(
                    'data',
                    'Please add some information about your need.',
                  );
                  return;
                }
                await axiosPrivate
                  .put('need', values)
                  .then(async (response) => {
                    if (response.data?.success == 'false') {
                      actions.setFieldError(
                        'title',
                        'Oops, something went wrong',
                      );
                    } else {
                      const self =
                        store?.getState()?.userData?.user?.id ?? 'guest';
                      await axiosPublic.storage.remove(`user-needs-${self}`);
                      if (response?.data && typeof response.data == 'string') {
                        setNextUrl(`/n/${response.data}`);
                      }
                      setSuccess(true);
                    }
                  })
                  .catch((reason) => {
                    //TODO - error handling
                    if (reason.code == 'ERR_NETWORK') {
                      actions.setFieldError(
                        'title',
                        'Oops, something went wrong',
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
                  .post(`need/${id}`, values)
                  .then(async (response) => {
                    if (response.data?.success == 'false') {
                      actions.setFieldError(
                        'title',
                        'Oops, something went wrong',
                      );
                    } else {
                      setNextUrl(`/n/${response.data}`);
                      setSuccess(true);
                    }
                  })
                  .catch((reason) => {
                    //TODO - error handling
                    if (reason.code == 'ERR_NETWORK') {
                      actions.setFieldError(
                        'title',
                        'Oops, something went wrong',
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
                    <H1>Find a Pro</H1>
                    <P
                      css={{
                        color: '$neutral700',
                        fontSize: '$body1',
                        lineHeight: '$body1',
                      }}
                    >
                      Describe the services or assistance you need from fellow
                      digital professionals
                    </P>
                    <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
                      <Flex column>
                        <H5>Title</H5>
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
                          <Feedback state="error">
                            {props.errors.title}
                          </Feedback>
                        )}
                      </Flex>
                      <Flex column>
                        <H5>Tags</H5>
                        <TagField name="tags" />
                      </Flex>
                      <Flex column>
                        <H5>I need this by</H5>
                        <InputOuter
                          error={
                            props.touched.unpublish_at &&
                            !!props.errors.unpublish_at
                          }
                        >
                          <InputInner
                            type="date"
                            name="unpublish_at"
                            id="unpublish_at"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.unpublish_at ?? ''}
                          ></InputInner>
                        </InputOuter>
                        {props.touched.unpublish_at &&
                          props.errors.unpublish_at && (
                            <Feedback state="error">
                              {props.errors.unpublish_at}
                            </Feedback>
                          )}
                      </Flex>
                      <Flex column>
                        <H5>Describe what you need</H5>
                        <NeedExplainer />
                        {props.touched.data && props.errors.data && (
                          <Feedback state="error">{props.errors.data}</Feedback>
                        )}
                        <NeedEditorJs name="data" data={props.values.data} />
                      </Flex>
                    </Form>
                  </MainContentWithSideBar>
                  <SideBar>
                    <Flex>
                      <Button
                        href="#"
                        onClick={(e) => {
                          if (!props.isSubmitting) {
                            e.preventDefault();
                            props.submitForm();
                          }
                        }}
                        disabled={props.isSubmitting}
                      >
                        Publish
                      </Button>
                      {isNew ? (
                        <Button role="secondary" href="/u/profile" replace>
                          Cancel
                        </Button>
                      ) : (
                        loadedData?.id && (
                          <Button
                            role="secondary"
                            href={`/n/${loadedData.id}`}
                            replace
                            disabled={props.isSubmitting}
                          >
                            Cancel
                          </Button>
                        )
                      )}
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
