import type { PageLoad } from './$types';
 
export const load: PageLoad = ({ params }) => {
  

  return {
    post: {
      title: `Title for ${params.projectId} goes here`,
      content: `Content for ${params.projectId} goes here`
    }
  };
}