import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Formik } from 'formik';
import { useState } from 'react';
import { SuccessModal } from '@/components/modals/success-modal';
import { ConfirmationDialog } from '@/components/navigation/confirmation-dialog';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { Form, InputInner, InputOuter, Feedback } from '@revolancer/ui/forms';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';

const CreditsSchema = Yup.object().shape({
  recipient: Yup.string().uuid().required(),
});

export default function Settings() {
  const [success, setSuccess] = useState(false);
  return (
    <>
      <Title>Delete User</Title>
      <AdminLayout roles={['admin', 'moderator']}>
        <CrumbBar>
          <Crumb href="#">Admin</Crumb>
          <Crumb href="/admin/delete" active>
            Delete User
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Formik
            initialValues={{
              recipient: '',
            }}
            validationSchema={CreditsSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              await axiosPrivate
                .delete(`admin/user/${values.recipient}`)
                .then(async (response) => {
                  if (response.data?.success == 'false') {
                    actions.setFieldError(
                      'recipient',
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
                      'recipient',
                      'Oops, something went wrong',
                    );
                  } else {
                    const statuscode = Number(reason?.response?.status);
                    switch (statuscode) {
                      default:
                        actions.setFieldError(
                          'recipient',
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
                      <H5>User ID</H5>
                      <InputOuter
                        error={
                          props.touched.recipient && !!props.errors.recipient
                        }
                      >
                        <InputInner
                          type="text"
                          name="recipient"
                          id="recipient"
                          placeholder="ID of user to delete"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.recipient}
                        ></InputInner>
                      </InputOuter>
                      {props.touched.recipient && props.errors.recipient && (
                        <Feedback state="error">
                          {props.errors.recipient}
                        </Feedback>
                      )}
                    </Flex>
                    <Flex css={{ flexDirection: 'row-reverse' }}>
                      <ConfirmationDialog
                        dangerous
                        onAccept={props.submitForm}
                        label="Delete"
                        title="Deleting User"
                        labelAccept="Delete"
                      />
                    </Flex>
                  </Form>
                  {success && (
                    <SuccessModal
                      successMessage="User has been deleted"
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
