import {
  useState,
  MouseEvent,
  KeyboardEvent,
  useEffect,
  ChangeEvent,
} from 'react';
import Modal from 'react-modal';
import { Button, TertiaryButton, UnstyledLink } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose, faTicket } from '@fortawesome/free-solid-svg-icons';
import { config as styleconfig } from '@revolancer/ui';
import { PostData, UserProfileData } from '@/lib/types';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import store from '@/redux/store';
import { Author } from '../user-posts/author';
import { Tags } from '../user-posts/tags';
import { DateTime } from 'luxon';
import { Formik, FormikProps } from 'formik';
import { Yup } from '@/lib/yup';
import { cleanBlockData } from '../user-posts/styledblockscontainer';
import Blocks from 'editorjs-blocks-react-renderer';
import { useRouter } from 'next/router';
import {
  Flex,
  Divider,
  TwoCols,
  StyledBlocksContainer,
  Div,
} from '@revolancer/ui/layout';
import { P, H4, H5 } from '@revolancer/ui/text';
import {
  Form,
  InputInner,
  InputOuter,
  TextAreaInner,
  Feedback,
} from '@revolancer/ui/forms';

const styles = styleconfig.theme;

const customStyles: Modal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: styles.radii[2],
    paddingInline: styles.sizes[6],
    paddingBlock: styles.sizes[3],
    maxWidth: 'min(640px, 85vw)',
    minWidth: '340px',
    width: '100%',
  },
};

const ProposalSchema = Yup.object().shape({
  message: Yup.string()
    .required('Please provide a message with your proposal')
    .ensure(),
  estHours: Yup.number()
    .integer('Must be a whole number of hours')
    .min(1, 'Minimum recommended time is 1 hour')
    .max(
      100,
      'We do not recommend taking on projects which will require over 100 hours to complete',
    )
    .required(),
  price: Yup.number()
    .integer('Must be a whole number of credits')
    .min(10, "We don't recommend charging less than 10 credits")
    .max(10000, 'We do not recommend charging more than 10000 credits')
    .required(),
});

export const ProposalDialog = ({
  id,
  setSuccess = (success: boolean) => {},
}: {
  id: string;
  setSuccess?: (success: boolean) => void;
}) => {
  const [postData, setPostData] = useState<PostData>();
  const [isNotFound, setNotFound] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isOwn, setIsOwn] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({});
  const [myRate, setMyRate] = useState(20);
  const [price, setPrice] = useState(40);
  const [proposalCount, setProposalCount] = useState(0);

  const router = useRouter();

  Modal.setAppElement('#__next');

  useEffect(() => {
    const loadAuthor = async (id: string) => {
      if (id !== '') {
        axiosPublic
          .get(`user/profile/by_id/${id}`)
          .then((response) => setProfile(response.data ?? {}))
          .catch(() => setProfile({}));
      }
    };

    const getUserProfileData = async () => {
      if (id != null) {
        await axiosPublic
          .get(`need/${id}`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? '') == '') {
                setNotFound(true);
              }
              setPostData(response.data);
              loadAuthor(response.data?.user?.id ?? '');
              const self = store?.getState()?.userData?.user?.id ?? 'guest';
              if ((response.data?.user?.id ?? '') == self) {
                setIsOwn(true);
              }
            }
          })
          .catch((err) => setNotFound(true));
      }
    };

    getUserProfileData();

    const getMyRate = async () => {
      if (id != null) {
        await axiosPrivate
          .get(`user/rate`)
          .then((response) => {
            if ((response?.data ?? null) != null) {
              if ((response?.data?.id ?? '') !== '') {
                setMyRate(response.data.hourly_rate);
                setPrice(response.data.hourly_rate * 2);
              }
            }
          })
          .catch((err) => setMyRate(20));
      }
    };

    getMyRate();

    const getProposalCount = async () => {
      if (id != null) {
        axiosPrivate
          .get(`need/proposals/count/${id}`)
          .then((res) => res.data)
          .then((count) => setProposalCount(count))
          .catch((err) => {});
      }
    };
    getProposalCount();
  }, [id]);

  const openModal = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const closeModal = (e?: MouseEvent<Element> | KeyboardEvent<Element>) => {
    if (e) e.preventDefault();
    setIsOpen(false);
  };

  const estimatePrice = (
    event: ChangeEvent<HTMLInputElement>,
    props: FormikProps<{
      message: string;
      estHours: number;
      price: number;
    }>,
  ) => {
    props.setFieldValue(
      'price',
      myRate * (event.target.value as unknown as number),
    );
  };

  return (
    <>
      {!isNotFound && !isOwn && (
        <>
          {proposalCount == 0 && (
            <Button href="#" onClick={openModal}>
              Apply
            </Button>
          )}
          {proposalCount > 0 && (
            <P css={{ color: '$neutral600' }}>
              <FontAwesomeIcon icon={faCheck} />
              You have submitted a proposal
            </P>
          )}

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="New Proposal"
          >
            <Flex css={{ justifyContent: 'space-between' }}>
              <H4>New Proposal</H4>
              <UnstyledLink
                href="#"
                onClick={closeModal}
                css={{ fontSize: '$h5' }}
              >
                <FontAwesomeIcon icon={faClose} />
              </UnstyledLink>
            </Flex>
            <Formik
              initialValues={{
                message: '',
                estHours: 2,
                price: price,
              }}
              validationSchema={ProposalSchema}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                await axiosPrivate
                  .put(`need/proposal/${id}`, values)
                  .then(async (response) => {
                    if (response.data?.success == 'false') {
                      actions.setFieldError(
                        'about',
                        'Oops, something went wrong',
                      );
                    } else {
                      actions.resetForm();
                      closeModal();
                      setSuccess(true);
                    }
                  })
                  .catch((reason) => {
                    //TODO - error handling
                    if (reason.code == 'ERR_NETWORK') {
                      actions.setFieldError(
                        'about',
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
                  <>
                    <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
                      <Divider />
                      <Div css={{ overflowY: 'auto', maxHeight: '60dvh' }}>
                        {postData?.user && (
                          <Author uid={postData.user?.id ?? ''} />
                        )}
                        <P css={{ fontWeight: '$bold' }}>
                          {postData?.title ?? 'Loading...'}
                        </P>
                        {postData?.tags && <Tags tags={postData.tags} />}
                        {postData?.unpublish_at && (
                          <P css={{ color: '$neutral600' }}>
                            Respond by{' '}
                            {DateTime.fromISO(postData.unpublish_at).toFormat(
                              'cccc, LLLL d',
                            )}
                          </P>
                        )}
                        {postData?.data && (
                          <StyledBlocksContainer>
                            <Blocks data={cleanBlockData(postData.data)} />
                          </StyledBlocksContainer>
                        )}
                        <Divider />
                        <Flex column>
                          <H5>
                            Your Message
                            {profile?.first_name && ` To ${profile.first_name}`}
                          </H5>
                          <InputOuter
                            error={
                              props.touched.message && !!props.errors.message
                            }
                          >
                            <TextAreaInner
                              name="message"
                              id="message"
                              placeholder="Write a message"
                              aria-label="Your message"
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.message}
                            />
                          </InputOuter>
                          {props.touched.message && props.errors.message && (
                            <Feedback state="error">
                              {props.errors.message}
                            </Feedback>
                          )}
                        </Flex>
                        <TwoCols>
                          <Flex column>
                            <H5>Estimated hours of work</H5>
                            <P>
                              We use this to help recommend a price -{' '}
                              {profile?.first_name
                                ? profile.first_name
                                : 'the client'}{' '}
                              will not see this.
                            </P>
                            <InputOuter
                              error={
                                props.touched.estHours &&
                                !!props.errors.estHours
                              }
                            >
                              <InputInner
                                type="number"
                                min={1}
                                max={100}
                                name="estHours"
                                id="estHours"
                                placeholder="How long will this take you?"
                                aria-label="How long will this take you?"
                                onChange={(e) => {
                                  props.handleChange(e);
                                  estimatePrice(e, props);
                                }}
                                onBlur={props.handleBlur}
                                value={props.values.estHours}
                              />
                            </InputOuter>
                          </Flex>
                          <Flex column>
                            <H5>Price</H5>
                            <P id="priceLabel">
                              How many credits will you complete this for?
                            </P>
                            <InputOuter
                              error={
                                props.touched.price && !!props.errors.price
                              }
                            >
                              <FontAwesomeIcon icon={faTicket} />
                              <InputInner
                                type="number"
                                min={1}
                                max={10000}
                                name="price"
                                id="price"
                                placeholder="Price"
                                aria-label="Price"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                value={props.values.price}
                                css={{ marginLeft: '$2' }}
                              />
                            </InputOuter>
                          </Flex>
                        </TwoCols>
                        {props.touched.estHours && props.errors.estHours && (
                          <Feedback state="error">
                            {props.errors.estHours}
                          </Feedback>
                        )}
                        {props.touched.price && props.errors.price && (
                          <Feedback state="error">
                            {props.errors.price}
                          </Feedback>
                        )}
                      </Div>
                      <Divider />
                      <Flex css={{ alignItems: 'center' }} gap={6}>
                        <Button
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            props.submitForm();
                          }}
                          disabled={props.isSubmitting}
                        >
                          Send
                        </Button>
                        <TertiaryButton
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            closeModal();
                          }}
                          disabled={props.isSubmitting}
                        >
                          Cancel
                        </TertiaryButton>
                      </Flex>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Modal>
        </>
      )}
    </>
  );
};
