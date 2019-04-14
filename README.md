<img width="100" height="100" src="https://i.imgur.com/mfvfVlh.png" />

# Pure-modal
A lightweight, accessible, vanilla JavaScript modal component. 

## Demo and documentation
https://romanslonov.github.io/pure-modal/

## Basic usage
#### 1. Add modal markup on your page and give it unique ID.

```html
<div class="modal" id="modal1" role="dialog" aria-labelledby="modal-1" aria-describedby="basic-modal" tabindex="-1" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title 1</h5>
                <button type="button" class="modal-close" data-dismiss="modal" aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 40 40">
                        <path stroke-linecap="round" class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" stroke="#000" fill="transparent" stroke-width="5"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                Content of modal 1
            </div>
            <div class="modal-footer">
                <div class="mr-xs">
                    <button data-dismiss="modal" aria-label="Close">Close</button>
                </div>
                <button>Save changes</button>
            </div>
        </div>
    </div>
</div>
```

#### 2. Init modal instance and pass unqiue ID of your modal.
```javascript
const modal1 = new Modal('modal1');
modal1.init();
```

#### 3. Add trigger to open the modal.
```html
<button data-toggle="modal" data-target="modal1">Modal 1</button>
```

### Done! 🎉

## API

### Options
| Name             |type            | Default        | Description
| -----------------|----------------|----------------|-------------
| transition       | Boolean        | true           | Initialize PureModal instance. Add event listeners. 
| beforeOpen       | Function       | null           | A callback that will be called before opening the modal.
| onOpen           | Function       | null           | A callback that will be called after the modal is fully opened.
| beforeClose      | Function       | null           | A callback that will be called before closing the modal.
| onClose          | Function       | null           | A callback that will be called after the modal is fully closed.


### Methods
| Name             | Description
| -----------------|---------------
| `init()`         | Initialize PureModal instance. Add event listeners. 
| `destroy()`      | Destroy all event listeners. Useful when building SPA.
| `open()`         | Call to open modal manually. 
| `close()`        | Call to close modal manually.
