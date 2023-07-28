import { Flex } from '@/components/layout/flex';
import { OnboardingLayout } from '@/components/layout/layouts';
import { H4, H5 } from '@/components/text/headings';
import { Title } from '@/components/head/title';
import { Card } from '@/components/layout/cards';
import Image from 'next/image';
import { Div } from '@/components/layout/utils';
import { Progress } from '@/components/forms/progress';
import { Yup } from '@/lib/yup';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik } from 'formik';
import { axiosPrivate } from '@/lib/axios';
import { Form } from '@/components/forms/form';
import { TzSelect } from '@/components/forms/select';
import { Button } from '@/components/navigation/button';
import { TagField } from '@/components/forms/taginput';
import { UploadField } from '@/components/forms/upload';
import { refreshToken } from '@/lib/user/auth';
import store from '@/redux/store';
import { useRouter } from 'next/router';

const OnboardingSchema = Yup.object().shape({
  timezone: Yup.string()
    .required('Please select a timezone')
    .min(1, 'Please select a timezone')
    .ensure(),
  profileImage: Yup.string()
    .required('Please provide a profile picture. Maximum upload size is 40MB')
    .min(1, 'Please provide a profile picture. Maximum upload size is 40MB'),
  skills: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), text: Yup.string() }))
    .required(
      "Please select some skills and tools to let us know what you're good at",
    )
    .min(3, 'Please select at least three skills or tools')
    .max(
      20,
      "Whoa there! That's a lot of skills! We want to know what you're best at, so please only provide 20 tags.",
    ),
});

export default function GetStarted() {
  const router = useRouter();
  return (
    <>
      <Title>Get Started</Title>
      <OnboardingLayout>
        <Card
          css={{
            gridColumn: '1 / 5',
            '@sm': { gridColumn: '1 / 9' },
            '@md': { gridColumn: '2 / 12' },
            '@xl': { gridColumn: '3 / 11' },
            gap: '$7',
            padding: '$7',
          }}
        >
          <Flex gap={7}>
            <Div
              css={{
                height: '100%',
                minHeight: '600px',
                display: 'none',
                width: '0',
                position: 'relative',
                borderRadius: '$2',
                overflow: 'hidden',
                '@md': { display: 'block', width: '168px' },
                flexShrink: '0',
                flexGrow: '0',
              }}
            >
              <Image
                fill
                style={{ objectFit: 'cover' }}
                alt=""
                src="/img/onboarding/onboarding3.jpg"
              />
            </Div>
            <Flex column css={{ flexGrow: '1', width: '100%' }}>
              <Progress progress={75} />
              <H4>Your Profile</H4>
              <Formik
                initialValues={{
                  skills: [],
                  timezone: undefined,
                  profileImage: '',
                }}
                validationSchema={OnboardingSchema}
                onSubmit={async (values, actions) => {
                  actions.setSubmitting(true);
                  await axiosPrivate
                    .post('user/onboarding/3', values)
                    .then(async (response) => {
                      if (response.data?.success == 'false') {
                        actions.setFieldError(
                          'timezone',
                          'Oops, something went wrong',
                        );
                      } else {
                        await store?.dispatch(refreshToken());
                        router.replace('/u/profile');
                      }
                    })
                    .catch((reason) => {
                      //TODO - error handling
                      if (reason.code == 'ERR_NETWORK') {
                        actions.setFieldError(
                          'timezone',
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
                  return (
                    <Form onSubmit={props.handleSubmit} css={{ gap: '$7' }}>
                      <Flex column>
                        <H5>Profile Picture</H5>
                        <UploadField name="profileImage" type="image" />
                      </Flex>
                      <Flex column>
                        <H5>Skills &amp; Tools</H5>
                        <span>
                          Use tags to show the skills and tools you are familiar
                          with.
                        </span>
                        <TagField name="skills" />
                      </Flex>
                      <Flex column>
                        <H5>Timezone</H5>
                        <TzSelect name="timezone" />
                      </Flex>
                      <Flex css={{ flexDirection: 'row-reverse' }}>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            props.submitForm();
                          }}
                          href="#"
                          disabled={props.isSubmitting}
                        >
                          Next
                        </Button>
                      </Flex>
                    </Form>
                  );
                }}
              </Formik>
            </Flex>
          </Flex>
        </Card>
      </OnboardingLayout>
    </>
  );
}
