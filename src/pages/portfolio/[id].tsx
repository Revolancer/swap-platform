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
//import { InputInner, InputOuter } from '@/components/forms/input';
//import { Feedback } from '@/components/forms/feedback';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PostData } from '@/lib/types';
//import { H1, H5 } from '@/components/text/headings';
//import { Flex } from '@/components/layout/flex';
import store from '@/redux/store';
import FourOhFour from '../404';
//import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
//import { Crumb } from '@/components/navigation/crumbs/crumb';
import { SuccessModal } from '@/components/modals/success-modal';
import { H1, H5 } from '@revolancer/ui/text';
import { Flex } from '@revolancer/ui/layout';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { InputInner, InputOuter, Feedback } from '@revolancer/ui/forms';

const ArticleSchema = Yup.object().shape({
  data: Yup.object().optional(),
  title: Yup.string().required().ensure().min(1),
  tags: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), text: Yup.string() }))
    .required('Please tag this post with some associated skills or tools')
    .min(
      1,
      'Please select at least one skill or tool associated with this project',
    )
    .max(6, 'Please provide up to 6 skills or tools associated with this post'),
});

export default function PortfolioEditorPage() {
  const router = useRouter();
  const [isNew, setNew] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadedData, setLoadedData] = useState<PostData | undefined>(undefined);
  const [isNotFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nextUrl, setNextUrl] = useState('/u/profile');
  const { id } = router.query;

  const PortfolioEditorJs = dynamic(
    import('@/components/user-posts/portfolio-editor-js'),
    {
      ssr: false,
    },
  );

  useEffect(() => {
    const loadPost = async () => {
      if (id != null && id != 'new') {
        await axiosPublic
          .get(`portfolio/${id}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? '') == '') {
                setNotFound(true);
              }
              const self = store?.getState()?.userData?.user?.id ?? '';
              if (response.data?.user?.id !== self) {
                setNotFound(true);
              }
              setLoadedData(response.data);
              setHasLoaded(true);
            }
          })
          .catch((err) => {
            setNotFound(true);
          });
      } else if (id == 'new') {
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
      <Title>{`${isNew ? 'New' : 'Edit'} Portfolio Post`}</Title>
      <PrimaryLayout>
        <CrumbBar>
          <Crumb href="/">Discovery</Crumb>
          {hasLoaded && (
            <Crumb href={`/portfolio/${id}`} active>
              {`${isNew ? 'New' : 'Edit'} Portfolio Article`}
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
            }}
            validationSchema={ArticleSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              if (isNew) {
                await axiosPrivate
                  .put('portfolio', values)
                  .then(async (response) => {
                    if (response.data?.success == 'false') {
                      actions.setFieldError(
                        'title',
                        'Oops, something went wrong',
                      );
                    } else {
                      const self =
                        store?.getState()?.userData?.user?.id ?? 'guest';
                      await axiosPublic.storage.remove(
                        `user-portfolio-${self}`,
                      );
                      setNextUrl(`/p/${response?.data ?? ''}`);
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
                  .post(`portfolio/${id}`, values)
                  .then(async (response) => {
                    if (response.data?.success == 'false') {
                      actions.setFieldError(
                        'title',
                        'Oops, something went wrong',
                      );
                    } else {
                      setNextUrl(`/p/${id}`);
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
                    <H1>{`${isNew ? 'New' : 'Edit'} Portfolio Article`}</H1>
                    <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
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
                        <Feedback state="error">{props.errors.title}</Feedback>
                      )}
                      <H5>Tags</H5>
                      <TagField name="tags" />
                      <H5>Tell us about your project</H5>
                      <PortfolioEditorJs name="data" data={props.values.data} />
                    </Form>
                  </MainContentWithSideBar>
                  <SideBar>
                    <Flex>
                      <Button
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          props.submitForm();
                        }}
                        disabled={props.isSubmitting}
                      >
                        Publish
                      </Button>
                      {isNew ? (
                        <Button
                          role="secondary"
                          href="/u/profile"
                          replace
                          disabled={props.isSubmitting}
                        >
                          Cancel
                        </Button>
                      ) : (
                        loadedData?.id && (
                          <Button
                            role="secondary"
                            href={`/p/${loadedData.id}`}
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
        {success && (
          <SuccessModal
            successMessage="Your post has been published"
            onClose={() => {
              setSuccess(false);
              router.replace(nextUrl);
            }}
          />
        )}
      </PrimaryLayout>
    </>
  );
}
