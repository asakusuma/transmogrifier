export interface TransmogrifierPortal extends HTMLIFrameElement {
  contentWindow: TransmogrifierWindow;
}

export interface TransmogrifierWindow extends Window {
  parent: TransmogrifierWindow;
  portal: TransmogrifierPortal;
  IS_ACTIVE: boolean;
  transmogrify: (href: string, previousPath: string) => void;
  exitPortal: (href: string) => void;
  navigateTo: (href: string) => void;
  updateUrl: (href: string) => void;
  updateChildUrl: (href: string) => void;
  isParentActive: () => boolean;
}