import { Title } from '@/components/head/title';
import { AdminLayout } from '@/components/layout/layouts';
import { axiosPrivate } from '@/lib/axios';
import { FormButton, TertiaryFormButton } from '@revolancer/ui/buttons';
import {
  Feedback,
  Form,
  InputInner,
  InputOuter,
  Radio,
  RadioItem,
} from '@revolancer/ui/forms';
import { Flex, FullWidth } from '@revolancer/ui/layout';
import { RevoModal } from '@revolancer/ui/modals';
import { Crumb, CrumbBar } from '@revolancer/ui/navigation';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H1, H4, H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import { useCallback, useState } from 'react';

export default function BulkEmails() {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [emailType, setEmailType] = useState<'1' | '2' | ''>('');

  const toggle = useCallback(() => setOpen(!open), [open]);

  const handleClose = (close: () => void) => {
    close();
    toggle();
  };

  const handleSubmit = (close: () => void) => {
    sendEmails();
    handleClose(close);
  };

  //Add axios request here
  const sendEmails = () => {
    console.log('emails sent!');
  };

  //Add return template id error if response 404
  const validateData = (values: { templateId: string; emailType: string }) => {
    const errors: { templateId: string; emailType: string } = {
      templateId: '',
      emailType: '',
    };
    if (!values?.templateId) {
      errors.templateId = 'Please enter a Sendgrid template ID.';
    } else if (values?.templateId !== 'hello') {
      errors.templateId = 'Invalid template ID format.';
    }
    if (!values?.emailType) {
      errors.emailType = 'Email type must be chosen';
    }
    if (errors.templateId || errors.emailType) return errors;
    return {};
  };

  return (
    <>
      <Title>Bulk Emails</Title>
      <AdminLayout roles={['admin']}>
        <CrumbBar>
          <Crumb href="#">Admin</Crumb>
          <Crumb href="/admin/bulk-email" active>
            Bulk Email Sending
          </Crumb>
        </CrumbBar>
        <FullWidth>
          <Flex column gap={7} css={{ maxWidth: '66%' }}>
            <H1>Bulk Emails</H1>
            <Flex column gap={3}>
              <H5>Sending Emails</H5>
              <P>
                To send bulk emails, provide a Sendgrid email template ID and
                choose the email type.
              </P>
            </Flex>
            <Formik
              initialValues={{
                templateId: templateId,
                emailType: emailType,
              }}
              validate={(values) => validateData(values)}
              onSubmit={({ templateId, emailType }, { setSubmitting }) => {
                setSubmitting(true);
                setTemplateId(templateId);
                setEmailType(emailType);
                toggle();
                setSubmitting(false);
              }}
            >
              {({ handleSubmit, handleChange, handleBlur, values, errors }) => {
                return (
                  <>
                    <Form
                      onSubmit={handleSubmit}
                      css={{ display: 'inline-block' }}
                    >
                      <Flex column gap={7}>
                        <H5>Template ID: </H5>
                        <InputOuter>
                          <InputInner
                            placeholder="Sendgrid Template ID"
                            name="templateId"
                            value={values.templateId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputOuter>
                        {errors.templateId && errors.templateId !== '' && (
                          <Feedback state="error">{errors.templateId}</Feedback>
                        )}
                        <H5>Email Type:</H5>
                        <Radio
                          id="emailType"
                          name="emailType"
                          defaultValue="none"
                          value={values.emailType}
                        >
                          <RadioItem value="1" label="Revolancer email" />
                          <RadioItem
                            value="2"
                            label="Revolancer's partner email"
                          />
                        </Radio>
                        {errors.emailType && errors.emailType !== '' && (
                          <Feedback state="error">{errors.emailType}</Feedback>
                        )}
                        <FormButton type="submit">Send Email</FormButton>
                      </Flex>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Flex>
          <RevoModal
            showCloseIcon
            openOnTrigger={open}
            css={{
              minWidth: '33%',
              height: '50vh',
            }}
            renderChildren={({ close }) => {
              return (
                <Flex
                  column
                  css={{
                    padding: '0px 12px 20px',
                  }}
                >
                  <P css={{ fontSize: '$body1', fontWeight: '$bold' }}>
                    Email summary
                  </P>
                  <P css={{ fontSize: '$body1' }}>Template ID:</P>
                  <P>{templateId}</P>
                  <P css={{ fontSize: '$body1' }}>Type:</P>
                  <P>
                    {emailType === '1'
                      ? 'Revolancer email'
                      : "Revolancer's partner email"}
                  </P>
                  <Feedback state="error">
                    This action cannot be undone.
                  </Feedback>
                  <Flex css={{ alignItems: 'center' }} gap={6}>
                    <FormButton
                      size="small"
                      onClick={() => handleSubmit(close)}
                    >
                      Send
                    </FormButton>
                    <TertiaryFormButton
                      css={{ fontSize: '$body1' }}
                      onClick={() => handleClose(close)}
                    >
                      Cancel
                    </TertiaryFormButton>
                  </Flex>
                </Flex>
              );
            }}
          />
        </FullWidth>
      </AdminLayout>
    </>
  );
}
