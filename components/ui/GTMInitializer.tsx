'use client';

import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  gtmId: 'GTM-NXM6KRVX', 
};

export default function GTMInitializer() {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return null;
}