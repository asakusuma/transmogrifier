export interface TransmogrifierPortal extends HTMLIFrameElement {
  contentWindow: TransmogrifierWindow;
}

export interface TransmogrifierWindow extends Window {
  parent: TransmogrifierWindow;
  transmogrify: (href: string, previousPath: string) => void;
  updateChildUrl: (href: string) => void;
}