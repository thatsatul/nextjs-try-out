// word-count.ts
class WordCount extends HTMLElement {
  private textarea: HTMLTextAreaElement;
  private counter: HTMLDivElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        textarea {
          width: 100%;
          height: 100px;
          font-size: 1rem;
          padding: 8px;
          box-sizing: border-box;
        }
        .counter {
          margin-top: 8px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }
      </style>
      <textarea placeholder="Type your text here..."></textarea>
      <div class="counter">Words: 0</div>
    `;

    this.textarea = shadow.querySelector('textarea') as HTMLTextAreaElement;
    this.counter = shadow.querySelector('.counter') as HTMLDivElement;

    this.onInput = this.onInput.bind(this);
  }

  connectedCallback() {
    this.textarea.addEventListener('input', this.onInput);
  }

  disconnectedCallback() {
    this.textarea.removeEventListener('input', this.onInput);
  }

  private onInput() {
    const text = this.textarea.value.trim();
    const words = text === '' ? 0 : text.split(/\s+/).length;
    this.counter.textContent = `Words: ${words}`;
  }
}

customElements.define('word-count', WordCount);
