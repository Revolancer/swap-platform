import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ManageUserLayout from '@/components/admin/user/layout';
import { H5 } from '@revolancer/ui/text';
import { axiosPrivate } from '@/lib/axios';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { Checkbox, Feedback, Form } from '@revolancer/ui/forms';
import { Formik } from 'formik';
import { Flex } from '@revolancer/ui/layout';

export default function ManageUserEmailPreferences() {
  const [prefs, setPrefs] = useState<{
    firstparty: boolean;
    thirdparty: boolean;
  }>({ firstparty: false, thirdparty: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    axiosPrivate
      .get(`admin/user/prefs/${id}`)
      .then((res) => res.data)
      .then((data) => setPrefs(data))
      .then(() => setLoading(false))
      .catch((e) => setError(true));
  }, [id]);

  return (
    <ManageUserLayout>
      <H5>Email Preferences</H5>
      {error && <>Oops, something went wrong</>}
      {loading && <SkeletonText type="h1" />}
      {!error && !loading && (
        <Formik
          initialValues={{
            marketingfirstparty: prefs.firstparty,
            marketingthirdparty: prefs.thirdparty,
          }}
          onSubmit={async (values, actions) => {
            return;
          }}
        >
          {(props) => {
            return (
              <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
                <Flex column>
                  <Checkbox
                    id="marketingfirstparty"
                    name="marketingfirstparty"
                    checked={props.values.marketingfirstparty}
                  >
                    I would like to receive updates about Revolancer
                  </Checkbox>
                  <Checkbox
                    id="marketingthirdparty"
                    name="marketingthirdparty"
                    checked={props.values.marketingthirdparty}
                  >
                    I would like to receive updates about Revolancer&rsquo;s
                    partners
                  </Checkbox>
                  <Feedback state="feedback">
                    Email preferences cannot be updated except by the user to
                    ensure compliance and validity of provided consents
                  </Feedback>
                </Flex>
              </Form>
            );
          }}
        </Formik>
      )}
    </ManageUserLayout>
  );
}
