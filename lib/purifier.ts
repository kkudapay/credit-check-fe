import DOMPurify from 'dompurify';

const purifier = DOMPurify();

purifier.setConfig({
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
});

export default purifier;
