import { Project } from '@/lib/types';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import Link from 'next/link';
import React from 'react';

const AdminViewProject = ({ id, project }: { id: any; project: Project }) => {
  return (
    <Link
      href={`/admin/users/${id}/projects/${project.id}`}
      style={{ textDecoration: 'none' }}
    >
      <P css={{ color: '$black', margin: '$3' }}>{project.need.title}</P>
    </Link>
  );
};

export default AdminViewProject;
