import DOMPurify from 'dompurify';

const sanitizer = DOMPurify.sanitize;


const purifier = (htmlContent: string) => {
return sanitizer(htmlContent,
  {
    ADD_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  })
};

export default purifier;
