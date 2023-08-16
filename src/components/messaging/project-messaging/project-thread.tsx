import { axiosPrivate } from '@/lib/axios';
import { Project, ProjectMessage, UserProfileData } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { LabelledDivider } from '../../layout/divider';
import { Div } from '../../layout/utils';
import { ProjectMessageInput } from './message-input';
import { DateTime } from 'luxon';
import store from '@/redux/store';
import { MessageAuthor } from '../message-author';
import { P } from '@/components/text/text';
import { TertiaryButton } from '@revolancer/ui/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import Linkify from 'linkify-react';
import { renderLinksInMessages } from '../util-functions-for-messaging';

export const ProjectThread = ({ projectId }: { projectId: string }) => {
  const [project, setProject] = useState<Project>();
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [myProfile, setMyProfile] = useState<UserProfileData>();
  const [myId, setMyId] = useState('');
  const [theirProfile, setTheirProfile] = useState<UserProfileData>();
  const [messagesEnd, setMessagesEnd] = useState<HTMLDivElement>();
  const scrollToBottom = useCallback(() => {
    if (messagesEnd) messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEnd]);

  const loadProject = useCallback(() => {
    axiosPrivate
      .get(`projects/${projectId}`)
      .then((response) => {
        if ((response?.data ?? null) != null) {
          if ((response?.data?.id ?? '') !== '') {
            setProject(response.data);
            console.log(response.data);
          }
        }
      })
      .catch((err) => {});
  }, [projectId]);

  const loadActiveThread = useCallback(() => {
    if (projectId == '') return;
    axiosPrivate
      .get(`projects/${projectId}/messages`, {
        id: `project-threads-${projectId}`,
        cache: {
          ttl: 20 * 1000,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.length != messages.length) {
          scrollToBottom();
          setMessages(data);
        }
      })
      .catch((err) => setMessages([]));
  }, [projectId, messages, scrollToBottom]);

  const loadProfiles = useCallback(() => {
    if (!project) return;
    const self = store?.getState()?.userData?.user?.id ?? '';
    if (self == '') return;
    setMyId(self);
    const otherId =
      project?.contractor.id == self
        ? project.client.id
        : project?.contractor.id;
    axiosPrivate
      .get(`user/profile/by_id/${otherId}`)
      .then((res) => res.data)
      .then((data) => {
        if ((data?.id ?? false) === false) {
          setTheirProfile(undefined);
        } else {
          setTheirProfile(data);
        }
      })
      .catch((err) => {
        setTheirProfile(undefined);
      });
    axiosPrivate
      .get(`user/profile/by_id/${self}`)
      .then((res) => res.data)
      .then((data) => {
        if ((data?.id ?? false) === false) {
          setMyProfile(undefined);
        } else {
          setMyProfile(data);
        }
      })
      .catch((err) => {
        setMyProfile(undefined);
      });
  }, [project]);

  useEffect(() => {
    loadProject();
    loadProfiles();
    loadActiveThread();
    scrollToBottom();
    const refreshActiveThread = setInterval(loadActiveThread, 20 * 1000);
    return () => {
      clearInterval(refreshActiveThread);
    };
  }, [loadActiveThread, loadProfiles, loadProject, projectId, scrollToBottom]);

  const sendReadReceipt = async (id: string) => {
    axiosPrivate.post(`projects/message/acknowledge/${id}`).catch((err) => {});
  };

  const renderMessageArray = () => {
    const rendered = [];
    let lastSender = '';
    let lastTime = DateTime.fromMillis(0);
    let now = DateTime.now().toLocal();
    if (project?.proposal) {
      //Insert proposal as first message
      const proposalTime = DateTime.fromISO(project.proposal.created_at ?? '');
      if (proposalTime.plus({ days: 180 }) < now) {
        rendered.push(
          <LabelledDivider
            label={proposalTime
              .toLocal()
              .startOf('day')
              .toFormat('cccc, LLLL d yyyy')}
            key={`divider-${project.proposal.id}`}
          />,
        );
      } else {
        rendered.push(
          <LabelledDivider
            label={proposalTime
              .toLocal()
              .startOf('day')
              .toFormat('cccc, LLLL d')}
            key={`divider-${project.proposal.id}`}
          />,
        );
      }
      if (theirProfile && theirProfile.user?.id == project.contractor.id) {
        rendered.push(
          <MessageAuthor
            profile={theirProfile}
            time={proposalTime}
            key={`authorchip-${project.proposal.id}`}
          />,
        );
      } else if (myProfile && myProfile.user?.id == project.contractor.id) {
        rendered.push(
          <MessageAuthor
            profile={myProfile}
            time={proposalTime}
            key={`authorchip-${project.proposal.id}`}
          />,
        );
      }
      lastTime = proposalTime;
      //Actual proposal body
      rendered.push(
        project.proposal.message.split('\n').map(function (item, idx) {
          return (
            <span key={`${project.proposal.id}-${idx}`}>
              {item}
              <br />
            </span>
          );
        }),
      );
    }
    for (const message of messages) {
      if (!message.read && myId && message.user.id != myId) {
        sendReadReceipt(message.id);
      }
      const thisTime = DateTime.fromISO(message.created_at);
      //Divider for date
      if (lastTime.startOf('day') < thisTime.startOf('day')) {
        if (thisTime.plus({ days: 180 }) < now) {
          rendered.push(
            <LabelledDivider
              label={thisTime
                .toLocal()
                .startOf('day')
                .toFormat('cccc, LLLL d yyyy')}
              key={`divider-${message.id}`}
            />,
          );
        } else {
          rendered.push(
            <LabelledDivider
              label={thisTime.toLocal().startOf('day').toFormat('cccc, LLLL d')}
              key={`divider-${message.id}`}
            />,
          );
        }
      }
      //Sender chip
      if (
        lastTime.startOf('day') < thisTime.startOf('day') ||
        lastTime.plus({ hours: 6 }) < thisTime ||
        lastSender != message.user.id
      ) {
        if (theirProfile?.user?.id == message.user.id) {
          rendered.push(
            <MessageAuthor
              profile={theirProfile}
              time={thisTime}
              key={`authorchip-${message.id}`}
            />,
          );
        } else if (myProfile?.user?.id == message.user.id) {
          rendered.push(
            <MessageAuthor
              profile={myProfile}
              time={thisTime}
              key={`authorchip-${message.id}`}
            />,
          );
        }
      }

      //Actual message body
      rendered.push(
        message.message.split('\n').map(function (item, idx) {
          return (
            <span key={`${message.id}-${idx}`}>
              <Linkify options={{ render: renderLinksInMessages }}>
                {item}
              </Linkify>
              <br />
            </span>
          );
        }),
      );

      //attachments
      if (message.attachment) {
        rendered.push(
          <P>
            <TertiaryButton
              key={message.attachment.id}
              href={message.attachment.url}
              target="_blank"
              download={message.attachment.filename}
              normalCase
            >
              <FontAwesomeIcon icon={faPaperclip} />
              {message.attachment.filename}
            </TertiaryButton>
          </P>,
        );
      }

      lastTime = thisTime;
      lastSender = message.user.id;
    }
    return rendered;
  };

  return (
    <>
      <Div css={{ flexGrow: '1', overflowY: 'auto', maxHeight: '50vh' }}>
        {renderMessageArray()}
        <div style={{ position: 'relative' }}>
          <div
            style={{ position: 'absolute', top: '0.1rem' }}
            ref={(el) => {
              if (el) setMessagesEnd(el);
            }}
          ></div>
        </div>
      </Div>
      {project?.status !== 'complete' && (
        <ProjectMessageInput projectId={projectId} refresh={loadActiveThread} />
      )}
    </>
  );
};
