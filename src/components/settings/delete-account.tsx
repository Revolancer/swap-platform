import { config as styleconfig } from '@revolancer/ui';
import { useState } from 'react';
import Modal from 'react-modal';
import { Buttons } from '@revolancer/ui';
const { Button, FormButton, UnstyledLink } = Buttons;
import { H4, H5 } from '../text/headings';
import { P, Span } from '../text/text';
import { Flex } from '../layout/flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Feedback } from '../forms/feedback';
import { SuccessModal } from '../modals/success-modal';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Form } from '../forms/form';
import { axiosPrivate } from '@/lib/axios';
import { InputInner, InputOuter, PasswordReveal } from '../forms/input';
import { logout } from '@/lib/user/auth';
import { useAppDispatch } from '@/redux/store';

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

const DeleteAccountSchema = Yup.object().shape({
  password: Yup.string().required('Please provide your current password'),
});

export const DeleteAccount = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pwType, setPwType] = useState('password');
  const dispatch = useAppDispatch();

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  Modal.setAppElement('#__next');
  return (
    <>
      <H5>Close Account</H5>
      <Span css={{ color: '$neutral700' }}>
        Do you want to permanently close your account?
      </Span>
      <FormButton onClick={openModal} role="dangerous">
        Close my account
      </FormButton>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          closeModal();
        }}
        style={customStyles}
        contentLabel={'Are you sure?'}
      >
        <Flex column>
          <Flex css={{ justifyContent: 'space-between' }}>
            <H4>Are you sure?</H4>
            <UnstyledLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
              css={{ fontSize: '$h5' }}
            >
              <FontAwesomeIcon icon={faClose} />
            </UnstyledLink>
          </Flex>
          <P>
            Are you sure you want to close your account?
            <br />
            All personal information associated with this account will be
            permanently deleted
            <br />
            Your current username may be used by another user in the future
          </P>
          <Feedback state="warning">
            You will not be able to recover your account. To use Revolancer in
            the future you must create a new account
          </Feedback>
          <P>To close your account, please enter your current password:</P>
          <Formik
            initialValues={{
              password: '',
            }}
            validationSchema={DeleteAccountSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              await axiosPrivate
                .post('user/delete', values)
                .then(() => {
                  actions.resetForm();
                  setSuccess(true);
                  closeModal();
                })
                .catch((reason) => {
                  if (reason.code == 'ERR_NETWORK') {
                    actions.setFieldError(
                      'password',
                      'Oops, something went wrong',
                    );
                  } else {
                    const statuscode = Number(reason?.response?.status);
                    switch (statuscode) {
                      case 401:
                        actions.setFieldError(
                          'password',
                          'Your password is incorrect',
                        );
                        break;
                      default:
                        actions.setFieldError(
                          'password',
                          'Something went wrong',
                        );
                        break;
                    }
                  }
                });
              actions.setSubmitting(false);
            }}
          >
            {(props) => {
              return (
                <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
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
                  <Flex>
                    <Button
                      role="dangerous"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        props.submitForm();
                      }}
                    >
                      Close my account
                    </Button>
                    <Button
                      role="secondary"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        closeModal();
                      }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Form>
              );
            }}
          </Formik>
        </Flex>
      </Modal>
      {success && (
        <SuccessModal
          successMessage="Your account will be deleted. You will receive an email when this has happened."
          onClose={() => {
            setSuccess(false);
            dispatch(logout());
          }}
        />
      )}
    </>
  );
};
