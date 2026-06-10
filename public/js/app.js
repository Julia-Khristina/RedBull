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

  // Ativar item do menu correspondente à rota atual
  document.querySelectorAll('.nav-item').forEach(function (item) {
    const href = item.getAttribute('href');
    if (href && path.startsWith(href)) {
      item.classList.add('active');
      item.closest('.nav-item-wrapper').classList.add('active');
    }
  });
});