import { Feedback } from '@/components/forms/feedback';
import { Form } from '@/components/forms/form';
import {
  Checkbox,
  InputInner,
  InputOuter,
  PasswordReveal,
} from '@/components/forms/input';
import { Turnstile } from '@/components/forms/turnstile';
import { Title } from '@/components/head/title';
import { Card } from '@/components/layout/cards';
import { Flex } from '@/components/layout/flex';
import { LoginLayout } from '@/components/layout/layouts';
import {
  FormButton,
  Link,
  TertiaryButton,
} from '@/components/navigation/button';
import { SuccessModal } from '@/components/modals/success-modal';
import { H4 } from '@/components/text/headings';
import { P } from '@/components/text/text';
import { axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { useAppSelector } from '@/redux/store';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please provide a valid email address')
    .required('Please provide a valid email address'),
});

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);
  const [turnstileResponse, setTurnstileResponse] = useState('');
  const router = useRouter();
  const authed = useAppSelector((state) => state.userData.user != null);
  if (authed) {
    router.replace('/');
  }
  return (
    <>
      <Title>Forgot Password</Title>
      <LoginLayout>
        <Card
          css={{
            gridColumn: '1 / 5',
            '@sm': { gridColumn: '2 / 8' },
            '@md': { gridColumn: '3 / 11' },
            '@xl': { gridColumn: '4 / 10' },
            gap: '$7',
            padding: '$7',
          }}
        >
          <H4 css={{ textAlign: 'center' }}>Forgot your password?</H4>
          <P>Enter your email address to reset your account password.</P>
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              (values as any).turnstileResponse = turnstileResponse;
              await axiosPublic
                .post('auth/reset_password/request', values)
                .then((response) => {
                  setSuccess(true);
                })
                .catch((reason) => {
                  if (reason.code == 'ERR_NETWORK') {
                    actions.setFieldError('email', 'Something went wrong');
                  } else {
                    const statuscode = Number(reason?.response?.status);
                    switch (statuscode) {
                      case 404:
                        actions.setFieldError(
                          'email',
                          "We couldn't find an account matching that email address",
                        );
                        break;
                      case 429:
                        actions.setFieldError(
                          'email',
                          "Whoa there! You're doing that a lot. Try again later.",
                        );
                        break;
                      default:
                        console.log(reason);
                        break;
                    }
                  }
                });
              actions.setSubmitting(false);
            }}
          >
            {(props) => {
              return (
                <Form onSubmit={props.handleSubmit} css={{ gap: '$7' }}>
                  <Flex column gap="3">
                    <InputOuter
                      error={props.touched.email && !!props.errors.email}
                    >
                      <InputInner
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        aria-label="Email"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.email}
                      ></InputInner>
                    </InputOuter>
                    {props.touched.email && props.errors.email && (
                      <Feedback state="error">{props.errors.email}</Feedback>
                    )}
                  </Flex>
                  <Flex css={{ justifyContent: 'center' }}>
                    <Turnstile
                      onSuccess={(token) => setTurnstileResponse(token)}
                      onError={() => {
                        setTurnstileResponse('');
                      }}
                    />
                  </Flex>
                  <FormButton type="submit" disabled={props.isSubmitting}>
                    Reset Password
                  </FormButton>
                  <P css={{ textAlign: 'center', color: '$neutral600' }}>
                    Don&rsquo;t need to reset your password?{' '}
                    <Link href="/login">Log in.</Link>
                  </P>
                  {success && (
                    <SuccessModal
                      successMessage="We have sent an email to reset your password"
                      onClose={() => {
                        setSuccess(false);
                      }}
                    />
                  )}
                </Form>
              );
            }}
          </Formik>
        </Card>
      </LoginLayout>
    </>
  );
}
