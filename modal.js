const moduleName = 'PureModal';
const ClassName = {
  BACKDROP: 'modal-backdrop',
  OPEN: 'is-open',
  IN: 'in',
  OUT: 'out',
  DIALOG: 'modal-dialog',
}
const KeyCodes = {
  ESC: 27,
  TAB: 9,
}

const DefaultConfig = {
  transition: true,
}

const throwError = message => window.console.error(`${moduleName}: ${message}`);
const reflow = element => element.offsetHeight;

class Modal {
  constructor(id, config) {
    this.id = id;
    this.config = Object.assign({}, DefaultConfig, config);
    
    this.modal = Modal.findModal(this.id);
    this.dialog = this.modal.querySelector(`.${ClassName.DIALOG}`);

    this.backdrop = null;

    this.isOpen = false;
    this.isInit = false;

    this.triggers = Modal.findTriggers(this.id);
    this.closeEls = null;
    
    this.focusableEls = null;

    this.focusedElBeforeOpen = null;
    this.firstFocusableEl = null;
	  this.lastFocusableEl = null;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  init() {
    if (this.isInit) {
      throwError('Event listeners already added.');
      return;
    }

    this.triggers.forEach(trigger =>  trigger.addEventListener('click', this.open));

    this.isInit = true;
  }

  destroy() {
    if (!this.isInit) {
      throwError('Event listeners already removed.');
      return;
    }

    this.triggers.forEach(trigger =>  trigger.removeEventListener('click', this.open));

    this.isInit = false;
  }

  open(e) {
    e.preventDefault();
    if (typeof this.config.beforeOpen === 'function') {
      this.config.beforeOpen();
    }

    this.focusedElBeforeOpen = document.activeElement;
    this.focusableEls = [...this.dialog.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]')];
    this.firstFocusableEl = this.focusableEls[0];
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];

    this.showBackdrop();

    this.modal.style.display = 'block';

    if (this.config.transition) {
      this.modal.classList.add(ClassName.OPEN);
      this.modal.classList.add(ClassName.IN);

      this.openWithTransition();
    } else {
      this.firstFocusableEl.focus();
    }
    
    document.addEventListener('mousedown', this.onDismiss);
    document.addEventListener('keydown', this.handleKeyDown);

    this.closeEls = [...this.modal.querySelectorAll('[data-dismiss="modal"]')];
    this.closeEls.forEach(button => button.addEventListener('click', this.close));

    this.isOpen = true;

    if (typeof this.config.onOpen === 'function') {
      this.config.onOpen();
    }
  }

  openWithTransition() {
    const openTransitionHandler = () => {
      this.dialog.removeEventListener('animationend', openTransitionHandler);
      
      this.firstFocusableEl.focus();

      if (typeof this.config.onOpen === 'function') {
        this.config.onOpen();
      }
    };
    this.dialog.addEventListener('animationend', openTransitionHandler);
  }

  close() {
    if (typeof this.config.beforeClose === 'function') {
      this.config.beforeClose();
    }

    if (this.config.transition) {
      this.modal.classList.remove(ClassName.IN);
      this.modal.classList.remove(ClassName.OPEN);
      this.modal.classList.add(ClassName.OUT);
      this.closeWithTransition();
      this.closeBackdrop();
    } else {
      this.modal.style.display = 'none';
      this.modal.classList.remove(ClassName.OPEN);
      this.closeBackdrop();
      if (typeof this.config.onClose === 'function') {
        this.config.onClose();
      }
    }

    document.removeEventListener('mousedown', this.onDismiss);
    document.removeEventListener('keydown', this.handleKeyDown);

    this.closeEls.forEach(button => button.removeEventListener('click', this.close));

    this.isOpen = false;

    this.focusedElBeforeOpen.focus();
  }

  closeWithTransition() {
    const closeTransitionHandler = () => {
      this.dialog.removeEventListener('animationend', closeTransitionHandler);
      this.modal.style.display = 'none';
      this.modal.classList.remove(ClassName.OUT);

      if (typeof this.config.onClose === 'function') {
        this.config.onClose();
      }
    };
    this.dialog.addEventListener('animationend', closeTransitionHandler);
  }

  onDismiss(e) {
    if (!this.dialog.contains(e.target) && this.isOpen) {
      this.close();
    }
  }

  showBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.tabIndex = -1;
    this.backdrop.classList.add(ClassName.BACKDROP);

    if (this.config.transition) {
      this.backdrop.classList.add(ClassName.IN);
    }

    document.body.appendChild(this.backdrop);

    // force reflow 
    reflow(this.backdrop);

    this.backdrop.classList.add(ClassName.OPEN);
  }

  closeBackdrop() {
    if (this.config.transition) {
      this.backdrop.classList.remove(ClassName.IN);
      this.backdrop.classList.remove(ClassName.OPEN);
      this.backdrop.classList.add(ClassName.OUT);

      this.closeBackdropWithTransition();
    } else {
      this.backdrop.remove();
    }
  }

  closeBackdropWithTransition() {
    const removeTransitionHandler = () => {
      this.backdrop.removeEventListener('transitionend', removeTransitionHandler);
      this.backdrop.remove();
    }
    this.backdrop.addEventListener('transitionend', removeTransitionHandler);
  }

  handleKeyDown(e) {
    const handleBackwardTab = () => {
      if (document.activeElement === this.firstFocusableEl) {
        e.preventDefault();
        this.lastFocusableEl.focus();
      }
    }

    const handleForwardTab = () => {
      if (document.activeElement === this.lastFocusableEl) {
        e.preventDefault();
        this.firstFocusableEl.focus();
      }
    }
  
    switch(e.keyCode) {
      case KeyCodes.TAB:
        if (this.focusableEls.length === 1) {
          e.preventDefault();
          break;
        } 
        if (e.shiftKey) {
          handleBackwardTab();
        } else {
          handleForwardTab();
        }
        break;
      case KeyCodes.ESC:
        this.close();
        break;
      default:
        break;
    }
  };

  static findTriggers(id) {
    return [...document.querySelectorAll(`[data-toggle="modal"][data-target="${id}"]`)];
  }

  static findModal(id) {
    return document.getElementById(id);
  }
}
