export interface TransmogrifierPortal extends HTMLIFrameElement {
  contentWindow: TransmogrifierWindow;
}

export interface TransmogrifierWindow extends Window {
  parent: TransmogrifierWindow;
  portal: TransmogrifierPortal;
  IS_ACTIVE: boolean;
  routeTo: (href: string) => void;
  exitPortal: (href: string) => void;
  navigateTo: (href: string) => void;
  updateUrl: (href: string) => void;
  isParentActive: () => boolean;
}