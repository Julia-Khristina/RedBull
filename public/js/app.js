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

  // ── Botão compartilhar — painel público de equipe (/public/team/:uuid)
  // Gatilho: click → copia o link único da equipe para clipboard → mostra toast por 2s
  var shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var uuid = shareBtn.dataset.shareUuid;
      // [A1] Link único da página pública desta equipe (agent.md Seção 10)
      var url = window.location.origin + '/public/team/' + uuid;
      navigator.clipboard.writeText(url).then(function () {
        var toast = document.getElementById('share-toast');
        if (toast) {
          toast.classList.remove('hidden');
          setTimeout(function () { toast.classList.add('hidden'); }, 2000);
        }
      }).catch(function (err) {
        console.error('Erro ao copiar link:', err);
      });
    });
  }

  // Ativar item do menu correspondente à rota atual
  document.querySelectorAll('.nav-item').forEach(function (item) {
    const href = item.getAttribute('href');
    if (href && path.startsWith(href)) {
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