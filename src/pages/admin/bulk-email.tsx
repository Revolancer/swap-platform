import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { Button, FormButton } from '@revolancer/ui/buttons';
import {
  Feedback,
  Form,
  InputInner,
  InputOuter,
  Radio,
  RadioItem,
  Select,
  SelectGroup,
  SelectItem,
} from '@revolancer/ui/forms';
import { Card, Divider, Flex, FullWidth } from '@revolancer/ui/layout';
import { ConfirmationDialog, RevoModal } from '@revolancer/ui/modals';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H1, H4, H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import { useCallback, useState } from 'react';

export default function BulkEmails() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen(!open), [open]);

  return (
    <>
      <Title>Index Management</Title>
      <AdminLayout roles={['admin']}>
        <CrumbBar>
          <Crumb href="#">Admin</Crumb>
          <Crumb href="/admin/bulk-email" active>
            Bulk Email Sending
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <H1>Bulk Emails</H1>
          <H5>Sending Emails</H5>
          <P>
            To send bulk emails provide a Sendgrid email template ID and choose
            the email type.
          </P>
          <Formik
            initialValues={{
              templateId: '',
              emailType: '',
            }}
            onSubmit={async (values, actions) => {
              toggle();
            }}
          >
            {({ handleSubmit, handleChange, values }) => {
              return (
                <>
                  <Form
                    onSubmit={handleSubmit}
                    css={{ display: 'inline-block' }}
                  >
                    <H5>Template ID: </H5>
                    <InputOuter>
                      <InputInner
                        placeholder="Sendgrid Template ID"
                        name="templateId"
                        value={values.templateId}
                        onChange={handleChange}
                      />
                    </InputOuter>
                    <H5>Email Type:</H5>
                    <Radio
                      id="emailType"
                      name="emailType"
                      defaultValue="none"
                      value={values.emailType}
                    >
                      <RadioItem value="first-party" label="Revolancer email" />
                      <RadioItem
                        value="third-party"
                        label="Revolancer's partner email"
                      />
                    </Radio>
                    <FormButton type="submit">Submit</FormButton>
                  </Form>
                  <RevoModal
                    openOnTrigger={open}
                    renderChildren={({ close }) => {
                      return (
                        <>
                          <Flex column wrap>
                            <H4>Email summary</H4>
                            <P>Template ID:</P>
                            <P>{values.templateId}</P>
                            <P>Type:</P>
                            <P>{values.emailType}</P>
                            <Feedback state="error">
                              This action cannot be undone.
                            </Feedback>
                            <FormButton
                              size="small"
                              onClick={() => {
                                close();
                              }}
                            >
                              Send
                            </FormButton>
                          </Flex>
                        </>
                      );
                    }}
                  />
                </>
              );
            }}
          </Formik>
        </FullWidth>
      </AdminLayout>
    </>
  );
}
