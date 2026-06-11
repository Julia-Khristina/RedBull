// [D1] Padrão: verificação de autenticação + ativação de menu
document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;

  // [A1] RN03 — Redirecionar para login se não autenticado (exceto na própria página de login)
  // [D1] Proteção client-side — o backend deve ter middleware próprio para segurança real
  if (path !== '/admin/login') {
    const token = sessionStorage.getItem('rb24_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
  }

  // Login page 
  if (path === '/admin/login') {
    sessionStorage.removeItem('rb24_token');
    sessionStorage.removeItem('rb24_user');

    const form          = document.getElementById('login-form');
    const emailInput    = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn     = document.getElementById('login-submit');
    const errorEl       = document.getElementById('login-error');
    const toggleBtn     = document.getElementById('toggle-password');
    const iconEye       = document.getElementById('icon-eye');
    const iconEyeOff    = document.getElementById('icon-eye-off');

    if (form && emailInput && passwordInput && submitBtn && errorEl && toggleBtn && iconEye && iconEyeOff) {
      toggleBtn.addEventListener('click', function () {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        iconEye.style.display    = isPassword ? 'none' : '';
        iconEyeOff.style.display = isPassword ? '' : 'none';
      });

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        errorEl.classList.remove('visible');
        errorEl.textContent = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';

        try {
          const res = await fetch('/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: emailInput.value.trim(),
              password: passwordInput.value,
            }),
          });

          if (!res.ok) {
            const data = await res.json().catch(function () { return { message: 'Erro inesperado' }; });
            throw new Error(data.message || 'E-mail ou senha inválidos');
          }

          const data = await res.json();

          // [D1] sessionStorage — mais seguro que localStorage
          sessionStorage.setItem('rb24_token', data.accessToken);
          sessionStorage.setItem('rb24_user', JSON.stringify(data.user));

          window.location.href = '/dashboard';

        } catch (err) {
          errorEl.textContent = err.message;
          errorEl.classList.add('visible');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Entrar';
        }
      });
    }
  }

  // ===========================================================================
  // Teams page — Sprint 4, task #328 (Integração CRUD via API)
  // [A1] Endpoints da Seção 7 do agent.md:
  //   POST   /competitions/:id/teams              — cadastro
  //   PUT    /competitions/:id/teams/:teamId      — edição
  //   DELETE /competitions/:id/teams/:teamId      — exclusão
  // [A3] competitionId vem de data-competition-id do <main> (mock do controller
  //   até o fluxo administrativo definir a origem real).
  // ===========================================================================
  if (path === '/teams') {
    const teamsContainer = document.querySelector('[data-teams]');

    if (teamsContainer) {
      const competitionId   = teamsContainer.dataset.competitionId;
      const modal           = document.querySelector('[data-teams-modal]');
      const modalTitle      = document.querySelector('[data-teams-modal-title]');
      const form            = document.querySelector('[data-teams-form]');
      const teamIdInput     = form ? form.querySelector('[data-team-id-input]') : null;
      const nameInput       = form ? form.querySelector('input[name="name"]') : null;
      const errorEl         = form ? form.querySelector('[data-teams-form-error]') : null;
      const submitBtn       = form ? form.querySelector('.teams__form-submit') : null;

      function showError(message) {
        if (!errorEl) return;
        errorEl.textContent = message;
        errorEl.hidden = false;
      }

      function clearError() {
        if (!errorEl) return;
        errorEl.textContent = '';
        errorEl.hidden = true;
      }

      function openModal(mode, team) {
        if (!modal || !modalTitle || !teamIdInput || !nameInput) return;

        if (mode === 'edit' && team) {
          modalTitle.textContent = 'Editar Equipe';
          teamIdInput.value = team.id || '';
          nameInput.value   = team.name || '';
        } else {
          modalTitle.textContent = 'Nova Equipe';
          teamIdInput.value = '';
          nameInput.value   = '';
        }
        clearError();
        modal.hidden = false;
        setTimeout(function () { nameInput.focus(); }, 50);
      }

      function closeModal() {
        if (!modal) return;
        modal.hidden = true;
      }

      function hasValidCompetition() {
        return competitionId && competitionId !== '0';
      }

      async function submitForm(event) {
        event.preventDefault();

        if (!form || !nameInput || !teamIdInput || !submitBtn) return;

        const name = nameInput.value.trim();

        if (!name) {
          showError('Nome da equipe é obrigatório.');
          return;
        }

        if (!hasValidCompetition()) {
          showError('Competição ativa não foi identificada. Tente recarregar a página.');
          return;
        }

        const teamId = teamIdInput.value;
        const isEdit = !!teamId;
        const url    = isEdit
          ? '/competitions/' + competitionId + '/teams/' + teamId
          : '/competitions/' + competitionId + '/teams';
        const method = isEdit ? 'PUT' : 'POST';

        clearError();
        submitBtn.disabled = true;
        const originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Salvando...';

        try {
          const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name }),
          });

          if (!res.ok) {
            const data = await res.json().catch(function () {
              return { message: 'Erro inesperado.' };
            });
            throw new Error(data.message || 'HTTP ' + res.status);
          }

          // [D1] Reload simples — atualiza a lista sem reimplementar render no cliente.
          window.location.reload();
        } catch (err) {
          showError(err.message || 'Não foi possível salvar a equipe.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }

      async function deleteTeam(teamId, teamName) {
        if (!hasValidCompetition()) {
          window.alert('Competição ativa não foi identificada.');
          return;
        }

        const confirmed = window.confirm(
          'Excluir a equipe "' + teamName + '"? Esta ação não pode ser desfeita.'
        );
        if (!confirmed) return;

        try {
          const res = await fetch(
            '/competitions/' + competitionId + '/teams/' + teamId,
            { method: 'DELETE' }
          );

          if (!res.ok && res.status !== 204) {
            const data = await res.json().catch(function () {
              return { message: 'Erro inesperado.' };
            });
            throw new Error(data.message || 'HTTP ' + res.status);
          }

          window.location.reload();
        } catch (err) {
          window.alert('Erro ao excluir: ' + (err.message || 'desconhecido'));
        }
      }

      // [D1] Event delegation no container — funciona inclusive para itens
      // adicionados dinamicamente em iterações futuras.
      teamsContainer.addEventListener('click', function (event) {
        const target = event.target.closest('[data-teams-action]');
        if (!target) return;

        const action = target.dataset.teamsAction;

        if (action === 'open-new') {
          openModal('new');
        } else if (action === 'open-edit') {
          openModal('edit', {
            id: target.dataset.teamId,
            name: target.dataset.teamName,
          });
        } else if (action === 'open-delete') {
          deleteTeam(target.dataset.teamId, target.dataset.teamName);
        } else if (action === 'close-modal') {
          closeModal();
        } else if (action === 'copy-uuid') {
          copyUuid(target.dataset.uuid, target);
        }
      });

      // =======================================================================
      // Task #329 — Copiar URL pública (UUID) com feedback visual
      // [A1] Botão estruturado em teams.ejs com data-teams-action="copy-uuid"
      //   e data-uuid contendo o UUID gerado pelo backend (RN01).
      // [D1] Fallback para document.execCommand quando navigator.clipboard
      //   não estiver disponível (browsers antigos / contexto inseguro).
      // =======================================================================
      function showCopyFeedback(button) {
        if (!button || button.dataset.copyBusy === 'true') return;

        const originalText = button.textContent;
        button.dataset.copyBusy = 'true';
        button.textContent = 'Copiado!';
        button.classList.add('teams__copy-btn--success');

        setTimeout(function () {
          button.textContent = originalText;
          button.classList.remove('teams__copy-btn--success');
          delete button.dataset.copyBusy;
        }, 2000);
      }

      function copyUuidFallback(uuid, button) {
        // Usa o input readonly do próprio card como fonte para o execCommand.
        const card = button.closest('.teams__card');
        const input = card ? card.querySelector('.teams__uuid-input') : null;
        if (!input) return false;

        try {
          input.removeAttribute('readonly');
          input.select();
          input.setSelectionRange(0, input.value.length);
          const ok = document.execCommand('copy');
          input.setAttribute('readonly', 'readonly');
          window.getSelection().removeAllRanges();
          if (ok) showCopyFeedback(button);
          return ok;
        } catch (_err) {
          input.setAttribute('readonly', 'readonly');
          return false;
        }
      }

      function copyUuid(uuid, button) {
        if (!uuid || !button) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(uuid).then(
            function () { showCopyFeedback(button); },
            function () { copyUuidFallback(uuid, button); }
          );
        } else {
          copyUuidFallback(uuid, button);
        }
      }

      if (form) {
        form.addEventListener('submit', submitForm);
      }

      // Tecla Esc fecha o modal
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal && !modal.hidden) {
          closeModal();
        }
      });
    }
  }

  // Ativar item do menu correspondente à rota atual
  document.querySelectorAll('.nav-item').forEach(function (item) {
    const href = item.getAttribute('href');
    if (href && path.startsWith(href)) {
      item.classList.add('active');
      item.closest('.nav-item-wrapper').classList.add('active');
    }
  });
});