// [D1] Padrão: verificação de autenticação + ativação de menu
document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;

  // [A1] RN03 — Redirecionar para login se não autenticado
  // [A1] RN13 — Páginas públicas (/public/*) são acessadas via UUID sem login
  // [D1] Proteção client-side — o backend deve ter middleware próprio para segurança real
  const isPublicPage = path.startsWith('/public/');
  if (path !== '/admin/login' && !isPublicPage) {
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

  // ── Formulário de nova competição (/competitions/new) ──────────────────
  // [A1] Fetch para POST /competitions — confirmado em src/routes/competitionRoutes.ts
  // [B2] Response shape inferido de src/models/competition.ts: { id, name, ... }
  if (path === '/competitions/new') {
    const form      = document.getElementById('competition-form');
    const errorEl   = document.getElementById('competition-error');
    const submitBtn = document.getElementById('competition-submit');

    if (form && errorEl && submitBtn) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        errorEl.classList.remove('visible');
        errorEl.textContent = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Criando...';

        const data = new FormData(form);

        try {
          const res = await fetch('/competitions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // [D2] 'description' omitido — campo não existe no model Competition
            body: JSON.stringify({
              name:    data.get('name'),
              date:    data.get('date'),
              address: data.get('address')
            })
          });

          if (!res.ok) {
            const payload = await res.json().catch(function () {
              return { message: 'Erro ao criar competição.' };
            });
            throw new Error(payload.message || 'Erro ao criar competição.');
          }

          // [A1] Redireciona para dashboard com flag de sucesso → exibe tela3
          window.location.href = '/dashboard?created=1';

        } catch (err) {
          errorEl.textContent = err.message;
          errorEl.classList.add('visible');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Criar nova Competição';
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

  // Criação completa de equipe com atletas (/teams/new)
  if (path === '/teams/new') {
    const container = document.querySelector('[data-team-create]');
    const form = document.querySelector('[data-team-create-form]');

    if (container && form) {
      const competitionId = container.dataset.competitionId;
      const runnersList = form.querySelector('[data-runners-list]');
      const addRunnerBtn = form.querySelector('[data-add-runner]');
      const submitBtn = form.querySelector('[data-team-create-submit]');
      const errorEl = form.querySelector('[data-team-create-error]');
      const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

      function showCreateError(message) {
        if (!errorEl) return;
        errorEl.textContent = message;
        errorEl.hidden = false;
      }

      function clearCreateError() {
        if (!errorEl) return;
        errorEl.textContent = '';
        errorEl.hidden = true;
      }

      function runnerRows() {
        return Array.prototype.slice.call(
          runnersList ? runnersList.querySelectorAll('[data-runner-row]') : []
        );
      }

      function refreshRunnerRows() {
        runnerRows().forEach(function (row, index) {
          const radio = row.querySelector('[data-captain-radio]');
          const remove = row.querySelector('[data-remove-runner]');
          if (radio) radio.value = String(index);
          if (remove) remove.hidden = runnerRows().length <= 1;
        });
      }

      function addRunnerRow() {
        const rows = runnerRows();
        if (!runnersList || rows.length >= 16) {
          showCreateError('Cada equipe pode ter no máximo 16 atletas.');
          return;
        }

        const clone = rows[0].cloneNode(true);
        clone.querySelectorAll('input').forEach(function (input) {
          if (input.type === 'radio') {
            input.checked = false;
          } else {
            input.value = '';
          }
        });
        runnersList.appendChild(clone);
        refreshRunnerRows();
      }

      function readRunner(row, index, captainIndex) {
        const name = row.querySelector('[data-runner-name]').value.trim();
        const cpf = row.querySelector('[data-runner-cpf]').value.trim();
        const email = row.querySelector('[data-runner-email]').value.trim();
        const phone = row.querySelector('[data-runner-phone]').value.trim();

        if (!name) throw new Error('Nome do atleta é obrigatório.');
        if (!cpfRegex.test(cpf)) throw new Error('CPF inválido para ' + name + '.');
        if (!email || !email.includes('@')) throw new Error('Email inválido para ' + name + '.');

        const payload = {
          name: name,
          cpf: cpf,
          email: email,
          status: index === captainIndex ? 'captain' : 'runner',
        };

        if (phone) payload.phone = phone;

        return payload;
      }

      function validateAndBuildPayload() {
        const teamNameInput = form.querySelector('[data-team-name]');
        const teamName = teamNameInput ? teamNameInput.value.trim() : '';
        if (!teamName) throw new Error('Nome da equipe é obrigatório.');
        if (!competitionId || competitionId === '0') {
          throw new Error('Competição ativa não foi identificada.');
        }

        const selectedCaptain = form.querySelector('input[name="captain_index"]:checked');
        if (!selectedCaptain) throw new Error('Selecione um capitão.');

        const captainIndex = Number(selectedCaptain.value);
        const cpfs = new Set();
        const emails = new Set();
        const runners = runnerRows().map(function (row, index) {
          const runner = readRunner(row, index, captainIndex);
          const cpfKey = runner.cpf.replace(/\D/g, '');
          const emailKey = runner.email.toLowerCase();
          if (cpfs.has(cpfKey)) throw new Error('Há CPFs duplicados no formulário.');
          if (emails.has(emailKey)) throw new Error('Há emails duplicados no formulário.');
          cpfs.add(cpfKey);
          emails.add(emailKey);
          return runner;
        });

        if (runners.length === 0) throw new Error('Cadastre pelo menos um atleta.');

        return { teamName: teamName, runners: runners };
      }

      async function createTeamAndRunners(event) {
        event.preventDefault();
        clearCreateError();

        let payload;
        try {
          payload = validateAndBuildPayload();
        } catch (err) {
          showCreateError(err.message);
          return;
        }

        const originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Salvando...';
        }

        let createdTeam = null;

        try {
          const teamRes = await fetch('/competitions/' + competitionId + '/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: payload.teamName }),
          });

          if (!teamRes.ok) {
            const data = await teamRes.json().catch(function () { return { message: 'Erro ao criar equipe.' }; });
            throw new Error(data.message || 'Erro ao criar equipe.');
          }

          createdTeam = await teamRes.json();

          for (const runner of payload.runners) {
            const runnerRes = await fetch(
              '/competitions/' + competitionId + '/teams/' + createdTeam.id + '/runners',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(runner),
              }
            );

            if (!runnerRes.ok) {
              const data = await runnerRes.json().catch(function () { return { message: 'Erro ao cadastrar atleta.' }; });
              throw new Error(data.message || 'Erro ao cadastrar atleta.');
            }
          }

          window.location.href = '/teams?competitionId=' + encodeURIComponent(competitionId);
        } catch (err) {
          const partial = createdTeam
            ? ' Equipe criada parcialmente; acesse a equipe para concluir o cadastro.'
            : '';
          showCreateError((err.message || 'Não foi possível criar a equipe.') + partial);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        }
      }

      if (addRunnerBtn) addRunnerBtn.addEventListener('click', addRunnerRow);
      if (runnersList) {
        runnersList.addEventListener('click', function (event) {
          const remove = event.target.closest('[data-remove-runner]');
          if (!remove) return;
          const row = remove.closest('[data-runner-row]');
          if (row && runnerRows().length > 1) {
            row.remove();
            refreshRunnerRows();
          }
        });
      }
      form.addEventListener('submit', createTeamAndRunners);
      refreshRunnerRows();
    }
  }

  // Painel administrativo por equipe (/teams/:teamId)
  if (/^\/teams\/\d+$/.test(path)) {
    const panel = document.querySelector('[data-team-panel]');

    if (panel) {
      const competitionId = panel.dataset.competitionId;
      const teamId = panel.dataset.teamId;
      const switchPanel = panel.querySelector('[data-runner-switch]');
      const feedback = panel.querySelector('[data-runner-switch-feedback]');
      const toast = panel.querySelector('[data-team-toast]');
      const openSwitchBtn = panel.querySelector('[data-open-runner-switch]');
      const cancelSwitchBtn = panel.querySelector('[data-cancel-runner-switch]');
      const confirmSwitchBtn = panel.querySelector('[data-confirm-runner-switch]');
      const manualRegistrationLink = panel.querySelector('[data-manual-registration-link]');

      function showTeamToast(message) {
        if (!toast) {
          window.alert(message);
          return;
        }
        toast.textContent = message;
        toast.hidden = false;
        setTimeout(function () {
          toast.hidden = true;
        }, 2400);
      }

      function showSwitchError(message) {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.hidden = false;
      }

      function clearSwitchError() {
        if (!feedback) return;
        feedback.textContent = '';
        feedback.hidden = true;
      }

      function selectedRunnerInput() {
        return panel.querySelector('input[name="active_runner"]:checked');
      }

      function refreshSelectedHighlight() {
        panel.querySelectorAll('[data-runner-option]').forEach(function (option) {
          const input = option.querySelector('input[type="radio"]');
          option.classList.toggle('is-selected', !!input && input.checked);
          option.classList.toggle(
            'is-active',
            option.dataset.runnerId === panel.dataset.activeRunnerId
          );
        });
      }

      function updateManualRegistrationLink(runnerId) {
        if (!manualRegistrationLink || !runnerId) return;

        manualRegistrationLink.href = '/operational-panel/' + runnerId +
          '?competitionId=' + encodeURIComponent(competitionId) +
          '&teamId=' + encodeURIComponent(teamId);
        manualRegistrationLink.classList.remove('is-disabled');
        manualRegistrationLink.setAttribute('aria-disabled', 'false');
      }

      function closeSwitchPanel(reset) {
        if (!switchPanel) return;
        if (reset) {
          const active = panel.querySelector(
            'input[name="active_runner"][value="' + panel.dataset.activeRunnerId + '"]'
          );
          if (active) active.checked = true;
        }
        switchPanel.setAttribute('hidden', 'hidden');
        clearSwitchError();
        refreshSelectedHighlight();
      }

      function openSwitchPanel() {
        if (!switchPanel) return;
        switchPanel.removeAttribute('hidden');
        clearSwitchError();
        refreshSelectedHighlight();
        if (switchPanel.scrollIntoView) {
          switchPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (openSwitchBtn) {
        openSwitchBtn.addEventListener('click', openSwitchPanel);
      }

      if (cancelSwitchBtn) {
        cancelSwitchBtn.addEventListener('click', function () {
          closeSwitchPanel(true);
        });
      }

      panel.addEventListener('change', function (event) {
        if (event.target && event.target.name === 'active_runner') {
          refreshSelectedHighlight();
        }
      });

      panel.addEventListener('click', function (event) {
        const openTarget = event.target.closest('[data-open-runner-switch]');
        if (openTarget) {
          event.preventDefault();
          openSwitchPanel();
        }
      });

      if (confirmSwitchBtn) {
        confirmSwitchBtn.addEventListener('click', async function () {
          const input = selectedRunnerInput();
          if (!input) {
            showSwitchError('Selecione um atleta.');
            return;
          }

          const runnerId = input.value;
          if (runnerId === panel.dataset.activeRunnerId) {
            closeSwitchPanel(false);
            return;
          }

          const originalLabel = confirmSwitchBtn.textContent;
          confirmSwitchBtn.disabled = true;
          confirmSwitchBtn.textContent = 'Confirmando...';
          clearSwitchError();

          try {
            const res = await fetch(
              '/competitions/' + competitionId + '/teams/' + teamId + '/active-runner',
              {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ runnerId: Number(runnerId) }),
              }
            );

            if (!res.ok) {
              const data = await res.json().catch(function () { return { message: 'Erro ao trocar atleta.' }; });
              throw new Error(data.message || 'Erro ao trocar atleta.');
            }

            const option = panel.querySelector('[data-runner-option][data-runner-id="' + runnerId + '"]');
            panel.dataset.activeRunnerId = runnerId;

            const activeName = panel.querySelector('[data-active-runner-name]');
            const activeMeta = panel.querySelector('[data-active-runner-meta]');
            if (activeName && option) activeName.textContent = option.dataset.runnerName || 'Atleta ativo';
            if (activeMeta && option) {
              activeMeta.textContent = option.dataset.runnerStatus === 'captain' ? 'Capitão' : 'Atleta';
            }
            updateManualRegistrationLink(runnerId);

            refreshSelectedHighlight();
            closeSwitchPanel(false);
            showTeamToast('Atleta ativo atualizado.');
          } catch (err) {
            showSwitchError(err.message || 'Não foi possível trocar o atleta ativo.');
          } finally {
            confirmSwitchBtn.disabled = false;
            confirmSwitchBtn.textContent = originalLabel;
          }
        });
      }

      const photoBtn = panel.querySelector('[data-photo-placeholder]');
      if (photoBtn) {
        photoBtn.addEventListener('click', function () {
          showTeamToast('Captura por foto em breve.');
        });
      }

      refreshSelectedHighlight();
    }
  }

  // Registro manual (/operational-panel)
  if (path === '/operational-panel' || path.startsWith('/operational-panel/')) {
    const form = document.querySelector('[data-operational-manual-form]');

    if (form) {
      const feedback = form.querySelector('[data-manual-form-feedback]');
      const submitBtn = form.querySelector('[data-manual-submit]');
      const cancelBtn = form.querySelector('[data-manual-cancel]');

      function showManualFeedback(message, isError) {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.dataset.state = isError ? 'error' : (message ? 'success' : '');
      }

      function normalizePace(value) {
        const raw = String(value || '').trim();
        if (!raw) return undefined;
        if (/^[0-9]{1,2}:[0-9]{2}\/km$/.test(raw)) return raw;

        const quoteMatch = raw.match(/^([0-9]{1,2})'?[:']([0-9]{2})/);
        if (quoteMatch) return quoteMatch[1] + ':' + quoteMatch[2] + '/km';

        return raw;
      }

      function buildCheckpointPayload() {
        const data = new FormData(form);
        const distance = Number(data.get('distance_km'));
        const idRunner = Number(data.get('id_runner'));
        const idCompetition = Number(data.get('id_competition'));
        const idTreadmill = Number(data.get('id_treadmill'));
        const idAdmin = Number(data.get('id_admin'));

        if (!Number.isFinite(distance) || distance < 0) {
          throw new Error('Distância deve ser um número não negativo.');
        }
        if (!idRunner || !idCompetition || !idTreadmill || !idAdmin) {
          throw new Error('Contexto do checkpoint incompleto. Volte ao painel da equipe e tente novamente.');
        }

        const nowIso = new Date().toISOString();
        const identifier = String(data.get('identifier') || '').trim() ||
          'MANUAL-' + nowIso.replace(/[-:.]/g, '').slice(0, 15) + '-' + idRunner;
        const payload = {
          identifier: identifier,
          distance_km: distance,
          id_runner: idRunner,
          id_competition: idCompetition,
          id_treadmill: idTreadmill,
          id_admin: idAdmin,
          image: {
            input_method: form.dataset.inputMethod || 'manual',
            recorded_at: nowIso,
          },
        };
        const pace = normalizePace(data.get('pace'));
        const time = String(data.get('time') || '').trim();
        if (pace) payload.pace = pace;
        if (time) payload.time = time;

        return payload;
      }

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const originalLabel = submitBtn ? submitBtn.textContent : '';
        let payload;

        try {
          payload = buildCheckpointPayload();
        } catch (err) {
          showManualFeedback(err.message, true);
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Salvando...';
        }
        showManualFeedback('', false);

        try {
          const res = await fetch(form.dataset.endpoint || '/checkpoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const data = await res.json().catch(function () { return { message: 'Erro ao salvar registro manual.' }; });
            throw new Error(data.message || 'Erro ao salvar registro manual.');
          }

          showManualFeedback('Registro manual salvo com sucesso.', false);
        } catch (err) {
          showManualFeedback(err.message || 'Erro ao salvar registro manual.', true);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        }
      });

      if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
          window.history.back();
        });
      }
    }
  }

  // Ativar item do menu correspondente à rota atual
  document.querySelectorAll('.nav-item').forEach(function (item) {
    const href = item.getAttribute('href');
    if (!href) return;

    var hrefPath = href;
    try {
      hrefPath = new URL(href, window.location.origin).pathname;
    } catch (_err) {
      hrefPath = href.split('?')[0];
    }

    var isActive =
      path === hrefPath ||
      path.startsWith(hrefPath + '/') ||
      (hrefPath === '/ranking' && /\/competitions\/\d+\/ranking/.test(path)) ||
      (hrefPath === '/reports' && path.startsWith('/view/competitions/'));

    if (isActive) {
      item.classList.add('active');
      item.closest('.nav-item-wrapper').classList.add('active');
    }
  });

  // ============================================================
  // RANKING — Auto-polling (admin: 5 min, public: 1h)
  // RN11: painel adm a cada 5 min
  // RN09: painel público a cada 1h
  // ============================================================
  var competitionId = window.COMPETITION_ID;
  var isAdmin = window.IS_ADMIN;

  if (competitionId) {
    var pollIntervalMs = isAdmin ? 5 * 60 * 1000 : 60 * 60 * 1000;

    fetchRanking(competitionId, isAdmin);
    setInterval(function () { fetchRanking(competitionId, isAdmin); }, pollIntervalMs);
  }
});

// [A1][B1] Endpoint: GET /competitions/:id/ranking/teams — retorna RankingTeam[]
// [A1][B1] Endpoint: GET /competitions/:id/ranking/runners — retorna RankingRunner[]
// Modelos confirmados em src/models/ranking.ts
function fetchRanking(competitionId, isAdmin) {
  var teamRequest = fetch('/competitions/' + competitionId + '/ranking/teams');
  var checkpointRequest = fetch('/competitions/' + competitionId + '/checkpoints');
  var runnerRequest = isAdmin ? fetch('/competitions/' + competitionId + '/ranking/runners') : Promise.resolve(null);

  Promise.all([teamRequest, checkpointRequest, runnerRequest])
    .then(function (responses) {
      var teamRes = responses[0];
      var checkpointRes = responses[1];
      var runnerRes = responses[2];

      if (!teamRes.ok) throw new Error('HTTP ' + teamRes.status);
      if (!checkpointRes.ok) throw new Error('HTTP ' + checkpointRes.status);
      if (runnerRes && !runnerRes.ok) throw new Error('HTTP ' + runnerRes.status);

      return Promise.all([
        teamRes.json(),
        checkpointRes.json(),
        runnerRes ? runnerRes.json() : Promise.resolve([]),
      ]);
    })
    .then(function (data) {
      var teams = data[0] || [];
      var checkpoints = data[1] || [];
      var runners = data[2] || [];

      renderTeamRanking(teams, checkpoints.length);
      if (isAdmin) {
        renderLatestRunner(checkpoints, runners, teams);
      }
      updateLastUpdate();
      hideError('team-ranking-error');
      hideError('runner-ranking-error');
    })
    .catch(function (err) {
      console.error('Erro ao atualizar ranking:', err);
      showError('team-ranking-error', 'Não foi possível atualizar o ranking. Tentando novamente em alguns minutos.');
      if (isAdmin) {
        showError('runner-ranking-error', 'Não foi possível atualizar o ranking de corredores.');
      }
    });
}

function renderTeamRanking(teams, checkpointCount) {
  var container = document.querySelector('#live-teams-list');
  if (!container) return;

  if (!teams || teams.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum checkpoint registrado ainda. O ranking será exibido assim que houver dados.</p></div>';
    updateStatCard('stat-total-km', '—');
    updateStatCard('stat-avg-pace', '—');
    updateStatCard('stat-checkpoints', '—');
    return;
  }

  var sortedTeams = teams.slice().sort(function (a, b) {
    return (a.position || Number.POSITIVE_INFINITY) - (b.position || Number.POSITIVE_INFINITY);
  });

  var gap = 0;
  if (sortedTeams.length > 1) {
    var firstDistance = Number(sortedTeams[0].total_distance_km || 0);
    var secondDistance = Number(sortedTeams[1].total_distance_km || 0);
    gap = Math.max(0, firstDistance - secondDistance);
  }

  var cards = sortedTeams.map(function (team) {
    return '<div class="team-card ' + (team.position === 1 ? 'team-card--leader' : '') + '"' +
      ' data-position="' + team.position + '" data-id="' + team.id_team + '">' +
        '<div class="team-card-left">' +
          '<div class="team-pos-badge team-pos-' + (team.position === 1 ? 'leader' : 'other') + '">' +
            team.position +
          '</div>' +
        '</div>' +
        '<div class="team-card-body">' +
          '<div class="team-name-row">' +
            '<span class="team-name">' + escapeHtml(team.team_name) + '</span>' +
            (team.position === 1 ? '<span class="leader-pill">Líder</span>' : '') +
          '</div>' +
          '<div class="team-stats-row">' +
            '<div class="team-stat">' +
              '<span class="team-stat-value">' + Number(team.total_distance_km).toFixed(1) + ' km</span>' +
              '<span class="team-stat-label">Distância total</span>' +
            '</div>' +
            '<div class="team-stat">' +
              '<span class="team-stat-label">Pace médio</span>' +
              '<span class="team-stat-value">' + (team.average_pace || '—') + '/km</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  var gapHtml = '';
  if (sortedTeams.length > 1) {
    gapHtml = '<div class="gap-separator" id="gap-separator">' +
      '<div class="gap-line"></div>' +
      '<div class="gap-info">' +
        '<span class="gap-label">Diferença para o líder</span>' +
        '<span class="gap-value" id="gap-value">' + gap.toFixed(1) + ' km</span>' +
      '</div>' +
      '<div class="gap-line"></div>' +
    '</div>';
  }

  container.innerHTML = cards[0] + gapHtml + cards.slice(1).join('');

  updateRankingStats(sortedTeams, checkpointCount);
}

function renderLatestRunner(checkpoints, runners, teams) {
  var container = document.querySelector('#live-runners-grid');
  if (!container) return;

  if (!checkpoints || checkpoints.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum corredor com checkpoint registrado.</p></div>';
    return;
  }

  var latestCheckpointByTeam = {};
  var teamMap = (teams || []).reduce(function (acc, team) {
    acc[team.id_team] = team.team_name;
    return acc;
  }, {});

  checkpoints.forEach(function (checkpoint) {
    if (!checkpoint.runner || checkpoint.runner.id_team == null) return;

    var teamId = checkpoint.runner.id_team;
    var current = latestCheckpointByTeam[teamId];
    var itemTime = Date.parse(checkpoint.created_at) || 0;
    var currentTime = current ? Date.parse(current.created_at) || 0 : 0;

    if (!current || itemTime > currentTime) {
      latestCheckpointByTeam[teamId] = checkpoint;
    }
  });

  var cards = Object.keys(latestCheckpointByTeam)
    .map(function (teamId) {
      var teamCheckpoint = latestCheckpointByTeam[teamId];
      var runner = (runners || []).find(function (item) {
        return item.id_runner === teamCheckpoint.id_runner;
      });
      var teamName = teamMap[teamId] || (runner && runner.team_name) || '—';
      var totalDistance = runner ? Number(runner.total_distance_km || 0) : Number(teamCheckpoint.distance_km || 0);
      var averagePace = runner ? runner.average_pace || formatCheckpointPace(teamCheckpoint) : formatCheckpointPace(teamCheckpoint) || '—';
      var checkpointTime = teamCheckpoint.time || teamCheckpoint.pace || '—';
      var lastCheckpoint = teamCheckpoint.identifier || '—';
      var position = runner ? runner.position : Number.POSITIVE_INFINITY;
      var runnerName = runner ? runner.runner_name : (teamCheckpoint.runner ? teamCheckpoint.runner.name : '—');

      return {
        position: position,
        html:
          '<div class="runner-card" data-position="' + position + '" data-id="' + teamCheckpoint.id_runner + '">' +
          '<div class="runner-card-top">' +
            '<div class="runner-pos-badge runner-pos-' + (position === 1 ? 'leader' : 'other') + '">' +
              (position === Number.POSITIVE_INFINITY ? '—' : position) +
            '</div>' +
            '<div class="runner-identity">' +
              '<span class="runner-name">' + escapeHtml(runnerName || '—') + '</span>' +
              '<span class="runner-team">' + escapeHtml(teamName) + '</span>' +
            '</div>' +
            '<div class="runner-treadmill">' +
              '<span class="runner-treadmill-time">' + escapeHtml(checkpointTime) + '</span>' +
              '<span class="runner-treadmill-label">Tempo do checkpoint</span>' +
            '</div>' +
          '</div>' +
          '<div class="runner-card-bottom">' +
            '<div class="runner-stat">' +
              '<span class="runner-stat-label">Distância atual</span>' +
              '<span class="runner-stat-value">' + totalDistance.toFixed(1) + ' km</span>' +
            '</div>' +
            '<div class="runner-stat">' +
              '<span class="runner-stat-label">Pace atual</span>' +
              '<span class="runner-stat-value">' + escapeHtml(averagePace) + '/km</span>' +
            '</div>' +
            '<div class="runner-stat">' +
              '<span class="runner-stat-label">Último CP</span>' +
              '<span class="runner-stat-value">' + escapeHtml(lastCheckpoint) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>',
      };
    })
    .sort(function (a, b) {
      return a.position - b.position;
    });

  if (cards.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum corredor com checkpoint registrado.</p></div>';
    return;
  }

  container.innerHTML = cards.map(function (item) { return item.html; }).join('');
}

function updateRankingStats(teams, checkpointCount) {
  var totalDistance = teams.reduce(function (sum, team) {
    return sum + Number(team.total_distance_km || 0);
  }, 0);

  var totalPaceSeconds = teams.reduce(function (sum, team) {
    var paceSeconds = Number(team.average_pace_seconds || 0);
    var distance = Number(team.total_distance_km || 0);
    return sum + paceSeconds * distance;
  }, 0);

  var averagePaceSeconds = totalDistance > 0 ? totalPaceSeconds / totalDistance : null;

  updateStatCard('stat-total-km', totalDistance > 0 ? totalDistance.toFixed(1) + ' km' : '—');
  updateStatCard('stat-avg-pace', averagePaceSeconds ? formatPace(averagePaceSeconds) + '/km' : '—');
  updateStatCard('stat-checkpoints', checkpointCount != null ? checkpointCount : '—');
}

function updateStatCard(id, value) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

function formatPace(seconds) {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds)) return '—';
  var rounded = Math.round(seconds);
  var minutes = Math.floor(rounded / 60);
  var remainingSeconds = String(rounded % 60).padStart(2, '0');
  return minutes + ':' + remainingSeconds;
}

function formatCheckpointPace(checkpoint) {
  if (checkpoint.pace) return checkpoint.pace;
  if (!checkpoint.time || !checkpoint.distance_km) return null;

  var parts = checkpoint.time.split(':').map(function (part) {
    return Number(part);
  });
  if (parts.some(function (value) { return !Number.isFinite(value) || value < 0; })) {
    return null;
  }

  var seconds;
  if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else {
    return null;
  }

  return formatPace(seconds / Number(checkpoint.distance_km));
}

function updateLastUpdate() {
  var el = document.querySelector('#last-update');
  if (!el) return;
  var now = new Date();
  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  var seconds = String(now.getSeconds()).padStart(2, '0');
  el.textContent = 'Última atualização: ' + hours + ':' + minutes + ':' + seconds;
}

function hideError(id) {
  var el = document.querySelector('#' + id);
  if (el) el.style.display = 'none';
}

function showError(id, msg) {
  var el = document.querySelector('#' + id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = '';
}

// [D1] Escape manual no JS de cliente — proteção contra XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
