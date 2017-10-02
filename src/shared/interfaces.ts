export interface TransmogrifierPortal extends HTMLIFrameElement {
  contentWindow: TransmogrifierWindow;
}

export interface TransmogrifierWindow extends Window {
  transmogrify: (href: string, previousPath: string) => void;
}

export interface ParentWindow extends TransmogrifierWindow {
  updateChildUrl: (href: string) => void;
}

export interface ChildWindow extends TransmogrifierWindow {
  parent: ParentWindow;
}