import { SuccessModal } from '@/components/modals/success-modal';
import { ConfirmationDialog } from '@/components/navigation/confirmation-dialog';
import { axiosPrivate } from '@/lib/axios';
import { Form } from '@revolancer/ui/forms';
import { Flex } from '@revolancer/ui/layout';
import { Formik } from 'formik';
import { useState } from 'react';

export const DeleteUserButton = ({ id }: { id: string }) => {
  const [success, setSuccess] = useState(false);
  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .delete(`admin/user/${id}`)
          .then(async (response) => {
            if (response.data?.success == 'false') {
            } else {
              actions.resetForm();
              setSuccess(true);
            }
          })
          .catch((reason) => {
            if (reason.code == 'ERR_NETWORK') {
              console.log(reason);
            } else {
              const statuscode = Number(reason?.response?.status);
              switch (statuscode) {
                default:
                  console.log(reason);
              }
            }
          });
        actions.setSubmitting(false);
      }}
    >
      {(props) => {
        return (
          <>
            <Form
              onSubmit={props.handleSubmit}
              css={{ display: 'inline-block' }}
            >
              <ConfirmationDialog
                dangerous
                onAccept={props.submitForm}
                label="Delete User"
                title="Deleting User"
                confirmationMessage="Are you sure you wish to delete this user? This action cannot be reversed"
                labelAccept="Delete"
              />
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
  );
};
