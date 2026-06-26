// [D1] Padrão: verificação de autenticação + ativação de menu
function formatPacePartsForApi(minutes, seconds) {
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '/km';
}

function formatPacePartsForDisplay(minutes, seconds) {
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

function normalizePaceForApi(value) {
  const raw = String(value || '').trim();
  if (!raw) return undefined;

  const match = raw.match(/^([0-9]{1,2})(?:[:'])([0-9]{2})(?:''|")?(?:\s*\/\s*km)?$/i);
  if (!match) return raw;
  if (Number(match[2]) > 59) return raw;

  return formatPacePartsForApi(match[1], match[2]);
}

function stripPaceUnit(value) {
  return String(value || '').trim().replace(/\s*\/\s*km$/i, '');
}

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

          const competition = await res.json();

          // [A1] Redireciona para dashboard com flag de sucesso e competição criada selecionada.
          window.location.href = '/dashboard?created=1&competitionId=' + encodeURIComponent(competition.id);

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

  // ── Dashboard — Modal de edição de competição ──────────────────────────────
  // [A1] PUT /competitions/:id — update competition
  // [A1] GET /competitions/:id — fetch single competition data
  if (path === '/' || path === '/dashboard') {
    const modal = document.querySelector('[data-db-edit-modal]');
    const form = document.querySelector('[data-db-edit-form]');
    const idInput = form ? form.querySelector('[data-db-edit-id]') : null;
    const nameInput = document.getElementById('db-edit-name');
    const dateInput = document.getElementById('db-edit-date');
    const addressInput = document.getElementById('db-edit-address');
    const submitBtn = document.getElementById('db-edit-submit');
    const errorEl = document.getElementById('db-edit-error');

    function showEditError(message) {
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }

    function clearEditError() {
      if (!errorEl) return;
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }

    function openEditModal(id) {
      if (!modal || !form || !idInput || !nameInput || !dateInput || !addressInput) return;

      clearEditError();
      fetch('/competitions/' + id)
        .then(function (res) {
          if (!res.ok) throw new Error('Erro ao carregar dados da competição.');
          return res.json();
        })
        .then(function (comp) {
          idInput.value = comp.id;
          nameInput.value = comp.name || '';
          dateInput.value = comp.date || '';
          addressInput.value = comp.address || '';
          modal.hidden = false;
        })
        .catch(function (err) {
          showEditError(err.message || 'Não foi possível carregar a competição.');
        });
    }

    function closeEditModal() {
      if (!modal) return;
      modal.hidden = true;
      clearEditError();
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!idInput || !nameInput || !dateInput || !addressInput || !submitBtn) return;

        const id = idInput.value;
        if (!id) return;

        clearEditError();
        submitBtn.disabled = true;
        const originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Salvando...';

        fetch('/competitions/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            date: dateInput.value,
            address: addressInput.value.trim(),
          }),
        })
          .then(function (res) {
            if (!res.ok) {
              return res.json().then(function (data) {
                throw new Error(data.message || 'Erro ao atualizar.');
              });
            }
            window.location.reload();
          })
          .catch(function (err) {
            showEditError(err.message || 'Erro ao atualizar competição.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          });
      });
    }

    // Event delegation for edit buttons and modal backdrop/close
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-db-edit-action]');
      if (target) {
        var action = target.dataset.dbEditAction;
        if (action === 'close') closeEditModal();
        return;
      }

      target = e.target.closest('.db-edit-btn');
      if (target) {
        var id = target.dataset.id;
        if (id) openEditModal(id);
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) {
        closeEditModal();
      }
    });
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
      //   e data-uuid contendo a URL pública completa (http://localhost:3000/public/team/<uuid>).
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
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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
        const cpfDigits = cpf.replace(/\D/g, '');

        if (!name) throw new Error('Nome do atleta é obrigatório.');
        if (!cpfRegex.test(cpf)) throw new Error('CPF inválido para ' + name + '.');
        if (!emailRegex.test(email)) throw new Error('Email inválido para ' + name + '.');

        const payload = {
          name: name,
          cpf: cpfDigits.slice(0, 3) + '.' + cpfDigits.slice(3, 6) + '.' + cpfDigits.slice(6, 9) + '-' + cpfDigits.slice(9),
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
          if (submitBtn && submitBtn.disabled) return;

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
            body: JSON.stringify({ 
              name: payload.teamName, 
              runners: payload.runners 
            }),
          });

          if (!teamRes.ok) {
            const data = await teamRes.json().catch(function () { return { message: 'Erro ao criar equipe.' }; });
            throw new Error(data.message || 'Erro ao criar equipe.');
          }

          createdTeam = await teamRes.json();

          window.location.href = '/teams?competitionId=' + encodeURIComponent(competitionId);
        } catch (err) {
          if (createdTeam) {
            showCreateError((err.message || 'Não foi possível cadastrar os atletas.') + ' A equipe foi criada, mas os atletas não foram salvos.');
          } else {
            showCreateError(err.message || 'Não foi possível criar a equipe.');
          }

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

  // Edição completa de equipe com atletas (/teams/:teamId/edit)
  if (/^\/teams\/\d+\/edit$/.test(path)) {
    const container = document.querySelector('[data-team-edit]');
    const form = document.querySelector('[data-team-edit-form]');

    if (container && form) {
      const competitionId = container.dataset.competitionId;
      const teamId = container.dataset.teamId;
      const runnersList = form.querySelector('[data-runners-list]');
      const addRunnerBtn = form.querySelector('[data-add-runner]');
      const submitBtn = form.querySelector('[data-team-edit-submit]');
      const errorEl = form.querySelector('[data-team-edit-error]');
      const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      const removedRunnerIds = new Set();

      function showEditError(message) {
        if (!errorEl) return;
        errorEl.textContent = message;
        errorEl.hidden = false;
      }

      function clearEditError() {
        if (!errorEl) return;
        errorEl.textContent = '';
        errorEl.hidden = true;
      }

      function runnerRows() {
        return Array.prototype.slice.call(
          runnersList ? runnersList.querySelectorAll('[data-runner-row]') : []
        );
      }

      function refreshEditRunnerRows() {
        runnerRows().forEach(function (row, index) {
          const radio = row.querySelector('[data-captain-radio]');
          const remove = row.querySelector('[data-remove-runner]');
          if (radio) radio.value = String(index);
          if (remove) remove.hidden = runnerRows().length <= 1;
        });
      }

      function normalizeCpf(cpf) {
        const digits = String(cpf || '').replace(/\D/g, '');
        return digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6, 9) + '-' + digits.slice(9);
      }

      function addEditRunnerRow() {
        const rows = runnerRows();
        if (!runnersList || rows.length >= 16) {
          showEditError('Cada equipe pode ter no máximo 16 atletas.');
          return;
        }

        const clone = rows[0].cloneNode(true);
        clone.dataset.runnerId = '';
        clone.querySelectorAll('input').forEach(function (input) {
          if (input.type === 'radio') {
            input.checked = false;
          } else {
            input.value = '';
            input.removeAttribute('readonly');
          }
        });
        runnersList.appendChild(clone);
        refreshEditRunnerRows();
      }

      function readEditRunner(row, index, captainIndex) {
        const id = row.dataset.runnerId ? Number(row.dataset.runnerId) : null;
        const name = row.querySelector('[data-runner-name]').value.trim();
        const cpf = row.querySelector('[data-runner-cpf]').value.trim();
        const email = row.querySelector('[data-runner-email]').value.trim();
        const phone = row.querySelector('[data-runner-phone]').value.trim();
        const cpfDigits = cpf.replace(/\D/g, '');

        if (!name) throw new Error('Nome do atleta é obrigatório.');
        if (!id && !cpfRegex.test(cpf)) throw new Error('CPF inválido para ' + name + '.');
        if (!emailRegex.test(email)) throw new Error('Email inválido para ' + name + '.');

        const payload = {
          name: name,
          email: email,
          status: index === captainIndex ? 'captain' : 'runner',
        };

        if (!id) payload.cpf = normalizeCpf(cpfDigits);
        if (phone) payload.phone = phone;

        return { id: id, payload: payload, cpfKey: cpfDigits, emailKey: email.toLowerCase() };
      }

      function validateAndBuildEditPayload() {
        const teamNameInput = form.querySelector('[data-team-name]');
        const teamName = teamNameInput ? teamNameInput.value.trim() : '';
        if (!teamName) throw new Error('Nome da equipe é obrigatório.');

        const selectedCaptain = form.querySelector('input[name="captain_index"]:checked');
        if (!selectedCaptain) throw new Error('Selecione um capitão.');

        const captainIndex = Number(selectedCaptain.value);
        const cpfs = new Set();
        const emails = new Set();
        const runners = runnerRows().map(function (row, index) {
          const runner = readEditRunner(row, index, captainIndex);
          if (runner.cpfKey && cpfs.has(runner.cpfKey)) throw new Error('Há CPFs duplicados no formulário.');
          if (emails.has(runner.emailKey)) throw new Error('Há emails duplicados no formulário.');
          if (runner.cpfKey) cpfs.add(runner.cpfKey);
          emails.add(runner.emailKey);
          return runner;
        });

        if (runners.length === 0) throw new Error('Cadastre pelo menos um atleta.');

        return { teamName: teamName, runners: runners };
      }

      async function requestJson(url, options) {
        const res = await fetch(url, options);
        if (!res.ok && res.status !== 204) {
          const data = await res.json().catch(function () { return { message: 'Erro inesperado.' }; });
          throw new Error(data.message || 'HTTP ' + res.status);
        }
        return res.status === 204 ? null : res.json();
      }

      async function submitEditTeam(event) {
        event.preventDefault();
        clearEditError();

        let payload;
        try {
          payload = validateAndBuildEditPayload();
        } catch (err) {
          showEditError(err.message);
          return;
        }

        const originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Salvando...';
        }

        try {
          await requestJson('/competitions/' + competitionId + '/teams/' + teamId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: payload.teamName }),
          });

          for (const removedId of removedRunnerIds) {
            await requestJson('/competitions/' + competitionId + '/teams/' + teamId + '/runners/' + removedId, {
              method: 'DELETE',
            });
          }

          for (const runner of payload.runners) {
            if (runner.id) {
              await requestJson('/competitions/' + competitionId + '/teams/' + teamId + '/runners/' + runner.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(runner.payload),
              });
            } else {
              await requestJson('/competitions/' + competitionId + '/teams/' + teamId + '/runners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(runner.payload),
              });
            }
          }

          window.location.href = '/teams/' + teamId + '?competitionId=' + encodeURIComponent(competitionId);
        } catch (err) {
          showEditError(err.message || 'Não foi possível salvar a equipe.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        }
      }

      if (addRunnerBtn) addRunnerBtn.addEventListener('click', addEditRunnerRow);
      if (runnersList) {
        runnersList.addEventListener('click', function (event) {
          const remove = event.target.closest('[data-remove-runner]');
          if (!remove) return;
          const row = remove.closest('[data-runner-row]');
          if (row && runnerRows().length > 1) {
            if (row.dataset.runnerId) removedRunnerIds.add(row.dataset.runnerId);
            row.remove();
            refreshEditRunnerRows();
          }
        });
      }
      form.addEventListener('submit', submitEditTeam);
      refreshEditRunnerRows();
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
          '&teamId=' + encodeURIComponent(teamId) +
          '&mode=manual';
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
          const activeRunnerId = panel.dataset.activeRunnerId;
          const competitionId = panel.dataset.competitionId;
          const teamId = panel.dataset.teamId;
          if (!activeRunnerId || !competitionId || !teamId) {
            showTeamToast('Selecione um atleta ativo antes de capturar a foto.');
            return;
          }
          window.location.href = '/operational-panel/' + activeRunnerId +
            '?competitionId=' + encodeURIComponent(competitionId) +
            '&teamId=' + encodeURIComponent(teamId);
        });
      }

      refreshSelectedHighlight();
    }
  }

  // Registro manual (/operational-panel)
  if (path === '/operational-panel' || path.startsWith('/operational-panel/')) {
    function getTimeFromParts(h, m, s) {
      return (String(h.value || '0').padStart(2, '0') + ':' +
              String(m.value || '0').padStart(2, '0') + ':' +
              String(s.value || '0').padStart(2, '0'));
    }

    function filterNumericInput() {
      this.value = this.value.replace(/\D/g, '').slice(0, 2);
    }

    document.querySelectorAll('.time-part').forEach(function (input) {
      input.addEventListener('input', filterNumericInput);
    });

    function normalizeDecimalForApi(value) {
      return Number(String(value || '').trim().replace(',', '.'));
    }

    function durationToSeconds(value) {
      const parts = String(value || '').trim().split(':').map(function (part) { return Number(part); });
      if (parts.length === 2 && parts.every(Number.isFinite)) {
        return parts[0] * 60 + parts[1];
      }
      if (parts.length === 3 && parts.every(Number.isFinite)) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      return null;
    }

    function calculatePaceFromDistanceAndTime(distanceValue, timeValue) {
      const distance = normalizeDecimalForApi(distanceValue);
      const seconds = durationToSeconds(timeValue);
      if (!Number.isFinite(distance) || distance <= 0 || seconds === null || seconds <= 0) return '';
      const secondsPerKm = Math.round(seconds / distance);
      const minutes = Math.floor(secondsPerKm / 60);
      const remainingSeconds = secondsPerKm % 60;
      return formatPacePartsForApi(minutes, remainingSeconds);
    }

    const ocrPanel = document.querySelector('[data-ocr-panel]');
    if (ocrPanel) {
      const captureStep = ocrPanel.querySelector('[data-ocr-step="capture"]');
      const reviewStep = ocrPanel.querySelector('[data-ocr-step="review"]');
      const manualMode = ocrPanel.querySelector('[data-manual-mode]');
      if (ocrPanel.dataset.startMode === 'manual') {
        showStep('manual');
      }
      const fileInput = ocrPanel.querySelector('[data-ocr-image-input]');
      const openFileBtn = ocrPanel.querySelector('[data-ocr-open-file]');
      const capturePreview = ocrPanel.querySelector('[data-ocr-capture-preview]');
      const reviewPreview = ocrPanel.querySelector('[data-ocr-review-preview]');
      const emptyPreview = ocrPanel.querySelector('[data-ocr-empty-preview]');
      const captureFeedback = ocrPanel.querySelector('[data-ocr-capture-feedback]');
      const reviewFeedback = ocrPanel.querySelector('[data-ocr-review-feedback]');
      const saveBtn = ocrPanel.querySelector('[data-ocr-save]');
      const retakeBtn = ocrPanel.querySelector('[data-ocr-retake]');
      const distanceInput = ocrPanel.querySelector('[data-ocr-distance]');
      const paceInput = ocrPanel.querySelector('[data-ocr-pace]');
      const timeInputH = ocrPanel.querySelector('[data-ocr-time-h]');
      const timeInputM = ocrPanel.querySelector('[data-ocr-time-m]');
      const timeInputS = ocrPanel.querySelector('[data-ocr-time-s]');
      const discrepancy = ocrPanel.querySelector('[data-ocr-discrepancy]');
      const discrepancyText = ocrPanel.querySelector('[data-ocr-discrepancy-text]');
      const capturedClock = ocrPanel.querySelector('[data-ocr-captured-clock]');
      const contextInputs = ocrPanel.querySelectorAll('[data-ocr-context]');
      const ocrState = {
        extraction: null,
        previewObjectUrl: null,
        originalValues: null,
      };
      if (paceInput) paceInput.readOnly = true;

      function readContextNumber(name) {
        const input = Array.prototype.find.call(contextInputs, function (item) {
          return item.name === name;
        });
        return Number(input ? input.value : '');
      }

      function setOcrFeedback(target, message, isError) {
        if (!target) return;
        target.textContent = message || '';
        target.dataset.state = isError ? 'error' : (message ? 'success' : '');
      }

      function showStep(step) {
        if (captureStep) captureStep.hidden = step !== 'capture';
        if (reviewStep) reviewStep.hidden = step !== 'review';
        if (manualMode) manualMode.hidden = step !== 'manual';
      }


      function normalizeOcrTime(value) {
        const raw = String(value || '').trim();
        if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw;
        const parts = raw.split(':').map(function (part) { return Number(part); });
        if (parts.length === 2 && parts.every(Number.isFinite)) {
          return '00:' + String(parts[0]).padStart(2, '0') + ':' + String(parts[1]).padStart(2, '0');
        }
        if (parts.length === 3 && parts.every(Number.isFinite)) {
          return String(parts[0]).padStart(2, '0') + ':' +
            String(parts[1]).padStart(2, '0') + ':' +
            String(parts[2]).padStart(2, '0');
        }
        return raw;
      }

      function updateOcrSourceNotice(result) {
        const usedGroq = result && result.source === 'groq+tesseract';
        if (discrepancy) discrepancy.hidden = !usedGroq;
        if (!usedGroq) return;

        const title = discrepancy ? discrepancy.querySelector('strong') : null;
        if (title) title.textContent = 'Analise complementar utilizada';
        if (discrepancyText) {
          discrepancyText.textContent =
            'O Tesseract nao conseguiu concluir a leitura sozinho, entao o Groq foi usado como apoio. Confira os campos e tente tirar a proxima foto mais centralizada no painel da esteira.';
        }
      }

      function fillReview(result) {
        const metrics = result.metrics || {};
        const distance = String(metrics.distanceKm || '').replace(',', '.');
        const time = normalizeOcrTime(metrics.time);
        const pace = calculatePaceFromDistanceAndTime(distance, time);
        if (distanceInput) distanceInput.value = distance;
        if (paceInput) paceInput.value = pace;
        var parts = time.split(':');
        if (timeInputH) timeInputH.value = parts[0] || '';
        if (timeInputM) timeInputM.value = parts[1] || '';
        if (timeInputS) timeInputS.value = parts[2] || '';
        ocrState.originalValues = { distance: distance, pace: pace, time: time };
        updateOcrSourceNotice(result);
        if (saveBtn) saveBtn.disabled = false;
      }

      async function uploadAndExtract(file) {
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        if (ocrState.previewObjectUrl) URL.revokeObjectURL(ocrState.previewObjectUrl);
        ocrState.previewObjectUrl = objectUrl;
        if (capturePreview) {
          capturePreview.src = objectUrl;
          capturePreview.hidden = false;
        }
        if (emptyPreview) emptyPreview.hidden = true;

        setOcrFeedback(captureFeedback, 'Executando OCR...', false);
        if (openFileBtn) openFileBtn.disabled = true;

        try {
          const formData = new FormData();
          formData.append('image', file);
          const response = await fetch(ocrPanel.dataset.ocrEndpoint || '/ocr/extractions', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json().catch(function () { return {}; });
          if (!response.ok) throw new Error(data.message || data.error || 'OCR falhou.');

          ocrState.extraction = data;
          const previewUrl = data.previewUrl || objectUrl;
          if (reviewPreview) reviewPreview.src = previewUrl;
          if (capturedClock) capturedClock.textContent = new Date().toLocaleTimeString('pt-BR');
          fillReview(data);
          setOcrFeedback(captureFeedback, '', false);
          setOcrFeedback(reviewFeedback, 'Dados extraidos. Revise antes de salvar.', false);
          showStep('review');
        } catch (err) {
          setOcrFeedback(captureFeedback, err.message || 'OCR falhou.', true);
        } finally {
          if (openFileBtn) openFileBtn.disabled = false;
        }
      }

      function buildOcrCheckpointPayload() {
        const distance = normalizeDecimalForApi(distanceInput ? distanceInput.value : '');
        const idRunner = readContextNumber('id_runner');
        const idCompetition = readContextNumber('id_competition');
        const idAdmin = readContextNumber('id_admin');
        if (!Number.isFinite(distance) || distance < 0) {
          throw new Error('Distancia deve ser um numero nao negativo.');
        }
        if (!idRunner || !idCompetition || !idAdmin) {
          throw new Error('Contexto do checkpoint incompleto (Admin ou Competição ausentes). Volte ao painel da equipe e tente novamente.');
        }

        const nowIso = new Date().toISOString();
        const time = getTimeFromParts(timeInputH, timeInputM, timeInputS);
        const pace = calculatePaceFromDistanceAndTime(distanceInput ? distanceInput.value : '', time);
        const edited = !ocrState.originalValues ||
          String(distanceInput ? distanceInput.value : '') !== String(ocrState.originalValues.distance) ||
          getTimeFromParts(timeInputH, timeInputM, timeInputS) !== String(ocrState.originalValues.time);

        const payload = {
          identifier: (edited ? 'OCR-EDITED-' : 'OCR-') + nowIso.replace(/[-:.]/g, '').slice(0, 15) + '-' + idRunner,
          distance_km: distance,
          id_runner: idRunner,
          id_competition: idCompetition,
          id_admin: idAdmin,
          image: {
            input_method: 'ocr',
            corrected_manually: edited,
            recorded_at: nowIso,
            preview_url: ocrState.extraction ? ocrState.extraction.previewUrl : null,
            source: ocrState.extraction ? ocrState.extraction.source : null,
            metrics: ocrState.extraction ? ocrState.extraction.metrics : null,
            tesseract: ocrState.extraction ? ocrState.extraction.tesseract : null,
          },
        };
        if (pace) payload.pace = pace;
        if (time) payload.time = time;
        return payload;
      }

      if (openFileBtn && fileInput) {
        openFileBtn.addEventListener('click', function () { fileInput.click(); });
      }
      if (fileInput) {
        fileInput.addEventListener('change', function () {
          uploadAndExtract(fileInput.files && fileInput.files[0]);
        });
      }
      ocrPanel.querySelectorAll('[data-open-manual]').forEach(function (button) {
        button.addEventListener('click', function () { showStep('manual'); });
      });
      ocrPanel.querySelectorAll('[data-ocr-cancel]').forEach(function (button) {
        button.addEventListener('click', function () { window.history.back(); });
      });
      if (retakeBtn) {
        retakeBtn.addEventListener('click', function () {
          if (fileInput) fileInput.value = '';
          if (saveBtn) saveBtn.disabled = true;
          setOcrFeedback(reviewFeedback, '', false);
          showStep('capture');
        });
      }
      function updateOcrPace() {
        if (!paceInput) return;
        paceInput.value = calculatePaceFromDistanceAndTime(
          distanceInput ? distanceInput.value : '',
          getTimeFromParts(timeInputH, timeInputM, timeInputS)
        );
        updateOcrSourceNotice(ocrState.extraction);
      }

      if (distanceInput) distanceInput.addEventListener('input', updateOcrPace);
      [timeInputH, timeInputM, timeInputS].forEach(function (input) {
        if (input) input.addEventListener('input', updateOcrPace);
      });
      if (saveBtn) {
        saveBtn.addEventListener('click', async function () {
          const originalLabel = saveBtn.textContent;
          let payload;
          try {
            payload = buildOcrCheckpointPayload();
          } catch (err) {
            setOcrFeedback(reviewFeedback, err.message, true);
            return;
          }

          saveBtn.disabled = true;
          saveBtn.textContent = 'Salvando...';
          setOcrFeedback(reviewFeedback, '', false);
          try {
            const response = await fetch(ocrPanel.dataset.endpoint || '/checkpoints', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const data = await response.json().catch(function () { return {}; });
            if (!response.ok) throw new Error(data.message || 'Erro ao salvar checkpoint.');
            setOcrFeedback(reviewFeedback, 'Checkpoint salvo com sucesso.', false);
          } catch (err) {
            setOcrFeedback(reviewFeedback, err.message || 'Erro ao salvar checkpoint.', true);
          } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = originalLabel;
          }
        });
      }
    }

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

      const manualDistanceInput = form.querySelector('input[name="distance_km"]');
      const manualPaceInput = form.querySelector('input[name="pace"]');
      const manualTimeH = form.querySelector('input[name="time_hours"]');
      const manualTimeM = form.querySelector('input[name="time_minutes"]');
      const manualTimeS = form.querySelector('input[name="time_seconds"]');

      function updateManualPace() {
        if (!manualDistanceInput || !manualPaceInput) return;
        manualPaceInput.value = calculatePaceFromDistanceAndTime(
          manualDistanceInput.value,
          getTimeFromParts(manualTimeH, manualTimeM, manualTimeS)
        );
      }

      if (manualDistanceInput) {
        manualDistanceInput.addEventListener('input', updateManualPace);
      }
      [manualTimeH, manualTimeM, manualTimeS].forEach(function (input) {
        if (input) input.addEventListener('input', updateManualPace);
      });

      function normalizePace(value) {
        return normalizePaceForApi(value);
      }

      function buildCheckpointPayload() {
        const data = new FormData(form);
        const distance = Number(data.get('distance_km'));
        const idRunner = Number(data.get('id_runner'));
        const idCompetition = Number(data.get('id_competition'));
        const idAdmin = Number(data.get('id_admin'));

        if (!Number.isFinite(distance) || distance < 0) {
          throw new Error('Distância deve ser um número não negativo.');
        }
        if (!idRunner || !idCompetition || !idAdmin) {
          throw new Error('Contexto do checkpoint incompleto (Admin ou Competição ausentes). Volte ao painel da equipe e tente novamente.');
        }

        const nowIso = new Date().toISOString();
        const identifier = String(data.get('identifier') || '').trim() ||
          'MANUAL-' + nowIso.replace(/[-:.]/g, '').slice(0, 15) + '-' + idRunner;
        const payload = {
          identifier: identifier,
          distance_km: distance,
          id_runner: idRunner,
          id_competition: idCompetition,
          id_admin: idAdmin,
          image: {
            input_method: form.dataset.inputMethod || 'manual',
            recorded_at: nowIso,
          },
        };
        const pace = normalizePace(data.get('pace'));
        const time = getTimeFromParts(manualTimeH, manualTimeM, manualTimeS);
        if (pace) payload.pace = pace;
        if (time !== '00:00:00') payload.time = time;

        return payload;
      }

      function detectOutliers(payload) {
        var warnings = [];

        if (payload.distance_km > 20) {
          var guess = (payload.distance_km / 10).toFixed(1);
          warnings.push('Distancia ' + payload.distance_km + 'km parece muito alta. Talvez seja ' + guess + 'km (virgula faltando?)');
        } else if (payload.distance_km > 0 && payload.distance_km < 0.3) {
          warnings.push('Distancia ' + payload.distance_km + 'km parece muito baixa. Faltou um zero?');
        }

        if (payload.time) {
          var parts = payload.time.split(':').map(Number);
          var totalMin = parts[0] * 60 + parts[1] + parts[2] / 60;
          if (totalMin > 30) {
            warnings.push('Tempo ' + payload.time + ' parece longo demais para um checkpoint.');
          }
        }

        return warnings;
      }

      if (!submitBtn) return;

      submitBtn.addEventListener('click', async function () {
        const originalLabel = submitBtn.textContent;
        let payload;

        try {
          payload = buildCheckpointPayload();
        } catch (err) {
          showManualFeedback(err.message, true);
          return;
        }

        var warnings = detectOutliers(payload);
        if (warnings.length > 0) {
          var msg = 'ATENCAO:\n' + warnings.join('\n') + '\n\nDeseja salvar mesmo assim?';
          if (!confirm(msg)) {
            showManualFeedback('Salvamento cancelado. Revise os dados.', true);
            return;
          }
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';
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

          showManualFeedback('Checkpoint realizado com sucesso!', false);
          console.log('Checkpoint manual salvo, status:', res.status);
        } catch (err) {
          console.error('Erro ao salvar checkpoint manual:', err);
          showManualFeedback('ERRO: ' + err.message, true);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      });

      if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
          window.history.back();
        });
      }
    }
  }

  // Painel público da equipe (/public/team/:uuid)
  if (path.startsWith('/public/team/')) {
    // The "Criar Post" button on the runner page is no longer used; it has been removed as part of the migration to public team URLs.
    const restOptions = Array.isArray(window.RUNNER_REST_OPTIONS)
      ? window.RUNNER_REST_OPTIONS
      : [];
    const select = document.querySelector('[data-rest-runner-select]');
    const percent = document.querySelector('[data-rest-percent]');
    const progress = document.querySelector('[data-rest-circle-progress]');
    const label = document.querySelector('[data-rest-circle-label]');
    const status = document.querySelector('[data-rest-status]');
    const statusText = document.querySelector('[data-rest-status-text]');
    const description = document.querySelector('[data-rest-description]');
    const lastCheckpoint = document.querySelector('[data-rest-last-checkpoint] strong');

    function updateRestCalculator(runnerId) {
      const selected = restOptions.find(function (option) {
        return String(option.id) === String(runnerId);
      });
      if (!selected) return;

      if (percent) percent.textContent = selected.restPct + '%';
      if (progress) {
        progress.setAttribute('stroke-dashoffset', String(selected.restOffset));
        progress.setAttribute(
          'stroke',
          selected.restPct >= 100 ? 'var(--verde)' : 'var(--amarelo)'
        );
      }
      if (label) {
        label.setAttribute(
          'aria-label',
          selected.restPct + '% do tempo de descanso concluído'
        );
      }
      if (status) {
        status.classList.toggle('ready', selected.restPct >= 100);
        status.classList.toggle('resting', selected.restPct < 100);
      }
      if (statusText) statusText.textContent = selected.statusLabel;
      if (description) description.textContent = selected.description;
      if (lastCheckpoint) {
        lastCheckpoint.textContent = selected.hasCheckpoint
          ? selected.lastCheckpointAt
          : '—';
      }
    }

    if (select) {
      select.addEventListener('change', function () {
        updateRestCalculator(select.value);
      });
      updateRestCalculator(select.value);
    }
  }
  // ── Compartilhar — Página de seleção ───────────────────────────────────────
  if (document.querySelector('[data-share-page]')) {
    const sharePage = document.querySelector('[data-share-page]');
    const teamUuid = sharePage.dataset.teamUuid;
    const select = document.querySelector('[data-share-athlete-select]');
    const generateBtn = document.querySelector('[data-share-generate="athlete"]');

    function updateAthleteButton() {
      if (!select || !generateBtn) return;
      const selected = select.value;
      const canGenerate = Boolean(selected && teamUuid);

      if ('disabled' in generateBtn) {
        generateBtn.disabled = !canGenerate;
      }
      generateBtn.toggleAttribute('disabled', !canGenerate);
      generateBtn.setAttribute('aria-disabled', canGenerate ? 'false' : 'true');

      if (generateBtn.tagName === 'A') {
        generateBtn.href = canGenerate
          ? '/public/team/' + teamUuid + '/share/template/athlete?runnerId=' + selected
          : '#';
      }
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', function (event) {
        const selected = select ? select.value : '';
        if (!selected || !teamUuid) {
          event.preventDefault();
          if (select) select.focus();
          return;
        }

        window.location.assign('/public/team/' + teamUuid + '/share/template/athlete?runnerId=' + encodeURIComponent(selected));
      });
    }

    if (select) {
      select.addEventListener('change', updateAthleteButton);
      updateAthleteButton();
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
      (hrefPath === '/reports' && (path === '/reports' || /\/view\/competitions\/\d+\/reports(?:\/|$)/.test(path))) ||
      (hrefPath === '/teams' && (path === '/teams' || path.startsWith('/teams/') || /\/view\/competitions\/\d+\/teams(?:\/|$)/.test(path))) ||
      (hrefPath.includes('/share') && (path === hrefPath || path.startsWith(hrefPath + '/template/')));

    if (isActive) {
      item.classList.add('active');
      item.closest('.nav-item-wrapper').classList.add('active');
    }
  });

  // Auditoria: dropdown de equipe em reports
  var auditTeamSelect = document.getElementById('audit-team-select');
  var auditLink = document.getElementById('audit-link');
  if (auditTeamSelect && auditLink && window.COMPETITION_ID) {
    function updateAuditLink() {
      var teamId = auditTeamSelect.value;
      if (teamId) {
        auditLink.href =
          '/view/competitions/' + encodeURIComponent(window.COMPETITION_ID) +
          '/teams/' + encodeURIComponent(teamId) +
          '/checkpoints/saved';
        auditLink.classList.remove('report-action-button--disabled');
        auditLink.setAttribute('aria-disabled', 'false');
      } else {
        auditLink.href = '#';
        auditLink.classList.add('report-action-button--disabled');
        auditLink.setAttribute('aria-disabled', 'true');
      }
    }

    auditTeamSelect.addEventListener('change', updateAuditLink);
    updateAuditLink();

    auditLink.addEventListener('click', function (event) {
      if (auditLink.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
      }
    });
  }

  // ============================================================
  // RANKING — Auto-polling (1 min)
  // ============================================================
  var competitionId = window.COMPETITION_ID;
  var isAdmin = window.IS_ADMIN;

  if (competitionId) {
    var pollIntervalMs = 60 * 1000;

    fetchRanking(competitionId, isAdmin);
    setInterval(function () { fetchRanking(competitionId, isAdmin); }, pollIntervalMs);
  }

  // ============================================================
  // REPORTS — Chart.js gráfico de km acumulado por equipe
  // ============================================================
  if (window.EQUIPE_HORÁRIO_KM) {
    var kmCanvas = document.getElementById('kmChart');
    if (kmCanvas && typeof Chart !== 'undefined') {
      var hourlyData = window.EQUIPE_HORÁRIO_KM;
      var colors = ['#d2003c', '#0f0069', '#ffcc00', '#233972'];
      var datasets = hourlyData.datasets.map(function (ds, index) {
        return {
          label: ds.team_name,
          data: ds.data,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '33',
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: colors[index % colors.length],
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.3,
          fill: false,
        };
      });

      new Chart(kmCanvas, {
        type: 'line',
        data: {
          labels: hourlyData.labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                font: { family: 'Montserrat', size: 12, weight: 'bold' },
                color: '#0f0069',
                usePointStyle: true,
                padding: 16,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Horas',
                font: { family: 'Montserrat', size: 12, weight: 'bold' },
                color: '#0f0069',
              },
              ticks: {
                font: { family: 'Montserrat', size: 11 },
                color: '#0f0069',
              },
              grid: { color: '#dadada' },
            },
            y: {
              title: {
                display: true,
                text: 'Distância (km)',
                font: { family: 'Montserrat', size: 12, weight: 'bold' },
                color: '#0f0069',
              },
              ticks: {
                font: { family: 'Montserrat', size: 11 },
                color: '#0f0069',
              },
              grid: { color: '#dadada' },
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  // ============================================================
  // DASHBOARD — Filtro e paginação de competições
  // ============================================================
  if (path === '/dashboard') {
    (function () {
      var ITEMS_PER_PAGE = 5;
      var cards = Array.from(document.querySelectorAll('#competition-list .db-competition-card'));
      var listEl = document.getElementById('competition-list');
      var paginationEl = document.getElementById('pagination');
      var infoEl = document.getElementById('pagination-info');
      var prevBtn = document.getElementById('prev-page');
      var nextBtn = document.getElementById('next-page');
      var statusFilter = document.getElementById('filter-status');
      var dateFilter = document.getElementById('filter-date');
      var locationFilter = document.getElementById('filter-location');
      var resetBtn = document.getElementById('filter-reset');

      if (!cards.length) return;

      var noResults = document.createElement('div');
      noResults.className = 'db-card';
      noResults.id = 'no-results-msg';
      noResults.style.display = 'none';
      noResults.innerHTML = '<h3 class="db-card-heading">Nenhuma competição encontrada</h3><hr class="db-divider" /><p class="db-card-body">Nenhuma competição corresponde aos filtros aplicados.</p>';
      listEl.appendChild(noResults);

      var currentPage = 1;

      function getFilteredCards() {
        var status = statusFilter.value;
        var date = dateFilter.value;
        var location = locationFilter.value.toLowerCase().trim();

        return cards.filter(function (card) {
          var cardStatus = card.getAttribute('data-status');
          var cardDate = card.getAttribute('data-date');
          var cardLocation = card.getAttribute('data-location');

          if (status === 'ativas' && cardStatus !== 'in_progress') return false;
          if (status !== 'all' && status !== 'ativas' && cardStatus !== status) return false;
          if (date && cardDate !== date) return false;
          if (location && !cardLocation.includes(location)) return false;

          return true;
        });
      }

      function render() {
        var filtered = getFilteredCards();
        var totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var start = (currentPage - 1) * ITEMS_PER_PAGE;
        var end = start + ITEMS_PER_PAGE;
        var pageItems = filtered.slice(start, end);

        cards.forEach(function (card) { card.style.display = 'none'; });
        noResults.style.display = 'none';

        if (filtered.length === 0) {
          noResults.style.display = 'block';
          paginationEl.style.display = 'none';
        } else {
          pageItems.forEach(function (card) { card.style.display = 'flex'; });
          paginationEl.style.display = 'flex';
        }

        infoEl.textContent = (filtered.length > 0 ? (start + 1) + '-' + Math.min(end, filtered.length) : '0') + ' de ' + filtered.length;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
      }

      function handleAction(btnSelector, urlSuffix, confirmMsg, errorMsg) {
        document.querySelectorAll(btnSelector).forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = this.getAttribute('data-id');
            if (!confirm(confirmMsg)) return;
            fetch('/competitions/' + id + urlSuffix, { method: 'PATCH' })
              .then(function (r) {
                if (!r.ok) throw new Error('Erro');
                location.reload();
              })
              .catch(function () { alert(errorMsg); });
          });
        });
      }

      handleAction('.db-activate-btn', '/activate', 'Ativar esta competição?', 'Erro ao ativar competição');
      handleAction('.db-close-btn', '', 'Encerrar esta competição?', 'Erro ao encerrar competição');

      prevBtn.addEventListener('click', function () {
        if (currentPage > 1) { currentPage--; render(); }
      });

      nextBtn.addEventListener('click', function () {
        var totalPages = Math.max(1, Math.ceil(getFilteredCards().length / ITEMS_PER_PAGE));
        if (currentPage < totalPages) { currentPage++; render(); }
      });

      statusFilter.addEventListener('change', function () { currentPage = 1; render(); });
      dateFilter.addEventListener('change', function () { currentPage = 1; render(); });
      locationFilter.addEventListener('input', function () { currentPage = 1; render(); });

      resetBtn.addEventListener('click', function () {
        statusFilter.value = 'all';
        dateFilter.value = '';
        locationFilter.value = '';
        currentPage = 1;
        render();
      });

      render();
    })();
  }

  // ── Export Modal ──
  if (window.EXPORT_SHEETS && Array.isArray(window.EXPORT_SHEETS)) {
    const exportBtn = document.getElementById('export-btn');
    const modal = document.getElementById('export-modal');
    const backdrop = document.getElementById('export-modal-backdrop');
    const list = document.getElementById('export-sheets-list');
    const cancelBtn = document.getElementById('export-modal-cancel');
    const confirmBtn = document.getElementById('export-modal-confirm');
    const errorEl = document.getElementById('export-modal-error');

    if (!exportBtn || !modal || !backdrop || !list || !cancelBtn || !confirmBtn || !errorEl) {
      // skip if modal elements are missing
    } else {
      var selectedSheets = {};

      function renderSheetOptions() {
        list.innerHTML = '';
        window.EXPORT_SHEETS.forEach(function (sheet) {
          var option = document.createElement('label');
          option.className = 'export-sheet-option';
          if (selectedSheets[sheet.id]) option.classList.add('selected');

          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'export-sheet-checkbox';
          checkbox.checked = selectedSheets[sheet.id] || false;
          checkbox.dataset.sheetId = sheet.id;

          var info = document.createElement('div');
          info.className = 'export-sheet-info';

          var label = document.createElement('span');
          label.className = 'export-sheet-label';
          label.textContent = sheet.label;

          var desc = document.createElement('span');
          desc.className = 'export-sheet-desc';
          desc.textContent = sheet.description;

          info.appendChild(label);
          info.appendChild(desc);
          option.appendChild(checkbox);
          option.appendChild(info);

          option.addEventListener('click', function (e) {
            if (e.target === checkbox) return;
            checkbox.checked = !checkbox.checked;
            option.classList.toggle('selected', checkbox.checked);
            selectedSheets[checkbox.dataset.sheetId] = checkbox.checked;
            updateConfirmState();
          });

          checkbox.addEventListener('change', function () {
            option.classList.toggle('selected', checkbox.checked);
            selectedSheets[checkbox.dataset.sheetId] = checkbox.checked;
            updateConfirmState();
          });

          list.appendChild(option);
        });
      }

      function updateConfirmState() {
        var count = Object.keys(selectedSheets).filter(function (k) { return selectedSheets[k]; }).length;
        confirmBtn.disabled = count === 0;
      }

      function openExportModal() {
        window.EXPORT_SHEETS.forEach(function (sheet) {
          if (selectedSheets[sheet.id] === undefined) {
            selectedSheets[sheet.id] = true;
          }
        });
        renderSheetOptions();
        updateConfirmState();
        errorEl.textContent = '';
        modal.hidden = false;
      }

      function closeExportModal() {
        modal.hidden = true;
      }

      exportBtn.addEventListener('click', openExportModal);
      backdrop.addEventListener('click', closeExportModal);
      cancelBtn.addEventListener('click', closeExportModal);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) closeExportModal();
      });

      confirmBtn.addEventListener('click', async function () {
        var sheetIds = Object.keys(selectedSheets).filter(function (k) { return selectedSheets[k]; });
        if (sheetIds.length === 0) {
          errorEl.textContent = 'Selecione pelo menos uma aba para exportar.';
          return;
        }

        var competitionId = window.COMPETITION_ID;
        if (!competitionId) {
          errorEl.textContent = 'ID da competição não encontrado.';
          return;
        }

        var originalLabel = confirmBtn.textContent;
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Exportando...';
        errorEl.textContent = '';

        try {
          var res = await fetch('/competitions/' + encodeURIComponent(competitionId) + '/export/excel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheets: sheetIds }),
          });

          if (!res.ok) {
            var errData = await res.json().catch(function () { return {}; });
            throw new Error(errData.message || 'Erro ao exportar planilha.');
          }

          var blob = await res.blob();
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'relatorio_' + competitionId + '.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          closeExportModal();
        } catch (err) {
          errorEl.textContent = err.message || 'Erro ao exportar planilha.';
        } finally {
          confirmBtn.disabled = false;
          confirmBtn.textContent = originalLabel;
        }
      });
    }
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
  var remainingSeconds = rounded % 60;
  return formatPacePartsForDisplay(minutes, remainingSeconds);
}

function formatCheckpointPace(checkpoint) {
  if (checkpoint.pace) return stripPaceUnit(checkpoint.pace);
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

window.CHECKPOINTS = window.CHECKPOINTS || [];

(function () {
  const table = document.querySelector('.saved-data-table');
  const tbody = table && table.querySelector('tbody');
  const modal = document.getElementById('checkpoint-modal');
  const form = document.getElementById('checkpoint-form');
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');

  if (Array.isArray(window.CHECKPOINTS)) {
    window.CHECKPOINTS.forEach(function (cp) {
      if (cp && cp.created_at && cp.originalCreatedAt === undefined) {
        cp.originalCreatedAt = cp.created_at;
      }
    });
  }

  function openModal() {
    modal.style.display = 'flex';
    modal.removeAttribute('inert');
    modal.setAttribute('aria-hidden', 'false');
    const firstField = document.getElementById('cp-distance');
    if (firstField) firstField.focus();
  }

  function closeModal() {
    const activeElement = document.activeElement;
    if (modal.contains(activeElement) && activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }

    const fallback = document.querySelector('.saved-data-header') || document.body;
    if (fallback && typeof fallback.focus === 'function') {
      if (fallback === document.body && !document.body.hasAttribute('tabindex')) {
        document.body.setAttribute('tabindex', '-1');
      }
      fallback.focus();
    }

    window.setTimeout(function () {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('inert', '');
    }, 0);
  }

  function formatDistance(value) {
    if (value == null || value === '') return '--';
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return '--';
    return numeric.toLocaleString('pt-BR', {
      minimumFractionDigits: numeric % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1
    }) + ' km';
  }

  function updateCheckpointRow(row, checkpoint) {
    if (!row) return;
    const cells = row.querySelectorAll('td');
    if (cells.length < 9) return;
    const originalTime = checkpoint.originalCreatedAt || checkpoint.created_at;
    cells[1].textContent = originalTime
      ? new Date(originalTime).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      : '--:--:--';
    cells[3].textContent = formatDistance(checkpoint.distance_km);
    cells[4].textContent = checkpoint.pace || '--';
    cells[5].textContent = checkpoint.time || '--';
    cells[8].textContent = checkpoint.created_at
      ? new Date(checkpoint.created_at).toLocaleString('pt-BR')
      : 'Data nao informada';
  }

  function populateForm(cp) {
    const originalTime = cp.originalCreatedAt || cp.created_at;
    document.getElementById('cp-id').value = cp.id || '';
    document.getElementById('cp-created_at').textContent = originalTime ? new Date(originalTime).toLocaleString('pt-BR') : '';
    document.getElementById('cp-runner_name').textContent = (cp.runner && cp.runner.name) || '';
    document.getElementById('cp-distance').value = cp.distance_km ?? '';
    document.getElementById('cp-pace').value = cp.pace ?? '';
    document.getElementById('cp-time').value = cp.time ?? '';
    document.getElementById('cp-admin_name').textContent = (cp.admin && cp.admin.name) || '';
  }

  // Delegation: when any cell in tbody is clicked, open modal for that row
  if (tbody) {
    tbody.addEventListener('click', function (ev) {
      const tr = ev.target.closest('tr');
      if (!tr) return;
      // determine row index (zero-based) by counting preceding sibling TRs
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const rowIndex = rows.indexOf(tr);
      const cp = window.CHECKPOINTS[rowIndex];
      if (!cp) return;
      populateForm(cp);
      openModal();
    });
  }

  // Close handlers
  closeBtn && closeBtn.addEventListener('click', closeModal);
  cancelBtn && cancelBtn.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', function (ev) {
    // Fechar ao clicar fora do modal (no backdrop)
    if (ev.target === modal) closeModal();
  });

  // Submit form -> PUT /checkpoints/:id
  form && form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const id = document.getElementById('cp-id').value;
    const distanceValue = document.getElementById('cp-distance').value;
    const paceValue = document.getElementById('cp-pace').value.trim();
    const timeValue = document.getElementById('cp-time').value.trim();

    const payload = {};
    if (distanceValue !== '') {
      payload.distance_km = parseFloat(distanceValue);
    }
    if (paceValue !== '') {
      payload.pace = normalizePaceForApi(paceValue);
    }
    if (timeValue !== '') {
      payload.time = timeValue;
    }

    fetch('/checkpoints/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('Erro ao salvar');
      return res.json();
    }).then(function (updatedCheckpoint) {
      if (!updatedCheckpoint) {
        throw new Error('Resposta inválida do servidor');
      }

      const cp = window.CHECKPOINTS.find((c) => String(c.id) === String(id));
      if (cp) {
        cp.distance_km = updatedCheckpoint.distance_km;
        cp.pace = updatedCheckpoint.pace;
        cp.time = updatedCheckpoint.time;
        if (updatedCheckpoint.created_at) {
          cp.created_at = updatedCheckpoint.created_at;
        }
      }

      const row = tbody.querySelector(`tr[data-id="${id}"]`);
      const checkpointToRender = cp ? Object.assign({}, cp, updatedCheckpoint) : updatedCheckpoint;
      updateCheckpointRow(row, checkpointToRender);

      // Atualiza o formulário e fecha o modal somente após a linha ser atualizada.
      populateForm(checkpointToRender);
      closeModal();
    }).catch(function (err) {
      alert(err.message || 'Erro ao salvar checkpoint');
    });
  });
})();
