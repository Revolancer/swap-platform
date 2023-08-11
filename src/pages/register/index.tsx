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
import { FormButton, Link, TertiaryButton } from '@revolancer/ui/buttons';
import { H4 } from '@/components/text/headings';
import { P } from '@/components/text/text';
import { axiosPublic } from '@/lib/axios';
import { AppState } from '@/lib/types';
import { afterRegister, updateEmail, updatePassword } from '@/lib/user/auth';
import { Yup } from '@/lib/yup';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { hasCookie, getCookie } from 'cookies-next';

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please provide a valid email address')
    .required('Please provide a valid email address'),
  password: Yup.string().password().required('Please provide a password'),
  repeatpassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  terms: Yup.bool().oneOf(
    [true],
    'You need to accept the terms and conditions and privacy policy',
  ),
});

export default function Register() {
  const router = useRouter();
  const [pwType, setPwType] = useState('password');
  const [turnstileResponse, setTurnstileResponse] = useState('');

  const dispatch = useAppDispatch();
  const authed = useAppSelector((state) => state.userData.user != null);
  const handleLogin = useCallback(
    (payload: AppState['user']) => dispatch(afterRegister(payload)),
    [dispatch],
  );

  if (authed) {
    router.replace('/');
  }

  let referrer = '';
  if (hasCookie('referrer')) {
    referrer = getCookie('referrer')?.toString() ?? '';
  }

  return (
    <>
      <Title>Register</Title>
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
          <H4 css={{ textAlign: 'center' }}>Welcome to Revolancer! 🤩</H4>
          <Formik
            initialValues={{
              email: '',
              password: '',
              repeatpassword: '',
              referrer: referrer,
              terms: false,
              marketingfirstparty: false,
              marketingthirdparty: false,
            }}
            validationSchema={RegistrationSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              updateEmail(values.email);
              updatePassword(values.password);
              const { repeatpassword: _, ...data } = values;
              (data as any).turnstileResponse = turnstileResponse;
              await axiosPublic
                .post('auth/register', data)
                .then((response) => {
                  handleLogin(response.data);
                })
                .catch((reason) => {
                  if (reason.code == 'ERR_NETWORK') {
                    actions.setFieldError('marketingthirdparty', 'err_network');
                  } else {
                    const statuscode = Number(reason?.response?.status);
                    switch (statuscode) {
                      case 409:
                        actions.setFieldError('email', 'exists');
                        break;
                      case 400:
                        actions.setFieldError(
                          'email',
                          'Please provide a valid email address',
                        );
                        break;
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
                    {props.errors.email == 'exists' ? (
                      <Feedback state="error">
                        Looks like you already have an account!{' '}
                        <TertiaryButton href="/login">
                          Click here to log in
                        </TertiaryButton>{' '}
                        or{' '}
                        <TertiaryButton href="/login">
                          Click here to reset your password
                        </TertiaryButton>
                      </Feedback>
                    ) : (
                      props.touched.email &&
                      props.errors.email && (
                        <Feedback state="error">{props.errors.email}</Feedback>
                      )
                    )}
                    <InputOuter
                      error={props.touched.password && !!props.errors.password}
                    >
                      <InputInner
                        type={pwType}
                        name="password"
                        id="password"
                        placeholder="Password"
                        aria-label="Password"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.password}
                      ></InputInner>
                      <PasswordReveal
                        revealed={pwType == 'text'}
                        onClick={() => {
                          pwType == 'text'
                            ? setPwType('password')
                            : setPwType('text');
                        }}
                      />
                    </InputOuter>
                    {props.touched.password && props.errors.password && (
                      <Feedback state="error">{props.errors.password}</Feedback>
                    )}
                    <InputOuter
                      error={
                        props.touched.repeatpassword &&
                        !!props.errors.repeatpassword
                      }
                    >
                      <InputInner
                        type={pwType}
                        name="repeatpassword"
                        id="repeatpassword"
                        placeholder="Confirm Password"
                        aria-label="Confirm Password"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.repeatpassword}
                      ></InputInner>
                      <PasswordReveal
                        revealed={pwType == 'text'}
                        onClick={() => {
                          pwType == 'text'
                            ? setPwType('password')
                            : setPwType('text');
                        }}
                      />
                    </InputOuter>
                    {props.touched.repeatpassword &&
                      props.errors.repeatpassword && (
                        <Feedback state="error">
                          {props.errors.repeatpassword}
                        </Feedback>
                      )}
                    <Checkbox
                      id="terms"
                      name="terms"
                      required
                      checked={props.values.terms}
                    >
                      I accept the{' '}
                      <Link
                        href="https://revolancer.com/terms-and-conditions"
                        target="_blank"
                        rel="nofollow"
                      >
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="https://revolancer.com/privacy-policy"
                        target="_blank"
                        rel="nofollow"
                      >
                        Privacy Policy
                      </Link>
                    </Checkbox>
                    {props.touched.terms && props.errors.terms && (
                      <Feedback state="error">{props.errors.terms}</Feedback>
                    )}
                    <Checkbox
                      id="marketingfirstparty"
                      name="marketingfirstparty"
                      checked={props.values.marketingfirstparty}
                    >
                      I would like to receive updates about Revolancer
                    </Checkbox>
                    {props.touched.marketingfirstparty &&
                      props.errors.marketingfirstparty && (
                        <Feedback state="error">
                          {props.errors.marketingfirstparty}
                        </Feedback>
                      )}
                    <Checkbox
                      id="marketingthirdparty"
                      name="marketingthirdparty"
                      checked={props.values.marketingthirdparty}
                    >
                      I would like to receive updates about Revolancer&rsquo;s
                      partners
                    </Checkbox>
                    {props.errors.marketingthirdparty == 'err_network' ? (
                      <Feedback state="error">
                        Looks like the site is experiencing heavy traffic right
                        now. Please try again, or if the issue continues, check
                        our
                        <TertiaryButton
                          href="https://status.revolancer.com/"
                          rel="nofollow"
                          target="_blank"
                        >
                          status page
                        </TertiaryButton>{' '}
                        for updates.
                      </Feedback>
                    ) : (
                      props.touched.marketingthirdparty &&
                      props.errors.marketingthirdparty && (
                        <Feedback state="error">
                          {props.errors.marketingthirdparty}
                        </Feedback>
                      )
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
                  <input
                    type="hidden"
                    name="referrer"
                    value={props.values.referrer}
                  />
                  <FormButton type="submit" disabled={props.isSubmitting}>
                    Register
                  </FormButton>
                  <P css={{ textAlign: 'center' }}>
                    Already have an account? <Link href="/login">Log in.</Link>
                  </P>
                </Form>
              );
            }}
          </Formik>
        </Card>
      </LoginLayout>
    </>
  );
}
