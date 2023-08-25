import { Title } from '@/components/head/title';
//import { Flex } from '@/components/layout/flex';
import { AdminLayout } from '@/components/layout/layouts';
import { Button } from '@revolancer/ui/buttons';
//import { H5 } from '@/components/text/headings';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Formik } from 'formik';
import { Form } from '@/components/forms/form';
import { useEffect, useState } from 'react';
//import { InputInner, InputOuter } from '@/components/forms/input';
//import { Feedback } from '@/components/forms/feedback';
import { Div } from '@/components/layout/utils';
//import { FullWidth } from '@/components/layout/columns';
import { styled } from '@revolancer/ui';
import { Tag } from '@/lib/types';
//import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
//import { Crumb } from '@/components/navigation/crumbs/crumb';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { Feedback, InputInner, InputOuter } from '@revolancer/ui/forms';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

const NewTagSchema = Yup.object().shape({
  text: Yup.string().required(),
  parent: Yup.string(),
});

const TH = styled('th', { border: '1px solid black', padding: '$1' });
const TD = styled('td', { border: '1px solid black', padding: '$1' });

export default function Settings() {
  const [tags, setTags] = useState<Tag[]>([]);

  const loadTags = async () => {
    await axiosPublic
      .get('tags/with_parents')
      .then((response) => setTags(response.data ?? []))
      .catch((err) => setTags([]));
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <>
      <Title>Tags</Title>
      <AdminLayout>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/tags" active>
            Manage Tags
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Formik
            initialValues={{
              text: '',
              parent: '',
            }}
            validationSchema={NewTagSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              await axiosPrivate
                .put('tags', values)
                .then(async (response) => {
                  if (response.data?.success == 'false') {
                    actions.setFieldError(
                      'parent',
                      'Oops, something went wrong',
                    );
                  } else {
                    actions.resetForm();
                    loadTags();
                  }
                })
                .catch((reason) => {
                  //TODO - error handling
                  if (reason.code == 'ERR_NETWORK') {
                    actions.setFieldError(
                      'parent',
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
              actions.setSubmitting(false);
            }}
          >
            {(props) => {
              const setParent = (id: string) => {
                props.setFieldValue('parent', id);
              };

              const deleteTag = async (id: string) => {
                await axiosPrivate.delete(`tags/${id}`);
                props.resetForm();
                loadTags();
              };

              const rows = () => {
                const rendered = [];
                for (const tag of tags) {
                  rendered.push(
                    <tr key={tag.id}>
                      <TD>
                        <a id={tag.id} />
                        <Button
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setParent(tag.id);
                          }}
                        >
                          {tag.text}
                        </Button>
                      </TD>
                      <TD>{tag.id}</TD>
                      <TD>
                        {tag.parent == null ? (
                          'None'
                        ) : (
                          <a href={`#${tag.parent.id}`}>{tag.parent?.text}</a>
                        )}
                      </TD>
                      <TD>
                        <Button
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTag(tag.id);
                          }}
                        >
                          Delete
                        </Button>
                      </TD>
                    </tr>,
                  );
                }
                return rendered;
              };
              return (
                <>
                  <Form onSubmit={props.handleSubmit} css={{ gap: '$7' }}>
                    <Flex column>
                      <H5>Tag</H5>
                      <InputOuter
                        error={props.touched.text && !!props.errors.text}
                      >
                        <InputInner
                          type="text"
                          name="text"
                          id="name"
                          placeholder="Tag Name"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.text}
                        ></InputInner>
                      </InputOuter>
                      {props.touched.text && props.errors.text && (
                        <Feedback state="error">{props.errors.text}</Feedback>
                      )}
                    </Flex>
                    <Flex column>
                      <H5>Parent ID</H5>
                      <InputOuter
                        error={props.touched.parent && !!props.errors.parent}
                      >
                        <InputInner
                          type="text"
                          name="parent"
                          id="parent"
                          placeholder="Tag Parent ID"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.parent}
                        ></InputInner>
                      </InputOuter>
                      {props.touched.parent && props.errors.parent && (
                        <Feedback state="error">{props.errors.parent}</Feedback>
                      )}
                    </Flex>
                    <Flex css={{ flexDirection: 'row-reverse' }}>
                      <Button
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          props.submitForm();
                        }}
                        disabled={props.isSubmitting}
                      >
                        Next
                      </Button>
                    </Flex>
                  </Form>
                  <table>
                    <thead>
                      <TH>Tag</TH>
                      <TH>ID</TH>
                      <TH>Parent</TH>
                      <TH>Delete</TH>
                    </thead>
                    {rows()}
                  </table>
                </>
              );
            }}
          </Formik>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
