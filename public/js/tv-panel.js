/*
 * Painel TV — polling + countdown decrescente
 * US19 #519 — Tasks #522 (estrutura) + #523 (polimento)
 *
 * Comportamento:
 * - A cada 1s: atualiza o cronômetro decrescente localmente (smooth display).
 * - A cada poll-interval-ms (default 10s): bate em
 *   GET /public/competitions/:id/tv-panel/metrics e atualiza in-place as
 *   3 métricas, ressincronizando o countdown com o servidor.
 *
 * Marco zero do countdown = competition.started_at (gravado pelo BE quando
 * o admin aperta "ativar competição"). O servidor retorna elapsed_time_seconds
 * desde esse marco; o cliente calcula remaining = max(0, 24h - elapsed).
 *
 * Status:
 * - "not_started": elapsed_time_seconds vem null → exibe 24:00:00 cheio
 * - "in_progress": countdown decresce em tempo real
 * - "closed":      cronômetro congela no último remaining retornado pelo BE
 */
(function () {
  "use strict";

  var TOTAL_SECONDS = 24 * 60 * 60; // 86400 — Red Bull 24 Horas

  var panel = document.querySelector("[data-tv-panel]");
  if (!panel) return;

  var competitionId = panel.getAttribute("data-competition-id");
  var pollIntervalMs =
    parseInt(panel.getAttribute("data-poll-interval-ms"), 10) || 10000;

  var clockEl = document.querySelector("[data-tv-clock]");
  var titleEl = document.querySelector("[data-tv-title]");
  var kmEl = document.querySelector("[data-tv-km]");
  var paceEl = document.querySelector("[data-tv-pace]");
  var speedEl = document.querySelector("[data-tv-speed]");

  var baseElapsedSeconds = null;
  var baseTimestampMs = Date.now();
  var competitionStatus = clockEl
    ? clockEl.getAttribute("data-status")
    : "not_started";

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function formatRemainingTime(elapsedSeconds) {
    /* "not_started" → 24:00:00 cheio. */
    if (elapsedSeconds === null || !isFinite(elapsedSeconds)) {
      return formatHHMMSS(TOTAL_SECONDS);
    }
    var remaining = Math.max(0, TOTAL_SECONDS - Math.floor(elapsedSeconds));
    return formatHHMMSS(remaining);
  }

  function formatHHMMSS(seconds) {
    var total = Math.max(0, Math.floor(seconds));
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var secs = total % 60;
    return pad(hours) + ":" + pad(minutes) + ":" + pad(secs);
  }

  function formatKm(value) {
    if (value === null || value === undefined) return "0,0";
    return value.toFixed(1).replace(".", ",");
  }

  function formatPace(formattedPace) {
    return formattedPace || "--:--";
  }

  function formatSpeed(paceSeconds) {
    if (!paceSeconds || paceSeconds <= 0) return "--";
    return (3600 / paceSeconds).toFixed(1).replace(".", ",");
  }

  function readInitialClockState() {
    if (!clockEl) return;
    var elapsedAttr = clockEl.getAttribute("data-elapsed-seconds");
    var generatedAt = clockEl.getAttribute("data-generated-at");

    if (elapsedAttr !== "" && elapsedAttr !== null) {
      baseElapsedSeconds = parseFloat(elapsedAttr);
      baseTimestampMs = generatedAt ? Date.parse(generatedAt) : Date.now();
    }
  }

  function tickClock() {
    if (!clockEl) return;

    /* "closed": congela no último elapsed retornado pelo BE (que já
       limita ao último checkpoint). */
    if (competitionStatus === "closed") {
      clockEl.textContent = formatRemainingTime(baseElapsedSeconds);
      return;
    }

    /* "not_started": started_at é null no BE → mostra 24:00:00 cheio. */
    if (baseElapsedSeconds === null) {
      clockEl.textContent = formatRemainingTime(null);
      return;
    }

    var currentElapsed =
      baseElapsedSeconds + (Date.now() - baseTimestampMs) / 1000;
    clockEl.textContent = formatRemainingTime(currentElapsed);
  }

  function applyMetrics(payload) {
    if (!payload || !payload.metrics) return;

    var metrics = payload.metrics;

    if (titleEl && payload.competition_name) {
      titleEl.textContent = String(payload.competition_name).toUpperCase();
    }

    if (kmEl) kmEl.textContent = formatKm(metrics.total_distance_km);
    if (paceEl) paceEl.textContent = formatPace(metrics.average_pace_overall);
    if (speedEl)
      speedEl.textContent = formatSpeed(metrics.average_pace_overall_seconds);

    competitionStatus = payload.competition_status || competitionStatus;

    if (metrics.elapsed_time_seconds === null) {
      baseElapsedSeconds = null;
    } else {
      baseElapsedSeconds = metrics.elapsed_time_seconds;
      baseTimestampMs = payload.generated_at
        ? Date.parse(payload.generated_at)
        : Date.now();
    }

    if (clockEl) {
      clockEl.setAttribute("data-status", competitionStatus);
    }
  }

  function pollMetrics() {
    var url =
      "/public/competitions/" + competitionId + "/tv-panel/metrics";
    fetch(url, { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(applyMetrics)
      .catch(function (err) {
        // O countdown local continua decrescendo enquanto o polling se recupera.
        console.error("[tv-panel] polling falhou:", err);
      });
  }

  readInitialClockState();
  setInterval(tickClock, 1000);
  setInterval(pollMetrics, pollIntervalMs);
})();
