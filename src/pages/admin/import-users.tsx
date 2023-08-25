import { Title } from '@/components/head/title';
//import { Flex } from '@/components/layout/flex';
import { AdminLayout } from '@/components/layout/layouts';
import { Button } from '@revolancer/ui/buttons';
//import { H5 } from '@/components/text/headings';
import { axiosPrivate } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Formik } from 'formik';
import { Form } from '@/components/forms/form';
import { useState } from 'react';
import { InputInner, InputOuter } from '@/components/forms/input';
//import { Feedback } from '@/components/forms/feedback';
//import { FullWidth } from '@/components/layout/columns';
import { styled } from '@revolancer/ui';
import { SuccessModal } from '@/components/modals/success-modal';
//import { CrumbBar } from '@/components/navigation/crumbs/crumbbar';
//import { Crumb } from '@/components/navigation/crumbs/crumb';
import { UploadField } from '@/components/forms/upload';
//import { P } from '@/components/text/text';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { H5, P } from '@revolancer/ui/text';
import { Feedback } from '@revolancer/ui/forms';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

const CreditsSchema = Yup.object().shape({
  userCsv: Yup.string()
    .required('Maximum upload size is 40MB')
    .min(1, 'Maximum upload size is 40MB'),
});

export default function ImportUsers() {
  const [success, setSuccess] = useState(false);
  return (
    <>
      <Title>Import Users</Title>
      <AdminLayout>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/import-users" active>
            Import Users
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Formik
            initialValues={{
              userCsv: '',
            }}
            validationSchema={CreditsSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              await axiosPrivate
                .post('admin/user/import', values)
                .then(async (response) => {
                  if (response.data?.success == 'false') {
                    actions.setFieldError(
                      'parent',
                      'Oops, something went wrong',
                    );
                  } else {
                    actions.resetForm();
                    setSuccess(true);
                  }
                })
                .catch((reason) => {
                  if (reason.code == 'ERR_NETWORK') {
                    actions.setFieldError(
                      'amount',
                      'Oops, something went wrong',
                    );
                  } else {
                    const statuscode = Number(reason?.response?.status);
                    switch (statuscode) {
                      default:
                        actions.setFieldError(
                          'amount',
                          'Oops, something went wrong',
                        );
                    }
                  }
                });
              actions.setSubmitting(false);
            }}
          >
            {(props) => {
              return (
                <>
                  <Form onSubmit={props.handleSubmit} css={{ gap: '$7' }}>
                    <Flex column>
                      <H5>CSV File</H5>
                      <P css={{ color: '$red500' }}>
                        Caution: This is <em>only</em> to be used to import
                        users from Revolancer Classic. Do not use this form if
                        you are unsure of its purpose or function, or without
                        consulting Skye in advance.
                      </P>
                      <UploadField name="userCsv" />
                      {props.touched.userCsv && props.errors.userCsv && (
                        <Feedback state="error">
                          {props.errors.userCsv}
                        </Feedback>
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
                        Import
                      </Button>
                    </Flex>
                  </Form>
                  {success && (
                    <SuccessModal
                      successMessage="Users are being imported. Please do not resubmit the CSV file."
                      onClose={() => {
                        setSuccess(false);
                      }}
                    />
                  )}
                </>
              );
            }}
          </Formik>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
