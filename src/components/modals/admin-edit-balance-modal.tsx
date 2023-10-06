import { axiosPrivate } from '@/lib/axios';
import {
  getCreditLogs,
  getCredits,
  getReverseCreditLogs,
} from '@/lib/user/wallet';
import { useAppDispatch } from '@/redux/store';
import { FormButton } from '@revolancer/ui/buttons';
import { Feedback, Form, InputInner, InputOuter } from '@revolancer/ui/forms';
import { Card, Flex } from '@revolancer/ui/layout';
import { RevoModal as Modal } from '@revolancer/ui/modals';
import { P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import { useState } from 'react';

type Values = {
  reason: string;
  amount: number;
};

export const EditBalance = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: Values, close: () => void) => {
    await axiosPrivate
      .post(`admin/user/credits`, {
        ...values,
        amount: Number(values.amount),
        recipient: id,
      })
      .then(() => {
        dispatch(getCredits(id));
        dispatch(getCreditLogs(id));
        dispatch(getReverseCreditLogs(id));
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
    close();
  };
  return (
    <>
      <Modal
        openOnTrigger={false}
        css={{ width: '50vw' }}
        showModalOpenCTA
        renderCTA={({ open }) => (
          <FormButton role="secondary" onClick={() => open()}>
            Edit Balance
          </FormButton>
        )}
        renderChildren={({ close }) => (
          <Flex column>
            <P css={{ fontWeight: '$bold' }}>Edit Balance</P>
            <P>
              Provide a reason and specify the credit amount to add or remove
              from a user&apos;s account. Negative numbers will deduct credits.
              This action won&apos;t replace the user&apos;s current balance.
            </P>
            <Formik
              initialValues={{
                reason: '',
                amount: 0,
              }}
              onSubmit={(values) => handleSubmit(values, close)}
            >
              {({ handleSubmit, handleChange, values }) => {
                return (
                  <>
                    <Form
                      onSubmit={handleSubmit}
                      css={{ display: 'inline-block' }}
                    >
                      <P css={{ fontWeight: '$semibold' }}>Reason</P>
                      <InputOuter>
                        <InputInner
                          placeholder="Reason for credit log"
                          name="reason"
                          value={values.reason}
                          onChange={handleChange}
                        ></InputInner>
                      </InputOuter>
                      <P css={{ fontWeight: '$semibold' }}>Amount of Credits</P>
                      <InputOuter>
                        <InputInner
                          placeholder="0"
                          name="amount"
                          value={values.amount}
                          onChange={handleChange}
                        ></InputInner>
                      </InputOuter>
                      <Feedback state="error">
                        This action cannot be undone.
                      </Feedback>
                      <Flex>
                        <FormButton type="submit">Save</FormButton>
                        <FormButton role="secondary" onClick={() => close()}>
                          Cancel
                        </FormButton>
                      </Flex>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Flex>
        )}
      />
    </>
  );
};
