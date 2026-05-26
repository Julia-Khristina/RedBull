export class UploadView {
  render() {
    return `
      <section class="panel">
        <div class="toolbar">
          <div>
            <h1>Leitor de painel de esteira</h1>
            <p>Envie uma imagem para aplicar o template automatico e executar OCR local.</p>
          </div>
        </div>
        <label class="dropzone">
          <input type="file" accept="image/*" data-role="image-input" />
          <span>Selecionar imagem</span>
        </label>
      </section>
    `;
  }

  bind(container, handlers) {
    container.querySelector("[data-role='image-input']").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) handlers.onFile(file);
    });

  }
}
