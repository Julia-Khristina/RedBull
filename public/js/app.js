// [D1] Padrão: verificação de autenticação + ativação de menu
document.addEventListener('DOMContentLoaded', function () {
  highlightCurrentNavigation();
  initManualCheckpointForm();
});

function highlightCurrentNavigation() {
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
    const wrapper = item.closest('.nav-item-wrapper');

    if (href && wrapper && path.startsWith(href)) {
      item.classList.add('active');
      wrapper.classList.add('active');
    }
  });
}

function initManualCheckpointForm() {
  const form = document.querySelector('[data-operational-manual-form]');

  if (!form) return;

  const cancelButton = form.querySelector('[data-manual-cancel]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    submitManualCheckpoint(form);
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', function () {
      resetManualCheckpointForm(form);
    });
  }
}

async function submitManualCheckpoint(form) {
  const submitButton = form.querySelector('[data-manual-submit]');
  const feedback = form.querySelector('[data-manual-form-feedback]');
  const rankingStatus = form.querySelector('[data-manual-ranking-status]');

  clearManualFieldErrors(form);
  setFeedback(feedback, '', '');
  setFeedback(rankingStatus, '', '');

  const validation = buildManualCheckpointPayload(form);

  if (!validation.ok) {
    setFeedback(feedback, validation.message, 'error');
    if (validation.field) markManualFieldInvalid(form, validation.field);
    return;
  }

  setButtonLoading(submitButton, true);
  setFeedback(feedback, 'Salvando registro manual...', 'loading');

  try {
    // [A1][B1][D1] Endpoint confirmado em agent.md, route e checkpointController.create.
    const response = await fetch(form.dataset.endpoint || '/checkpoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validation.payload),
    });

    if (!response.ok) {
      throw new Error(await readResponseError(response));
    }

    // [B1] checkpointController.create retorna o Checkpoint criado pelo service/repository.
    const checkpoint = await response.json();
    const checkpointLabel = checkpoint && checkpoint.id ? ` #${checkpoint.id}` : '';

    setFeedback(feedback, `Registro manual${checkpointLabel} salvo com sucesso.`, 'success');
    await refreshManualRanking(form, validation.payload.id_competition, rankingStatus);
  } catch (error) {
    setFeedback(
      feedback,
      error.message || 'Nao foi possivel salvar o registro manual.',
      'error'
    );
  } finally {
    setButtonLoading(submitButton, false);
  }
}

function buildManualCheckpointPayload(form) {
  const distanceField = getManualField(form, 'distance_km');
  const distance = readNumber(distanceField);

  if (distance === null || distance < 0) {
    return {
      ok: false,
      field: 'distance_km',
      message: 'Informe uma distancia em km maior ou igual a zero.',
    };
  }

  const idRunner = readContextInteger(form, 'id_runner');
  const idCompetition = readContextInteger(form, 'id_competition');
  const idTreadmill = readContextInteger(form, 'id_treadmill');
  const idAdmin = readContextInteger(form, 'id_admin');

  if (!idRunner) {
    return missingContextResult('id_runner', 'atleta selecionado');
  }

  if (!idCompetition) {
    return missingContextResult('id_competition', 'competicao');
  }

  if (!idTreadmill) {
    return missingContextResult('id_treadmill', 'esteira');
  }

  if (!idAdmin) {
    return missingContextResult('id_admin', 'administrador');
  }

  const identifierField = getManualField(form, 'identifier');
  const identifier = readText(identifierField) || buildManualIdentifier(idRunner);
  const paceResult = readOptionalPace(getManualField(form, 'pace'));
  const timeResult = readOptionalTime(getManualField(form, 'time'));

  if (!paceResult.ok) {
    return {
      ok: false,
      field: 'pace',
      message: "Use pace no formato mm:ss, mm:ss/km ou m'ss''.",
    };
  }

  if (!timeResult.ok) {
    return {
      ok: false,
      field: 'time',
      message: 'Use tempo total no formato mm:ss ou hh:mm:ss.',
    };
  }

  const payload = {
    identifier,
    distance_km: distance,
    id_runner: idRunner,
    id_competition: idCompetition,
    id_treadmill: idTreadmill,
    id_admin: idAdmin,
    // [A1][B1][D2] image aceita objeto JSON; usado como metadata manual porque nao ha campo input_method dedicado.
    image: {
      input_method: form.dataset.inputMethod || 'manual',
    },
  };

  if (paceResult.value) payload.pace = paceResult.value;
  if (timeResult.value) payload.time = timeResult.value;

  return {
    ok: true,
    payload,
  };
}

async function refreshManualRanking(form, competitionId, rankingStatus) {
  const template = form.dataset.rankingEndpointTemplate;

  if (!template || !competitionId) {
    setFeedback(rankingStatus, '', '');
    return;
  }

  const endpoint = template.replace(':id', String(competitionId));
  setFeedback(rankingStatus, 'Atualizando ranking...', 'loading');

  try {
    // [A1][B1][D1] Endpoint confirmado em rankingRoutes/rankingController/rankingService.
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(await readResponseError(response));
    }

    const ranking = await response.json();
    const count = Array.isArray(ranking) ? ranking.length : 0;
    setFeedback(rankingStatus, `Ranking atualizado (${count} equipes).`, 'success');
  } catch (error) {
    setFeedback(
      rankingStatus,
      error.message || 'Registro salvo, mas o ranking nao foi atualizado.',
      'error'
    );
  }
}

function resetManualCheckpointForm(form) {
  clearManualFieldErrors(form);
  setFeedback(form.querySelector('[data-manual-form-feedback]'), '', '');
  setFeedback(form.querySelector('[data-manual-ranking-status]'), '', '');

  form.querySelectorAll('[data-initial-value]').forEach(function (field) {
    field.value = field.dataset.initialValue || '';
  });
}

function getManualField(form, name) {
  return form.querySelector(`[name="${name}"]`);
}

function readText(field) {
  return field && typeof field.value === 'string' ? field.value.trim() : '';
}

function readNumber(field) {
  const rawValue = readText(field).replace(',', '.');

  if (!rawValue) return null;

  const number = Number(rawValue);
  return Number.isFinite(number) ? number : null;
}

function readPositiveInteger(field) {
  const value = readNumber(field);

  if (value === null || !Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function readContextInteger(form, name) {
  const field = getManualField(form, name);
  const fieldValue = readPositiveInteger(field);

  if (fieldValue) return fieldValue;

  // [A1][B1][C2][D1] Fallback para preservar o contexto SSR quando o preview mantem DOM antigo ou hidden vazio.
  const queryValue = new URLSearchParams(window.location.search).get(name);
  const parsedQueryValue = Number(queryValue);

  if (Number.isInteger(parsedQueryValue) && parsedQueryValue > 0) {
    if (field) field.value = String(parsedQueryValue);
    return parsedQueryValue;
  }

  return null;
}

function readOptionalPace(field) {
  const value = readText(field);

  if (!value) {
    return {
      ok: true,
      value: '',
    };
  }

  const normalized = value
    .replace(/\u2019/g, "'")
    .replace(/\u00b4/g, "'")
    .replace(/`/g, "'");
  const quoteMatch = normalized.match(/^(\d{1,3})\s*'\s*(\d{1,2})\s*''?$/);
  const colonMatch = normalized.match(/^(\d{1,3}):(\d{1,2})$/);
  const match = quoteMatch || colonMatch;

  if (!match) {
    return {
      ok: false,
    };
  }

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds > 59) {
    return {
      ok: false,
    };
  }

  return {
    ok: true,
    value: `${minutes}:${String(seconds).padStart(2, '0')}/km`,
  };
}

function readOptionalTime(field) {
  const value = readText(field);

  if (!value) {
    return {
      ok: true,
      value: '',
    };
  }

  const parts = value.split(':');

  if (parts.length < 2 || parts.length > 3) {
    return {
      ok: false,
    };
  }

  const numbers = parts.map(function (part) {
    return Number(part);
  });

  if (numbers.some(function (number) {
    return !Number.isInteger(number) || number < 0;
  })) {
    return {
      ok: false,
    };
  }

  const minutesIndex = numbers.length === 3 ? 1 : 0;
  const secondsIndex = numbers.length === 3 ? 2 : 1;

  if (numbers[minutesIndex] > 59 || numbers[secondsIndex] > 59) {
    return {
      ok: false,
    };
  }

  return {
    ok: true,
    value,
  };
}

function missingContextResult(field, label) {
  return {
    ok: false,
    field,
    message: `Nao foi possivel salvar: ${label} nao foi informado pelo contexto da pagina.`,
  };
}

function buildManualIdentifier(runnerId) {
  // [A1][B1][D2] identifier e obrigatorio/unico; fallback inferido para a tela manual sem campo visual no PNG.
  return `manual-${runnerId}-${Date.now()}`;
}

function markManualFieldInvalid(form, name) {
  const field = getManualField(form, name);

  if (field) {
    field.setAttribute('aria-invalid', 'true');
    field.focus();
  }
}

function clearManualFieldErrors(form) {
  form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
    field.removeAttribute('aria-invalid');
  });
}

function setButtonLoading(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = 'Salvando...';
    button.disabled = true;
    return;
  }

  button.textContent = button.dataset.originalText || 'Salvar registro manual';
  button.disabled = false;
}

function setFeedback(element, message, state) {
  if (!element) return;

  element.textContent = message;

  if (state) {
    element.dataset.state = state;
  } else {
    delete element.dataset.state;
  }
}

async function readResponseError(response) {
  try {
    const data = await response.json();

    if (data && typeof data.message === 'string') return data.message;
    if (data && typeof data.error === 'string') return data.error;
  } catch (_error) {
    return `Erro HTTP ${response.status}`;
  }

  return `Erro HTTP ${response.status}`;
}
