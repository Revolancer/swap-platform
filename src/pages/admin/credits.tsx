import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { Button } from '@revolancer/ui/buttons';
import { axiosPrivate } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Formik } from 'formik';
import { Form } from '@/components/forms/form';
import { useState } from 'react';
import { SuccessModal } from '@/components/modals/success-modal';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { H5 } from '@revolancer/ui/text';
import { InputInner, InputOuter, Feedback } from '@revolancer/ui/forms';

const CreditsSchema = Yup.object().shape({
  recipient: Yup.string().required(),
  reason: Yup.string().required(),
  amount: Yup.number().integer().required().max(100000).min(-100000),
});

export default function Settings() {
  const [success, setSuccess] = useState(false);
  return (
    <>
      <Title>Add or Remove Credits</Title>
      <AdminLayout>
        <CrumbBar>
          <Crumb href="/admin">Admin</Crumb>
          <Crumb href="/admin/credits" active>
            Credits
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Formik
            initialValues={{
              recipient: '',
              reason: '',
              amount: 0,
            }}
            validationSchema={CreditsSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              await axiosPrivate
                .post('admin/user/credits', values)
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
                      <H5>Recipient username or ID</H5>
                      <InputOuter
                        error={
                          props.touched.recipient && !!props.errors.recipient
                        }
                      >
                        <InputInner
                          type="text"
                          name="recipient"
                          id="recipient"
                          placeholder="Recipient"
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
                    <Flex column>
                      <H5>Reason</H5>
                      <InputOuter
                        error={props.touched.reason && !!props.errors.reason}
                      >
                        <InputInner
                          type="text"
                          name="reason"
                          id="reason"
                          placeholder="Reason for credit log"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.reason}
                        ></InputInner>
                      </InputOuter>
                      {props.touched.reason && props.errors.reason && (
                        <Feedback state="error">{props.errors.reason}</Feedback>
                      )}
                    </Flex>
                    <Flex column>
                      <H5>Amount of credits</H5>
                      <InputOuter
                        error={props.touched.amount && !!props.errors.amount}
                      >
                        <InputInner
                          type="number"
                          name="amount"
                          id="amount"
                          placeholder="1000"
                          max={100000}
                          min={-100000}
                          step={1}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.amount}
                        ></InputInner>
                      </InputOuter>
                      {props.touched.amount && props.errors.amount && (
                        <Feedback state="error">{props.errors.amount}</Feedback>
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
                  {success && (
                    <SuccessModal
                      successMessage="Credits have been granted"
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
